process.env.TMDB_API_KEY = 'fake';

// mock global fetch with loose typing
const fetchMock: jest.Mock<any, any> = jest.fn();
(globalThis as any).fetch = fetchMock;

// we need a Response constructor for synthesizing responses
class DummyResponse {
  body: string;
  status: number;
  constructor(body: string, init: { status: number }) {
    this.body = body;
    this.status = init.status;
  }
  async text() { return this.body; }
  get ok() { return this.status >= 200 && this.status < 300; }
  async json() { return JSON.parse(this.body); }
}

import { getMovie, getTrending, search, getTv } from '../../services/tmdb';

describe('tmdb service', () => {
  const sampleMovie = { id: 1, title: 'Test', poster_path: '/p.jpg', backdrop_path: '/b.jpg', overview: 'o', release_date: '2020-01-01', vote_average: 8 };
  const sampleTv = { id: 2, name: 'Show', poster_path: '/p.jpg', backdrop_path: '/b.jpg', overview: 'o', first_air_date: '2021-01-01', vote_average: 9 };

  // the fetch mock can receive various request types; just use the generic fetchMock
  fetchMock.mockImplementation((url: any) => {
    const u = typeof url === 'string' ? url : url.toString();
    if (u.includes('/movie/1')) {
      return Promise.resolve(new DummyResponse(JSON.stringify(sampleMovie), { status: 200 }));
    }
    if (u.includes('/tv/2')) {
      return Promise.resolve(new DummyResponse(JSON.stringify(sampleTv), { status: 200 }));
    }
    if (u.includes('/trending')) {
      return Promise.resolve(new Response(JSON.stringify({ results: [sampleMovie, { ...sampleTv, media_type: 'tv' }] }), { status: 200 }));
    }
    if (u.includes('/search')) {
      return Promise.resolve(new Response(JSON.stringify({ results: [sampleMovie, { ...sampleTv, media_type: 'tv' }] }), { status: 200 }));
    }
    return Promise.resolve(new DummyResponse('Not Found', { status: 404 }));
  });

  it('fetches a movie', async () => {
    const movie = await getMovie('1');
    expect(movie.id).toBe(1);
    expect(movie.title).toBe('Test');
  });

  it('fetches a tv show', async () => {
    const tv = await getTv('2');
    expect(tv.id).toBe(2);
    expect(tv.name).toBe('Show');
  });

  it('gets trending items', async () => {
    const list = await getTrending();
    expect(list.length).toBe(2);
  });

  it('searches and normalizes results', async () => {
    const results = await search('foo');
    expect(results.length).toBe(2);
  });
});
