# BLVerse | Discover the Stories Behind the Stories

A content discovery, relationship mapping, and timeline platform for BL (Boys' Love) live-action series, manga, manhwa, manhua, novels, and cross-media adaptations.

---

## 🚀 Deploying to Vercel

This project is pre-configured for **1-click zero-config deployment to Vercel** with full client-side SPA routing (`vercel.json`) and Vercel Serverless Functions (`/api/chat`, `/api/health`).

### Option 1: Deploy via Vercel Web Dashboard (Recommended)

1. **Push or Export Code to GitHub / GitLab / Bitbucket**:
   - Push this codebase to your Git repository.
2. **Import into Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your repository.
3. **Build & Output Settings**:
   - **Framework Preset**: `Vite` (automatically detected).
   - **Build Command**: `npm run build` or `vite build`.
   - **Output Directory**: `dist`.
4. **Environment Variables**:
   - `GEMINI_API_KEY`: *(Optional)* Your Google Gemini API Key if you want to enable the AI Concierge chat.
5. Click **Deploy**. Your app will be live with a free `.vercel.app` URL and automatic HTTPS!

---

### Option 2: Deploy via Vercel CLI

1. Install the Vercel CLI locally:
   ```bash
   npm i -g vercel
   ```
2. Run the deployment command in the project directory:
   ```bash
   vercel
   ```
3. To deploy directly to production:
   ```bash
   vercel --prod
   ```

---

## 🛠 Features

- **Interactive Adaptation Chain Visualizer**: Visual graph mapping original novels $\rightarrow$ comics $\rightarrow$ screen adaptations.
- **Media Catalog**: Filter by type (Series, Manga, Manhwa, Manhua, Novels), country, status, and tags.
- **Dedicated Authentic Art**: 100% unique, verified cover art across all 131 catalog items.
- **Actor Profiles & Cast Flow**: Explore actor filmographies, characters, and related series.
- **Releases Calendar & Upcoming Radar**: Track scheduled releases, volume launches, and production announcements.
- **AI Concierge**: Powered by Google Gemini (`gemini-2.5-flash`).

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local full-stack server
npm run dev
# App will run at http://localhost:3000
```
