/**
 * @file
 * Contains votes.
 */

// TODO Use a persistent storage.
// Vote storage.
const voteHistory = [];
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
    this.value = intValue(value);
    this.source = source;
    this.timestamp = new Date().getTime();

    /**
     * Convert a value to integer.
     *
     * @param val
     *   The value to be converted.
     *
     * @returns int
     *   The integer value. 0 if the value is zero or not a number.
     */
    function intValue(val) {
      const int = parseInt(val, 10);
      return int || 0;
    }
  }
}

/**
 * Class that contains the calculated average of a voted object.
 *
 * @see updateAverage()
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
 * Class that contains the vote count data of a voted object.
 *
 * @see updateCount()
 */
class VoteCount {
  constructor() {
    this.val_1 = 0;
    this.val_2 = 0;
    this.val_3 = 0;
    this.val_4 = 0;
    this.val_5 = 0;
  }

  /**
   * Count a vote value.
   *
   * @param value
   */
  count(value) {
    this[`val_${value}`] += 1;
  }
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
 * @returns {AverageVote}
 */
function getVoteAverage(id) {
  if (voteAverage[id] === undefined) {
    return new AverageVote();
  }
  return voteAverage[id];
}

/**
 * Returns the vote count data.
 *
 * @param id
 *
 * @returns {VoteCount}
 */
function getVoteCount(id) {
  if (voteCount[id] === undefined) {
    return new VoteCount();
  }
  return voteCount[id];
}

module.exports.addVote = addVote;
module.exports.getVoteAverage = getVoteAverage;
module.exports.getVoteCount = getVoteCount;
