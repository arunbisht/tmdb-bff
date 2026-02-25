import { getTrending, getMovie, getTv, search } from "../services/tmdb.js";

// We keep a loose cache type so we don't depend on lru-cache exports directly
export type CacheType<K, V> = ReturnType<
  typeof import("../utils/cache").createCache
>;

export function healthController() {
  return { status: "ok", timestamp: Date.now() };
}

export async function trendingController(cache: CacheType<string, any>) {
  const key = "trending";
  if (cache.has(key)) {
    return cache.get(key);
  }
  const data = await getTrending();
  cache.set(key, data);
  return data;
}

export async function movieController(
  id: string,
  cache: CacheType<string, any>,
) {
  const key = `movie:${id}`;
  if (cache.has(key)) return cache.get(key);
  const data = await getMovie(id);
  cache.set(key, data);
  return data;
}

export async function tvController(id: string, cache: CacheType<string, any>) {
  const key = `tv:${id}`;
  if (cache.has(key)) return cache.get(key);
  const data = await getTv(id);
  cache.set(key, data);
  return data;
}

export async function searchController(
  q: string,
  cache: CacheType<string, any>,
) {
  const key = `search:${q}`;
  if (cache.has(key)) return cache.get(key);
  const data = await search(q);
  cache.set(key, data);
  return data;
}
