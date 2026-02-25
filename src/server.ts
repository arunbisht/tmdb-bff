import { IncomingMessage, ServerResponse } from "http";
import { URL } from "url";
import { createCache } from "./utils/cache.js";
import {
  healthController,
  trendingController,
  movieController,
  tvController,
  searchController,
} from "./controllers/index.js";

const cache = createCache();

export const requestHandler = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  try {
    const url = new URL(req.url || "", `http://${req.headers.host}`);
    const path = url.pathname;

    let result: any;

    if (path === "/api/health") {
      result = healthController();
    } else if (path === "/api/trending") {
      result = await trendingController(cache);
    } else if (path.startsWith("/api/movie/")) {
      const id = path.split("/").pop() || "";
      result = await movieController(id, cache);
    } else if (path.startsWith("/api/tv/")) {
      const id = path.split("/").pop() || "";
      result = await tvController(id, cache);
    } else if (path === "/api/search") {
      const q = url.searchParams.get("q") || "";
      result = await searchController(q, cache);
    } else {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Not found" }));
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result));
  } catch (err: any) {
    console.error("Request error", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: err.message || "Internal error" }));
  }
};
