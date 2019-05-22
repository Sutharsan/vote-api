/**
 * @file
 * The Voting application.
 */

const express = require('express');
const { initStorage } = require('./lib/votes-persistent');
const { getAverage, getStatistics, postVoteValidation, postVote } = require('./lib/routing');

const app = express();

initStorage();

app.get('/vote/:id', getAverage);
app.get('/vote/:id/stats', getStatistics);
app.post('/vote/:id/:value', postVoteValidation, postVote);

if (!module.parent) {
  app.listen(3000);
}
