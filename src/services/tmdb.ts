// use built-in fetch (Node 18+). avoid external dependency for easier testing
// minimal type aliases to keep TypeScript happy
type RequestInit = any;
type Response = any;

const API_BASE = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

function getApiKey() {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new Error('TMDB_API_KEY is not set');
  }
  return key;
}

const defaultTimeout = 5000;
const defaultRetries = 2;

async function tmdbFetch(path: string, options: RequestInit = {}, retries = defaultRetries): Promise<any> {
  const key = getApiKey();
  const url = `${API_BASE}${path}${path.includes('?') ? '&' : '?'}api_key=${key}`;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), defaultTimeout);
  try {
    const res: Response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`TMDB error ${res.status}: ${text}`);
    }
    return res.json();
  } catch (err: any) {
    if (retries > 0 && (err.name === 'FetchError' || err.name === 'AbortError')) {
      return tmdbFetch(path, options, retries - 1);
    }
    throw err;
  }
}

function normalizeImage(path: string | null) {
  return path ? `${IMAGE_BASE}${path}` : null;
}

function normalizeMovie(m: any) {
  return {
    id: m.id,
    title: m.title,
    overview: m.overview,
    poster: normalizeImage(m.poster_path),
    backdrop: normalizeImage(m.backdrop_path),
    releaseDate: m.release_date,
    rating: m.vote_average
  };
}

function normalizeTv(t: any) {
  return {
    id: t.id,
    name: t.name,
    overview: t.overview,
    poster: normalizeImage(t.poster_path),
    backdrop: normalizeImage(t.backdrop_path),
    firstAirDate: t.first_air_date,
    rating: t.vote_average
  };
}

export async function getTrending(mediaType = 'all', timeWindow = 'day') {
  const data = await tmdbFetch(`/trending/${mediaType}/${timeWindow}`);
  return data.results.map((r: any) => (r.title ? normalizeMovie(r) : normalizeTv(r)));
}

export async function getMovie(id: string) {
  const data = await tmdbFetch(`/movie/${id}`);
  return normalizeMovie(data);
}

export async function getTv(id: string) {
  const data = await tmdbFetch(`/tv/${id}`);
  return normalizeTv(data);
}

export async function search(query: string) {
  const data = await tmdbFetch(`/search/multi?query=${encodeURIComponent(query)}`);
  return data.results.map((r: any) =>
    r.media_type === 'movie' ? normalizeMovie(r) : normalizeTv(r)
  );
}
