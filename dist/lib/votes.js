"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VoteCount = exports.AverageVote = exports.Vote = void 0;

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

/**
 * @file
 * Contains votes.
 */

/**
 * Class that contains vote data.
 */
var Vote =
/**
 * @param id
 *   ID of the voted item.
 * @param value
 *   Value of the vote.
 * @param source
 *   Identification of the vote source. E.g. IP address or user ID.
 */
function Vote(id, value, source) {
  (0, _classCallCheck2["default"])(this, Vote);
  this.id = id;
  this.value = intValue(value);
  this.source = source;
  var now = new Date();
  this.timestamp = "".concat(now.getTime(), ".").concat(now.getMilliseconds());
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
    var _int = parseInt(val, 10);

    return _int || 0;
  }
};
/**
 * Class that contains the calculated average of a voted object.
 *
 * @see updateAverage()
 */


exports.Vote = Vote;

var AverageVote =
/*#__PURE__*/
function () {
  function AverageVote() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
    (0, _classCallCheck2["default"])(this, AverageVote);

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


  (0, _createClass2["default"])(AverageVote, [{
    key: "addVote",
    value: function addVote(vote) {
      this.count += 1;
      this.sum += vote.value;
      this.average = Number((this.sum / this.count).toFixed(1));
    }
  }]);
  return AverageVote;
}();
/**
 * Class that contains the vote count data of a voted object.
 *
 * @see updateCount()
 */


exports.AverageVote = AverageVote;

var VoteCount =
/*#__PURE__*/
function () {
  function VoteCount() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
    (0, _classCallCheck2["default"])(this, VoteCount);

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


  (0, _createClass2["default"])(VoteCount, [{
    key: "count",
    value: function count(value) {
      this["val_".concat(value)] += 1;
    }
  }]);
  return VoteCount;
}();

exports.VoteCount = VoteCount;