"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var storage = require('node-persist');

var _require = require('./votes'),
    Vote = _require.Vote,
    AverageVote = _require.AverageVote,
    VoteCount = _require.VoteCount;

var voteHistoryStorage = storage.create({
  dir: '../storage/history'
});
var voteAverageStorage = storage.create({
  dir: '../storage/avarage'
});
var voteCountStorage = storage.create({
  dir: '../storage/count'
});
/**
 * Initialize the storage.
 *
 * @returns {Promise<void>}
 */

function initStorage() {
  return _initStorage.apply(this, arguments);
}
/**
 * Adds a single vote to the history.
 *
 * @param id
 * @param value
 * @param source
 */


function _initStorage() {
  _initStorage = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return voteHistoryStorage.init();

          case 2:
            _context.next = 4;
            return voteAverageStorage.init();

          case 4:
            _context.next = 6;
            return voteCountStorage.init();

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _initStorage.apply(this, arguments);
}

function addVote(_x, _x2, _x3) {
  return _addVote.apply(this, arguments);
}
/**
 * Adds a vote to the history.
 *
 * @param {Vote} vote
 *
 * @returns {Promise<void>}
 */


function _addVote() {
  _addVote = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(id, value, source) {
    var vote;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!(value < 1 || value > 5)) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt("return");

          case 2:
            vote = new Vote(id, value, source);
            _context2.next = 5;
            return pushHistory(vote);

          case 5:
            _context2.next = 7;
            return updateAverage(vote);

          case 7:
            _context2.next = 9;
            return updateCount(vote);

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _addVote.apply(this, arguments);
}

function pushHistory(_x4) {
  return _pushHistory.apply(this, arguments);
}
/**
 * Updates vote results with single vote.
 *
 * @param {Vote} vote
 */


function _pushHistory() {
  _pushHistory = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(vote) {
    var key;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            key = "".concat(vote.id, ":").concat(vote.timestamp);
            _context3.next = 3;
            return voteHistoryStorage.setItem(key, vote);

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _pushHistory.apply(this, arguments);
}

function updateAverage(_x5) {
  return _updateAverage.apply(this, arguments);
}
/**
 * Updates vote count.
 *
 * @param {Vote} vote
 */


function _updateAverage() {
  _updateAverage = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee4(vote) {
    var average;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return voteAverageStorage.length();

          case 2:
            _context4.t0 = _context4.sent;

            if (!(_context4.t0 === 0)) {
              _context4.next = 7;
              break;
            }

            average = new AverageVote();
            _context4.next = 12;
            break;

          case 7:
            _context4.t1 = AverageVote;
            _context4.next = 10;
            return voteAverageStorage.getItem(vote.id);

          case 10:
            _context4.t2 = _context4.sent;
            average = new _context4.t1(_context4.t2);

          case 12:
            average.addVote(vote);
            _context4.next = 15;
            return voteAverageStorage.setItem(vote.id, average);

          case 15:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _updateAverage.apply(this, arguments);
}

function updateCount(_x6) {
  return _updateCount.apply(this, arguments);
}
/**
 * Returns the average vote data.
 *
 * @param id
 *
 * @returns {object}
 */


function _updateCount() {
  _updateCount = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee5(vote) {
    var count;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return voteAverageStorage.length();

          case 2:
            _context5.t0 = _context5.sent;

            if (!(_context5.t0 === 0)) {
              _context5.next = 7;
              break;
            }

            count = new VoteCount();
            _context5.next = 12;
            break;

          case 7:
            _context5.t1 = VoteCount;
            _context5.next = 10;
            return voteCountStorage.getItem(vote.id);

          case 10:
            _context5.t2 = _context5.sent;
            count = new _context5.t1(_context5.t2);

          case 12:
            count.count(vote.value);
            _context5.next = 15;
            return voteCountStorage.setItem(vote.id, count);

          case 15:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _updateCount.apply(this, arguments);
}

function getVoteAverage(_x7) {
  return _getVoteAverage.apply(this, arguments);
}
/**
 * Returns the vote count data.
 *
 * @param id
 *
 * @returns {VoteCount}
 */


function _getVoteAverage() {
  _getVoteAverage = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee6(id) {
    var averageVote, _averageVote, average, count;

    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            if (!(voteAverageStorage.length === 0)) {
              _context6.next = 4;
              break;
            }

            averageVote = new AverageVote();
            _context6.next = 9;
            break;

          case 4:
            _context6.t0 = AverageVote;
            _context6.next = 7;
            return voteAverageStorage.getItem(id);

          case 7:
            _context6.t1 = _context6.sent;
            averageVote = new _context6.t0(_context6.t1);

          case 9:
            _averageVote = averageVote, average = _averageVote.average, count = _averageVote.count;
            return _context6.abrupt("return", {
              average: average,
              count: count
            });

          case 11:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _getVoteAverage.apply(this, arguments);
}

function getVoteCount(_x8) {
  return _getVoteCount.apply(this, arguments);
}

function _getVoteCount() {
  _getVoteCount = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee7(id) {
    var count;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            if (!(voteCountStorage.length === 0)) {
              _context7.next = 4;
              break;
            }

            count = new VoteCount();
            _context7.next = 9;
            break;

          case 4:
            _context7.t0 = VoteCount;
            _context7.next = 7;
            return voteCountStorage.getItem(id);

          case 7:
            _context7.t1 = _context7.sent;
            count = new _context7.t0(_context7.t1);

          case 9:
            return _context7.abrupt("return", count);

          case 10:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _getVoteCount.apply(this, arguments);
}

module.exports.initStorage = initStorage;
module.exports.addVote = addVote;
module.exports.getVoteAverage = getVoteAverage;
module.exports.getVoteCount = getVoteCount;