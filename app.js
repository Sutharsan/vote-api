/**
 * @file
 * The Voting application.
 */

const express = require('express');
const { param, validationResult } = require('express-validator/check');
// const { initStorage, addVote, getVoteAverage, getVoteCount } = require('./lib/votes-memory');
const { initStorage, addVote, getVoteAverage, getVoteCount } = require('./lib/votes-persistent');

const app = express();

/**
 * Callback: Return the vote average.
 */
async function getAverage(req, res) {
  const { id } = req.params;

  res.json(await getVoteAverage(id));
}

/**
 * Callback: Return the vote statistics.
 */
async function getStatistics(req, res) {
  const { id } = req.params;

  res.json({
    average: await getVoteAverage(id),
    count: await getVoteCount(id),
  });
}

/**
 * Validation chain for postVote.
 *
 * @type {ValidationChain[]}
 */
const postVoteValidation = [
  param('value').isIn(['1', '2', '3', '4', '5']).withMessage('Parameter must be a value of 1 .. 5'),
];

/**
 * Callback: Store vote data.
 */
async function postVote(req, res) {
  const { id } = req.params;
  const { value } = req.params;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(406).json({
        error: errors.mapped(),
      });
    }

    await addVote(id, value, ip);
    res.json(await getVoteAverage(id));
  } catch (err) {
    // TODO Additional error handling.
  }
}

initStorage();

// Middle ware.
app.get('/vote/:id', getAverage);
app.get('/vote/:id/stats', getStatistics);
app.post('/vote/:id/:value', postVoteValidation, postVote);

if (!module.parent) {
  app.listen(3000);
}
