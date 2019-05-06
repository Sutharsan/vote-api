/**
 * @file
 * The Voting application.
 */

const express = require('express');
const { param, validationResult } = require('express-validator/check');
const { addVote, getVoteAverage, getVoteCount } = require('./lib/votes');

const app = express();

/**
 * Callback: Return the vote average.
 */
async function getAverage(req, res) {
  const { id } = req.params;

  res.json(getVoteAverage(id));
}

/**
 * Callback: Return the vote statistics.
 */
async function getStatistics(req, res) {
  const { id } = req.params;

  res.json({
    average: getVoteAverage(id),
    count: getVoteCount(id),
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
    validationResult(req).throw();

    addVote(id, value, ip);
    res.json(getVoteAverage(id));
    res.json(getVoteAverage(id));
  } catch (err) {
    // TODO Only param errors should result in 406 status.
    const info = err.mapped();
    res.status(406).json({
      error: info,
    });
  }
}

// Middle ware.
app.get('/vote/:id', getAverage);
app.get('/vote/:id/stats', getStatistics);
app.post('/vote/:id/:value', postVoteValidation, postVote);

if (!module.parent) {
  app.listen(3000);
}
