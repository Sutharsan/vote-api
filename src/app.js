import express from 'express';
import config from './config';
import { initStorage } from './lib/vote-persistent';
import routerVote from './router/vote';

const app = express();

initStorage();

app.use('/vote', routerVote);

if (!module.parent) {
  app.listen(config.appSeverPort);
}
