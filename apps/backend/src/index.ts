process.env.PRISMA_QUERY_ENGINE_TYPE = 'binary';

import app from './app';
import { prisma } from './utils/prisma';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    console.log('Connected database.');
    app.listen(PORT, () => {
      console.log(`Server running on: ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

startServer();