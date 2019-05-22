"use strict";

var express = require('express');

var _require = require('./lib/votes-persistent'),
    initStorage = _require.initStorage;

var _require2 = require('./lib/routing'),
    getAverage = _require2.getAverage,
    getStatistics = _require2.getStatistics,
    postVoteValidation = _require2.postVoteValidation,
    postVote = _require2.postVote;

var app = express();
initStorage();
app.get('/vote/:id', getAverage);
app.get('/vote/:id/stats', getStatistics);
app.post('/vote/:id/:value', postVoteValidation, postVote);

if (!module.parent) {
  app.listen(3000);
}