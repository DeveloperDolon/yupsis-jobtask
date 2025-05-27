import { createServer, Server } from 'http';
import { Server as SocketServer } from 'socket.io';
import mongoose from 'mongoose';
import config from './app/config';
import app from './app';

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

    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      socket.on('message', (data) => {
        console.log(data);
        
      });

      socket.emit('message', 'Welcome to the socket server!');

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    httpServer.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
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

process.on('uncaughtException', (error) => {
  console.log('uncaughtException is detected, shutting down...', error);
  if (server) {
    server.close(() => {
      console.log('Server is closed');
      process.exit(1);
    });
  }
});
