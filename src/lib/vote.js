/**
 * Class that contains vote data.
 */
export class Vote {
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
export class AverageVote {
  constructor(data = {}) {
    this.sum = data.sum || 0;
    this.average = data.average || 0;
    this.count = data.count || 0;
  }

  /**
   * Add one vote to the average.
   *
   * @param {Vote} vote
   */
  add(vote) {
    this.count += 1;
    this.sum += vote.value;
    this.average = Number((this.sum / this.count).toFixed(1));
    return this;
  }

  /**
   * Returns public properties.
   *
   * @returns {{average: number, count: number}}
   */
  public() {
    return {
      count: this.count,
      average: this.average,
    };
  }
}

/**
 * Class that contains the vote count data of a voted object.
 *
 * @see updateCount()
 */
export class VoteCount {
  constructor(data = {}) {
    this.val_1 = data.val_1 || 0;
    this.val_2 = data.val_2 || 0;
    this.val_3 = data.val_3 || 0;
    this.val_4 = data.val_4 || 0;
    this.val_5 = data.val_5 || 0;
  }

  /**
   * Increase the vote count.
   *
   * @param value
   */
  increase(value) {
    this[`val_${value}`] += 1;
    return this;
  }
}
