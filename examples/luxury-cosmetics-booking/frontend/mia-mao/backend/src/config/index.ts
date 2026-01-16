import dotenv from 'dotenv';
import path from 'path';
import * as process from 'process';

process.env.NODE_ENV = process.env.NODE_ENV ?? 'local';

dotenv.config();
dotenv.config({ path: path.resolve(`.env.${process.env.NODE_ENV}.rc`) });

const dbName = process.env.NODE_ENV === 'test' ? 'back-end-test' : 'back-end-test2';
const databaseUrl =
  process.env.MONGODB_CLUSTER_ENDPOINT_URL +
  `/${dbName}?authMechanism=DEFAULT&retryWrites=true&w=majority`;
export default {
  env: process.env.NODE_ENV,
  port: process.env.SERVER_PORT ?? 8000,
  databaseURL: databaseUrl,
  jwtSecret: process.env.SECRET_KEY,
  endpointPrefix: process.env.ENDPOINT_PREFIX ?? 'api',
  appGcpClientId: process.env.APP_GCP_CLIENT_ID,
  appGcpClientSecret: process.env.APP_GCP_CLIENT_SECRET,
  appGcpRedirectUri: process.env.REDIRECT_URI,
  appGcpOptimizerRCGcs: process.env.APP_GCP_OPTIMIZER_RC_GCS,
  logs: {
    level: process.env.LOG_LEVEL,
  },
};
