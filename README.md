# TMDB BFF

Minimal Node.js backend-for-frontend wrapping TMDB APIs.

## Setup

1. Copy `.env.example` to `.env` and add your TMDB API key:
   ```
   TMDB_API_KEY=your_key
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run in development:
   ```bash
   npm run dev
   ```

## Endpoints

- `GET /api/health` – basic health check
- `GET /api/trending` – trending movies & TV
- `GET /api/movie/:id` – movie details
- `GET /api/tv/:id` – TV details
- `GET /api/search?q=...` – search movies/TV

Responses are normalized and cached in memory (TTL 5m).

## Notes

- Uses `node-fetch` with timeout and retry logic.
- In-memory LRU cache via `lru-cache`.
- Designed for serverless deployment (Vercel, etc.) but runs locally with `node`.
- ESLint configured; run `npm run lint` to check code quality.
