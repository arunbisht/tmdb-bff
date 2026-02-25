import { createCache } from '../utils/cache';
import { trendingController } from '../controllers';

const cache = createCache();

export default async function handler(_req: any, res: any) {
  try {
    const data = await trendingController(cache);
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
