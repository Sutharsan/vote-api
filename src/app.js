import express from 'express';
import config from './config';
import { initStorage } from './lib/vote-persistent';
import { routerVote, handleError } from './router/vote';

const app = express();

// Initialize persistent storage.
initStorage();

// Middleware stack for routing and error reporting.
// TODO Add caching middleware.
app.use('/vote', routerVote);
app.use(handleError);

// Listen for incoming calls at configured port.
if (!module.parent) {
  app.listen(config.appSeverPort);
}
