import storage from 'node-persist';
import config from './config';
import { Vote, AverageVote, VoteCount } from './vote-classes';

let voteHistoryStorage;
let voteAverageStorage;
let voteCountStorage;

/**
 * Handles storage error.
 */
const handleStorageError = (error) => {
  console.log(`Persistent storage error: ${error}`);
  process.exit(1);
};

/**
 * Initialize the storage.
 *
 * @returns {Promise<void>}
 */
async function initStorage(dir = config.voteStorageDirectory) {
  const floodWindow = config.floodWindow * 1000;

  voteHistoryStorage = storage.create({ dir: `${dir}/history`, ttl: floodWindow });
  voteAverageStorage = storage.create({ dir: `${dir}/average` });
  voteCountStorage = storage.create({ dir: `${dir}/count` });

  try {
    await voteHistoryStorage.init();
    await voteAverageStorage.init();
    await voteCountStorage.init();
  }
  catch (error) {
    throw new Error(handleStorageError(error));
  }
}

export { initStorage };

/**
 * Adds a single vote to the history.
 *
 * @param id
 * @param value
 * @param source
 *
 * @return {Promise<void>}
 */
export function addVote(id, value, source) {
  if (value < 1 || value > 5) {
    return Promise.reject('Invalid vote value. Allowed: 1 .. 5');
  }

  const vote = new Vote(toString(id), value, source);
  if (isFlooding(vote) !== false) {
    // Do nothing. Silently ignore flood attempts;
    return Promise.resolve();
  }

  return pushHistory(vote)
    .then(() => updateAverage(vote))
    .then(() => updateCount(vote))
    .catch(error => handleStorageError(error));
}

/**
 * Adds a vote to the history.
 *
 * @param {Vote} vote
 *
 * @return {Promise<void>}
 */
function pushHistory(vote) {
  const key = `${vote.id}:${vote.timestamp}`;
  return voteHistoryStorage.setItem(key, vote)
    .catch(error => handleStorageError(error));
}

/**
 * Updates vote results with single vote.
 *
 * @param {Vote} vote
 *
 * @return {Promise<void>}
 */
function updateAverage(vote) {
  return voteAverageStorage.length()
    .then((length) => {
      if (length === 0) {
        return new AverageVote();
      }
      return voteAverageStorage.getItem(toString(vote.id))
        .then(data => new AverageVote(data))
        .catch(error => handleStorageError(error));
    })
    .then(average => voteAverageStorage.setItem(vote.id, average.add(vote)))
    .catch(error => handleStorageError(error));
}

/**
 * Updates vote count.
 *
 * @param {Vote} vote
 *
 * @return {Promise<void>}
 */
function updateCount(vote) {
  return voteCountStorage.length()
    .then((length) => {
      if (length === 0) {
        return new VoteCount();
      }
      return voteCountStorage.getItem(toString(vote.id))
        .then(data => new VoteCount(data))
        .catch(error => handleStorageError(error));
    })
    .then(count => voteCountStorage.setItem(vote.id, count.increase(vote.value)))
    .catch(error => handleStorageError(error));
}

/**
 * Returns the average vote data.
 *
 * @param id
 *   Voted item ID.
 *
 * @returns {Promise<AverageVote>}
 */
export function getVoteAverage(id) {
  return voteAverageStorage.length()
    .then((length) => {
      if (length === 0) {
        return new AverageVote();
      }
      return voteAverageStorage.getItem(toString(id))
        .then(data => new AverageVote(data))
        .catch(error => handleStorageError(error));
    })
    .catch(error => handleStorageError(error));
}

/**
 * Returns the vote count data.
 *
 * @param id
 *
 * @returns {Promise<VoteCount>}
 */
export function getVoteCount(id) {
  return voteCountStorage.length()
    .then((length) => {
      if (length === 0) {
        return new VoteCount();
      }
      return voteCountStorage.getItem(toString(id))
        .then(data => new VoteCount(data))
        .catch(error => handleStorageError(error));
    })
    .catch(error => handleStorageError(error));
}

/**
 * Checks if a flood is going on.
 *
 * @param {Vote} vote
 *
 * @returns {boolean}
 *   True if this vote is considered to be part of a flood.
 */
function isFlooding(vote) {
  let flooding = false;

  // Voted for same ID within flood window.
  if (config.floodThresholdById > 0) {
    const sameIdVotes = similarVotes({
      id: vote.id,
      source: vote.source,
    });
    flooding = sameIdVotes >= config.floodThresholdById;
  }

  // Voted for any ID within flood window.
  if (config.floodThresholdBySource > 0) {
    const sameSourceVotes = similarVotes({
      source: vote.source,
    });
    flooding = flooding || sameSourceVotes >= config.floodThresholdBySource;
  }

  return flooding;
}

/**
 * Count the number of historical votes that matches given condition(s).
 *
 * @param conditions
 *   Conditions the votes must match. Key: vote property; Value: vote property value.
 *
 * @returns {number}
 *   The number of matching votes.
 */
function similarVotes(conditions) {
  let count = 0;

  voteHistoryStorage.forEach((data) => {
    const vote = new Vote(data.value.id, data.value.value, data.value.source);
    let match = true;
    Object.keys(conditions).forEach((key) => {
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
export function clearStorage(id = 0) {
  if (id === 0) {
    Promise.all([
      voteHistoryStorage.clear(),
      voteAverageStorage.clear(),
      voteCountStorage.clear(),
    ])
      .catch(error => handleStorageError(error));
  } else {
    Promise.all([
      voteAverageStorage.clear(),
      voteCountStorage.clear(),
    ])
      .catch(error => handleStorageError(error));
  }
}
