import { createServer, Server } from 'http';
import { Server as SocketServer } from 'socket.io';
import mongoose from 'mongoose';
import config from './app/config';
import app from './app';
import { start } from 'repl';
import { RabbitMQ } from './app/config/rabbitMq';
import { initialize } from './app/utiils/dataGenerator';

let server: Server | undefined;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    const httpServer = createServer(app);

    const io = new SocketServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    await initialize().catch(console.error);

    httpServer.listen(config.port, async () => {
      console.log(`Server is running on port ${config.port}`);
      await start();
    });

    return httpServer;
  } catch (err) {
    console.log(err);
  }
}

main().then((httpServer) => {
  server = httpServer;
});

process.on('unhandledRejection', (error) => {
  console.log('unhandledRejection is detected, shutting down...', error);
  if (server) {
    server.close(() => {
      console.log('Server is closed');
      process.exit(1);
    });
  }
});

process.on('SIGINT', async () => {
  await RabbitMQ.close();
  await mongoose.connection.close();
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.log('uncaughtException is detected, shutting down...', error);
  if (server) {
    server.close(() => {
      console.log('Server is closed');
      process.exit(1);
    });
  }
});
