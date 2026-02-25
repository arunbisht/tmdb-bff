import http from 'http';
import { requestHandler } from './server';
import 'dotenv/config';

const port = process.env.PORT || 3000;

const server = http.createServer(requestHandler);

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
