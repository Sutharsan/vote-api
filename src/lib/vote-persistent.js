import storage from 'node-persist';
import { Vote, AverageVote, VoteCount } from './vote';

const floodWindow = 3600 * 1000; // 1 hour
const floodThresholdById = 1;
const floodThresholdBySource = 10;

const voteHistoryStorage = storage.create({ dir: 'storage/history', ttl: floodWindow });
const voteAverageStorage = storage.create({ dir: 'storage/avarage' });
const voteCountStorage = storage.create({ dir: 'storage/count' });

/**
 * Handles storage error.
 */
const storageError = (error) => {
  // TODO Log the error internally.
  // TODO How to respond externally?
  console.log('Persistent storage error.', error.message);
};

/**
 * Initialize the storage.
 *
 * @returns {Promise<void>}
 */
export function initStorage() {
  Promise.all([
    voteHistoryStorage.init(),
    voteAverageStorage.init(),
    voteCountStorage.init(),
  ])
    .catch(storageError);
}

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

  const vote = new Vote(id, value, source);
  if (isFlooding(vote) !== false) {
    // Do nothing. Silently ignore flood attempts;
    return Promise.resolve();
  }

  return pushHistory(vote)
    .then(() => updateAverage(vote))
    .then(() => updateCount(vote))
    .catch(storageError);
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
    .catch(storageError);
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
      return voteAverageStorage.getItem(vote.id)
        .then(data => new AverageVote(data))
        .catch(storageError);
    })
    .then(average => voteAverageStorage.setItem(vote.id, average.add(vote)))
    .catch(storageError);
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
      return voteCountStorage.getItem(vote.id)
        .then(data => new VoteCount(data))
        .catch(storageError);
    })
    .then(count => voteCountStorage.setItem(vote.id, count.increase(vote.value)))
    .catch(storageError);
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
      return voteAverageStorage.getItem(id)
        .then(data => new AverageVote(data))
        .catch(storageError);
    })
    .catch(storageError);
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
      return voteCountStorage.getItem(id)
        .then(data => new VoteCount(data))
        .catch(storageError);
    })
    .catch(storageError);
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
  if (floodThresholdById > 0) {
    const sameIdVotes = similarVotes({
      id: vote.id,
      source: vote.source,
    });
    console.log('isFlooding 1', sameIdVotes);
    flooding = sameIdVotes >= floodThresholdById;
  }

  // Voted for any ID within flood window.
  if (floodThresholdBySource > 0) {
    const sameSourceVotes = similarVotes({
      source: vote.source,
    });
    console.log('isFlooding 2', sameSourceVotes);
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
      .catch(storageError);
  } else {
    Promise.all([
      voteAverageStorage.clear(),
      voteCountStorage.clear(),
    ])
      .catch(storageError);
  }
}
