import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        reply: `✨ **BLVerse AI Concierge**: I'm ready to help you explore live-action BL series, manga, manhwa, manhua, and original novels! Currently, no \`GEMINI_API_KEY\` is configured in the environment settings.\n\nTo activate real-time Gemini model responses, add your API key in **Vercel Project Settings > Environment Variables**. In the meantime, you can explore the **Adaptations Flowchart**, **Calendar**, **Upcoming Tracker**, and browse our curated database directly!`,
        simulated: true
      });
    }

    const client = new GoogleGenAI({ apiKey });
    const systemInstruction = `You are "BLVerse Concierge", the knowledgeable, respectful, and enthusiastic AI assistant for BLVerse — a content discovery and relationship mapping platform for BL (Boys' Love) live-action series, manga, manhwa, manhua, web novels, adaptations, characters, and actors.
Your answers should be:
1. Passionate, knowledgeable, nuanced, and respectful of different cultures (Thai BL, Korean BL/K-BL, Japanese BL/J-BL, Taiwanese BL, Chinese Danmei/censored adaptations).
2. Detail-oriented regarding adaptation chains (Original Novel -> Comic/Webtoon -> Live-Action Series -> Actors/Cast).
3. Clear about facts vs speculation: clearly state if release dates are tentative/TBA.
4. Provide structured, readable answers with markdown bullets or highlights where helpful.`;

    let promptText = message;
    if (Array.isArray(history) && history.length > 0) {
      const historyContext = history
        .slice(-6)
        .map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'User' : 'BLVerse Assistant'}: ${h.text}`)
        .join('\n');
      promptText = `${historyContext}\nUser: ${message}`;
    }

    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const reply = response.text || 'I could not retrieve a response. Please try again.';
    return res.status(200).json({ reply, simulated: false });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    return res.status(500).json({
      error: 'Failed to generate response',
      details: error.message || 'Unknown error'
    });
  }
}
