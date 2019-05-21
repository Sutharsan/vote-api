const storage = require('node-persist');
const { Vote, AverageVote, VoteCount } = require('./votes');

const voteHistoryStorage = storage.create({ dir: '../storage/history' });
const voteAverageStorage = storage.create({ dir: '../storage/avarage' });
const voteCountStorage = storage.create({ dir: '../storage/count' });

/**
 * Initialize the storage.
 *
 * @returns {Promise<void>}
 */
async function initStorage() {
  await voteHistoryStorage.init();
  await voteAverageStorage.init();
  await voteCountStorage.init();
}

/**
 * Adds a single vote to the history.
 *
 * @param id
 * @param value
 * @param source
 */
async function addVote(id, value, source) {
  if (value < 1 || value > 5) {
    return;
  }

  const vote = new Vote(id, value, source);
  await pushHistory(vote);
  await updateAverage(vote);
  await updateCount(vote);
}

/**
 * Adds a vote to the history.
 *
 * @param {Vote} vote
 *
 * @returns {Promise<void>}
 */
async function pushHistory(vote) {
  const key = `${vote.id}:${vote.timestamp}`;
  await voteHistoryStorage.setItem(key, vote);
}

/**
 * Updates vote results with single vote.
 *
 * @param {Vote} vote
 */
async function updateAverage(vote) {
  let average;

  if (await voteAverageStorage.length() === 0) {
    average = new AverageVote();
  } else {
    average = new AverageVote(await voteAverageStorage.getItem(vote.id));
  }

  average.addVote(vote);
  await voteAverageStorage.setItem(vote.id, average);
}

/**
 * Updates vote count.
 *
 * @param {Vote} vote
 */
async function updateCount(vote) {
  let count;

  if (await voteAverageStorage.length() === 0) {
    count = new VoteCount();
  } else {
    count = new VoteCount(await voteCountStorage.getItem(vote.id));
  }

  count.count(vote.value);
  await voteCountStorage.setItem(vote.id, count);
}

/**
 * Returns the average vote data.
 *
 * @param id
 *
 * @returns {object}
 */
async function getVoteAverage(id) {
  let averageVote;

  if (voteAverageStorage.length === 0) {
    averageVote = new AverageVote();
  } else {
    averageVote = new AverageVote(await voteAverageStorage.getItem(id));
  }

  const { average, count } = averageVote;
  return { average, count };
}

/**
 * Returns the vote count data.
 *
 * @param id
 *
 * @returns {VoteCount}
 */
async function getVoteCount(id) {
  let count;

  if (voteCountStorage.length === 0) {
    count = new VoteCount();
  } else {
    count = new VoteCount(await voteCountStorage.getItem(id));
  }

  return count;
}

module.exports.initStorage = initStorage;
module.exports.addVote = addVote;
module.exports.getVoteAverage = getVoteAverage;
module.exports.getVoteCount = getVoteCount;
