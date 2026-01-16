import server from './server';
import config from './config';
import Logger from './logger';
import { connectToMongoDB } from './loaders/database';

const startServer = async () => {
  await connectToMongoDB();
  const app = await server();

  app.listen(config.port, async () => {
    Logger.info(`
    ################################################
    #  Server listening on port: ${config.port}    
    ################################################`);
  });
};

startServer();
