import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createCache } from '../../utils/cache';
import { tvController } from '../../controllers';

const cache = createCache();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  if (typeof id !== 'string') {
    res.status(400).json({ error: 'id parameter required' });
    return;
  }
  try {
    const data = await tvController(id, cache);
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
