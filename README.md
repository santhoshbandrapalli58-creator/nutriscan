# NutriScan

AI-powered nutrition scanner.

## Local Development (with mock AI)

```bash
npm install
npm run dev
```

AI analysis uses mock data locally.

## Full AI (Gemini)

1. Copy `.env.example` → `.env`
2. Get free API key from https://aistudio.google.com/app/apikey
3. Add to `.env`: `GEMINI_API_KEY=your_key`
4. Run API server:
   ```bash
   npm i -D vercel
   vercel dev
   ```
5. App at http://localhost:3000

## Deploy to Vercel

1. Push to GitHub
2. Connect to Vercel
3. Add GEMINI_API_KEY to Vercel env vars

## Barcodes to test
- Nutella: `3017620422003`
- Kellogg's: `0038000845260`

