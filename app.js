const express = require('express');
const { param, validationResult } = require('express-validator/check');

const app = express();

// Vote storage
// TODO Use a more persistent storage.
const votes = [];

/**
 * Callback: Return the average of votes.
 */
async function getAverage(req, res) {
  const { id } = req.params;

  res.json(calculateAverage(id));
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

    addVote(new Vote(id, intValue(value), ip));
    res.json(calculateAverage(id));
  } catch (err) {
    // TODO Only param errors should result in 406 status.
    res.status(406).json({
      error: err.mapped(),
    });
  }
}

/**
 * Object that contains one vote.
 *
 * @param id
 *   ID of the voted item.
 * @param value
 *   Value of the vote.
 * @param ip
 *   Originators IP.
 */
function Vote(id, value, ip) {
  this.id = id;
  this.value = value;
  this.ip = ip;
  this.msTime = new Date().getMilliseconds();
}

/**
 * Object that contains the calculated average of a voted object.
 *
 * @param average
 *   The average vote.
 * @param count
 *   The total number of votes.
 *
 * @see calculateAverage()
 */
function AverageVote(average, count) {
  this.average = average;
  this.count = count;
}

/**
 * Convert a value to integer.
 *
 * @param value
 *   The value to be converted.
 * @returns int
 *   The integer value. 0 if the value is zero or not a number.
 */
function intValue(value) {
  const int = parseInt(value, 10);
  return int || 0;
}

/**
 * Adds a vote to the storage.
 *
 * @param {Vote} vote
 */
function addVote(vote) {
  votes.push(vote);
}

/**
 * Calculates the average vote.
 *
 * @param id
 * @returns {AverageVote}
 */
function calculateAverage(id) {
  let total = 0;
  let count = 0;
  let average = 0;

  // TODO Use a more scalable solution.
  votes.forEach((item) => {
    if (item.id === id) {
      total += item.value;
      count += 1;
    }
  });

  if (count) {
    average = total / count;
  }
  average = Number((average).toFixed(1));

  return new AverageVote(average, count);
}

// Middle ware.
app.get('/vote/:id', getAverage);
app.post('/vote/:id/:value', postVoteValidation, postVote);

if (!module.parent) {
  app.listen(3000);
}
