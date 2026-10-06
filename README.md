# Briefora

A modern, mobile-first news briefing web app built with React + Vite.

## What is included

- India, International, Sports, Business, Technology and Science categories
- Date-wise browsing
- Search
- Bookmarks saved in localStorage
- Dark/light mode
- Inshorts-inspired visual news cards
- ~40-word summaries
- Important keywords
- Difficult vocabulary with simple meanings
- Responsive mobile/desktop UI
- API-ready service layer
- Mock data so the app works immediately
- No API key is exposed in the frontend

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Build for production

```bash
npm run build
npm run preview
```

## Connecting a real news API

The UI is intentionally separated from the news provider.

Set:

```env
VITE_NEWS_API_URL=https://your-api.example.com/news
```

The endpoint should return either:

```json
[
  {
    "id": "unique-id",
    "title": "Headline",
    "summary": "Around 40 words...",
    "category": "India",
    "date": "2026-10-04",
    "source": "Publisher",
    "url": "https://publisher.example/story",
    "imageUrl": "https://...",
    "keywords": ["Keyword 1", "Keyword 2"],
    "vocabulary": [
      {"word": "Resilient", "meaning": "Able to recover quickly"}
    ]
  }
]
```

or:

```json
{ "articles": [ ... ] }
```

The frontend normalizes the response.

### Important production note

Do not put a paid provider's secret API key in `VITE_*` variables. `VITE_*` values are shipped to the browser.

For production, use a server-side proxy/serverless function (for example `/api/news`) that keeps the provider key private, then set `VITE_NEWS_API_URL=/api/news`.

## Deploy to Vercel

1. Push this folder to GitHub.
2. Import the repository into Vercel.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add `VITE_NEWS_API_URL` if you have a backend/API endpoint.

## Deploy to AWS

This is a normal Vite SPA and can be deployed to S3 + CloudFront or any Node/static hosting setup.

For S3/CloudFront, upload the `dist` folder after:

```bash
npm run build
```

Configure SPA fallback so unknown routes return `index.html`.

## Architecture

```text
src/
  components/     reusable UI
  data/           demo content
  services/       API/data access
  utils/          formatting helpers
  App.jsx
  main.jsx
  styles.css
```

The demo data is not intended to represent complete live coverage. Complete daily coverage requires connecting the app to a licensed/live news data source through the service layer.
