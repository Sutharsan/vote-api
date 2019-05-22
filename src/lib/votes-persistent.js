const storage = require('node-persist');
const { Vote, AverageVote, VoteCount } = require('./votes');

const floodWindow = 3600;
const floodThresholdById = 0;
const floodThresholdBySource = 10;

const voteHistoryStorage = storage.create({ dir: '../storage/history', ttl: floodWindow });
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
  if (await isFlooding(vote) === false) {
    await pushHistory(vote);
    await updateAverage(vote);
    await updateCount(vote);
  }
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

/**
 * Checks if a flood is going on.
 *
 * @param {Vote} vote
 *
 * @returns {Promise<boolean>}
 *   True if this vote is considered to be part of a flood.
 */
async function isFlooding(vote) {
  let flooding = false;

  // Voted for same ID in flood window.
  if (floodThresholdById > 0) {
    const sameIdVotes = await similarVotes({
      id: vote.id,
      source: vote.source,
    });
    flooding = sameIdVotes >= floodThresholdById;
  }

  // Voted for any ID in flood window.
  if (floodThresholdBySource > 0) {
    const sameSourceVotes = await similarVotes({
      source: vote.source,
    });
    flooding = flooding || sameSourceVotes >= floodThresholdBySource;
  }

  return flooding;
}

/**
 * Count the number of historical votes that matches given condition(s).
 *
 * @param conditions
 *   Conditions the votes must match. Key: vote property; Value: vote property value.
 *
 * @returns {Promise<number>}
 *   The number of matching votes.
 */
async function similarVotes(conditions) {
  let count = 0;

  await voteHistoryStorage.forEach(data => {
    const vote = new Vote(data.value);
    let match = true;
    Object.keys(conditions).forEach(key => {
      match = match && conditions.key === vote.key;
    });
    if (match) {
      count += 1;
    }
  });

  return count;
}

/**
 * Clears the vote storage.
 *
 * @param id
 *   (Optional) vote ID for which to clear the storage.
 *
 * @returns {Promise<void>}
 */
async function clearStorage(id = 0) {
  if (id === 0) {
    await voteHistoryStorage.clear();
    await voteAverageStorage.clear();
    await voteCountStorage.clear();
  } else {
    voteAverageStorage.removeItem(id);
    voteCountStorage.removeItem(id);
  }
}

export {
  initStorage,
  addVote,
  getVoteAverage,
  getVoteCount,
  clearStorage,
};
