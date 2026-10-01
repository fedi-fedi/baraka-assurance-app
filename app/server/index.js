import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;
const distDir = path.resolve(__dirname, '..', 'dist');

app.disable('x-powered-by');

app.use((_, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

app.get('/healthz', (_, res) => res.status(200).json({ status: 'ok' }));

app.use(express.static(distDir, { maxAge: '1h', index: false }));

app.get(/.*/, (_, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`Baraka Assurance server listening on port ${port}`);
});
