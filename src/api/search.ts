import { createCache } from "../utils/cache.js";
import { searchController } from "../controllers/index.js";

const cache = createCache();

export default async function handler(req: any, res: any) {
  const q = req.query.q as string | undefined;
  if (!q) {
    res.status(400).json({ error: "query parameter q is required" });
    return;
  }
  try {
    const data = await searchController(q, cache);
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
