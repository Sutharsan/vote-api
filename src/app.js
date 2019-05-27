import express from 'express';
import config from '../config';
import { initStorage } from './lib/vote-persistent';
import { getAverage, getStatistics, postVoteValidation, postVote } from './lib/routing';

const app = express();

initStorage();

app.get('/vote/:id', getAverage);
app.get('/vote/:id/stats', getStatistics);
app.post('/vote/:id/:value', postVoteValidation, postVote);

if (!module.parent) {
  app.listen(config.appSeverPort);
}
