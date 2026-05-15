import 'dotenv/config';

import { app } from './app';

const port = process.env.PORT ? Number(process.env.PORT) : 3001;

const server = app.listen(port, () => {
  console.log(`EcoFlow API running on port ${port}`);
});

process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  server.close(() => {
    process.exit(0);
  });
});
