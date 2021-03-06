import express from 'express';
import config from './config';
import { initStorage } from './vote-storage';
import { routerVote, handleError } from './router/vote';

const app = express();

// Register to log any uncaught exception. Exception terminates the application, they are likely due
// to programmer errors (and let's be strict).
process.on('uncaughtException', (err) => {
  console.error(`${(new Date()).toISOString()} uncaughtException:`, err.message);
  console.error(err.stack);
  process.exit(1);
});

// Initialize persistent storage.
(async () => {
  await initStorage(config.voteStorageDirectory);
})();

// Middleware stack for routing and error reporting.
// TODO Add caching middleware.
app.use('/vote', routerVote);
app.use(handleError);

// Listen for incoming calls at configured port.
if (!module.parent) {
  app.listen(config.appSeverPort);
}

module.exports = app;
