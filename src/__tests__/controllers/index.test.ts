import { createCache } from '../../utils/cache';
import {
  healthController,
  trendingController,
  movieController,
  tvController,
  searchController,
} from '../../controllers';

jest.mock('../../services/tmdb', () => ({
  getTrending: jest.fn(async () => ['trend']),
  getMovie: jest.fn(async () => ({ id: 'x' })),
  getTv: jest.fn(async () => ({ id: 'y' })),
  search: jest.fn(async () => ['s']),
}));

const { getTrending, getMovie, getTv, search } = require('../../services/tmdb');

describe('controllers', () => {
  let cache: ReturnType<typeof createCache>;

  beforeEach(() => {
    cache = createCache();
  });

  it('health controller returns status', () => {
    const res = healthController();
    expect(res.status).toBe('ok');
  });

  it('trending caches response', async () => {
    const first = await trendingController(cache);
    expect(first).toEqual(['trend']);
    expect(getTrending).toHaveBeenCalledTimes(1);
    const second = await trendingController(cache);
    expect(getTrending).toHaveBeenCalledTimes(1);
    expect(second).toEqual(first);
  });

  it('movie caches and returns', async () => {
    const m1 = await movieController('1', cache);
    expect(m1).toEqual({ id: 'x' });
    const m2 = await movieController('1', cache);
    expect(getMovie).toHaveBeenCalledTimes(1);
  });

  it('tv caches and returns', async () => {
    const t1 = await tvController('2', cache);
    expect(t1).toEqual({ id: 'y' });
  });

  it('search caches', async () => {
    const s1 = await searchController('q', cache);
    expect(s1).toEqual(['s']);
  });
});
