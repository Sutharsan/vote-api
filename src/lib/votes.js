/**
 * @file
 * Contains votes.
 */

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
    const now = new Date();
    this.timestamp = `${now.getTime()}.${now.getMilliseconds()}`;

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
  constructor(data = undefined) {
    if (data === undefined) {
      this.sum = 0;
      this.average = 0;
      this.count = 0;
    } else {
      this.sum = data.sum;
      this.average = data.average;
      this.count = data.count;
    }
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
  constructor(data = undefined) {
    if (data === undefined) {
      this.val_1 = 0;
      this.val_2 = 0;
      this.val_3 = 0;
      this.val_4 = 0;
      this.val_5 = 0;
    } else {
      this.val_1 = data.val_1;
      this.val_2 = data.val_2;
      this.val_3 = data.val_3;
      this.val_4 = data.val_4;
      this.val_5 = data.val_5;
    }
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

export {
  Vote,
  AverageVote,
  VoteCount,
};
