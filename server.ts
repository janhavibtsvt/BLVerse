import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', app: 'BLVerse', version: '1.0.0' });
  });

  // AI Assistant endpoint ("Ask BLVerse")
  let aiClient: GoogleGenAI | null = null;
  function getGenAI() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return null;
      }
      aiClient = new GoogleGenAI({ apiKey });
    }
    return aiClient;
  }

  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      const client = getGenAI();
      if (!client) {
        return res.json({
          reply: `✨ **BLVerse AI Concierge**: I'm ready to help you explore live-action BL series, manga, manhwa, manhua, and original novels! Currently, no \`GEMINI_API_KEY\` is configured in the environment settings. 

To activate real-time Gemini model responses, add your API key in **Settings > Secrets**. In the meantime, you can explore the **Adaptations Flowchart**, **Calendar**, **Upcoming Tracker**, and browse our curated database directly!`,
          simulated: true
        });
      }

      const systemInstruction = `You are "BLVerse Concierge", the knowledgeable, respectful, and enthusiastic AI assistant for BLVerse — a content discovery and relationship mapping platform for BL (Boys' Love) live-action series, manga, manhwa, manhua, web novels, adaptations, characters, and actors.
Your answers should be:
1. Passionate, knowledgeable, nuanced, and respectful of different cultures (Thai BL, Korean BL/K-BL, Japanese BL/J-BL, Taiwanese BL, Chinese Danmei/censored adaptations).
2. Detail-oriented regarding adaptation chains (Original Novel -> Comic/Webtoon -> Live-Action Series -> Actors/Cast).
3. Clear about facts vs speculation: clearly state if release dates are tentative/TBA.
4. Provide structured, readable answers with markdown bullets or highlights where helpful.`;

      // Format conversation if history provided
      let promptText = message;
      if (Array.isArray(history) && history.length > 0) {
        const historyContext = history
          .slice(-6)
          .map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'User' : 'BLVerse Assistant'}: ${h.text}`)
          .join('\n');
        promptText = `${historyContext}\nUser: ${message}`;
      }

      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptText,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const reply = response.text || 'I could not retrieve a response. Please try again.';
      return res.json({ reply, simulated: false });
    } catch (error: any) {
      console.error('Gemini chat error:', error);
      return res.status(500).json({
        error: 'Failed to generate response',
        details: error.message || 'Unknown error'
      });
    }
  });

  // Vite middleware in dev or static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BLVerse Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
