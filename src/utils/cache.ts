import LRU from 'lru-cache';

interface CacheOptions {
  max?: number;
  ttl?: number;
}

const defaultOptions: Required<CacheOptions> = {
  max: 100,
  ttl: 1000 * 60 * 5 // 5 minutes
};

export const createCache = <V>(opts: CacheOptions = {}) => {
  const options: Required<CacheOptions> = { ...defaultOptions, ...opts };
  return new LRU<string, V>({
    max: options.max,
    ttl: options.ttl
  });
};
