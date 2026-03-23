import app from './app';
import { prisma } from './utils/prisma';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Connected database.');

    app.listen(PORT, () => {
      console.log(`Server running on: http://localhost:${PORT}`);
      console.log(`API: http://localhost:${PORT}/api`);
      console.log(`Health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log('Shutting down the server...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down the server...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();