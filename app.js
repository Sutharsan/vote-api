const express = require('express');
const { param, validationResult } = require('express-validator/check');

const app = express();

// Vote storage
// TODO Use a more persistent storage.
const votes = [];
const voteAverage = [];
const voteCount = [];

/**
 * Class that contains vote data.
 */
class Vote {
  /**
   * @param id
   *   ID of the voted item.
   * @param value
   *   Value of the vote.
   * @param source
   *   Identification of the vote source. E.g. IP address or user ID.
   */
  constructor(id, value, source) {
    this.id = id;
    this.value = value;
    this.source = source;
    this.msTime = new Date().getMilliseconds();
  }
}

/**
 * Class that contains the calculated average of a voted object.
 *
 * @see calculateAverage()
 */
class AverageVote {
  constructor() {
    this.sum = 0;
    this.average = 0;
    this.count = 0;
  }

  /**
   * @param {Vote} vote
   */
  addVote(vote) {
    this.count += 1;
    this.sum += vote.value;
    this.average = Number((this.sum / this.count).toFixed(1));
  }
}

/**
 * Callback: Return the average of votes.
 */
async function getAverage(req, res) {
  const { id } = req.params;

  res.json(voteAverage[id]);
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
    res.json(voteAverage[id]);
  } catch (err) {
    // TODO Only param errors should result in 406 status.
    res.status(406).json({
      error: err.mapped(),
    });
  }
}

/**
 * Convert a value to integer.
 *
 * @param value
 *   The value to be converted.
 *
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
  updateVoteAverage(vote);
  updateVoteCount(vote);
}

/**
 * Updates vote results with single vote.
 *
 * @param {Vote} vote
 */
function updateVoteAverage(vote) {
  // TODO Handle the array and ID inside of the a class.
  if (voteAverage[vote.id] === undefined) {
    voteAverage[vote.id] = new AverageVote();
  }
  voteAverage[vote.id].addVote(vote);
}

/**
 * Updates vote count.
 *
 * @param {Vote} vote
 */
function updateVoteCount(vote) {
  // TODO Handle the array and ID inside of the a class.
  if (voteCount[vote.id] === undefined) {
    voteCount[vote.id] = [];
  }
  voteCount[vote.id][vote.value] += 1;
}

// Middle ware.
app.get('/vote/:id', getAverage);
app.post('/vote/:id/:value', postVoteValidation, postVote);

if (!module.parent) {
  app.listen(3000);
}
