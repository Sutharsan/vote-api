/**
 * @file
 * Contains votes.
 */

const { Vote, AverageVote, VoteCount } = require('./votes');

// Vote storage.
const voteHistory = [];
const voteAverage = [];
const voteCount = [];

function initStorage() {
  // Nothing to do.
}

/**
 * Adds a single vote to the history.
 *
 * @param id
 * @param value
 * @param source
 */
function addVote(id, value, source) {
  if (value < 1 || value > 5) {
    return;
  }
  const vote = new Vote(id, value, source);
  voteHistory.push(vote);
  updateAverage(vote);
  updateCount(vote);
}

/**
 * Updates vote results with single vote.
 *
 * @param {Vote} vote
 */
function updateAverage(vote) {
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
function updateCount(vote) {
  if (voteCount[vote.id] === undefined) {
    voteCount[vote.id] = new VoteCount();
  }
  voteCount[vote.id].count(vote.value);
}

/**
 * Returns the average vote data.
 *
 * @param id
 *
 * @returns {object}
 */
function getVoteAverage(id) {
  const { average, count } = voteAverage[id] === undefined ? new AverageVote() : voteAverage[id];
  return { average, count };
}

/**
 * Returns the vote count data.
 *
 * @param id
 *
 * @returns {VoteCount}
 */
function getVoteCount(id) {
  return voteCount[id] === undefined ? new VoteCount() : voteCount[id];
}

module.exports.initStorage = initStorage;
module.exports.addVote = addVote;
module.exports.getVoteAverage = getVoteAverage;
module.exports.getVoteCount = getVoteCount;
