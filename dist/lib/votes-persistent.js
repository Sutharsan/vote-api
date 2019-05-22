"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initStorage = initStorage;
exports.addVote = addVote;
exports.getVoteAverage = getVoteAverage;
exports.getVoteCount = getVoteCount;
exports.clearStorage = clearStorage;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var storage = require('node-persist');

var _require = require('./votes'),
    Vote = _require.Vote,
    AverageVote = _require.AverageVote,
    VoteCount = _require.VoteCount;

var floodWindow = 3600;
var floodThresholdById = 1;
var floodThresholdBySource = 10;
var voteHistoryStorage = storage.create({
  dir: 'storage/history',
  ttl: floodWindow
});
var voteAverageStorage = storage.create({
  dir: 'storage/avarage'
});
var voteCountStorage = storage.create({
  dir: 'storage/count'
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
            return isFlooding(vote);

          case 5:
            _context2.t0 = _context2.sent;

            if (!(_context2.t0 === false)) {
              _context2.next = 13;
              break;
            }

            _context2.next = 9;
            return pushHistory(vote);

          case 9:
            _context2.next = 11;
            return updateAverage(vote);

          case 11:
            _context2.next = 13;
            return updateCount(vote);

          case 13:
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
/**
 * Checks if a flood is going on.
 *
 * @param {Vote} vote
 *
 * @returns {Promise<boolean>}
 *   True if this vote is considered to be part of a flood.
 */


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

function isFlooding(_x9) {
  return _isFlooding.apply(this, arguments);
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


function _isFlooding() {
  _isFlooding = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee8(vote) {
    var flooding, sameIdVotes, sameSourceVotes;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            flooding = false; // Voted for same ID in flood window.

            if (!(floodThresholdById > 0)) {
              _context8.next = 6;
              break;
            }

            _context8.next = 4;
            return similarVotes({
              id: vote.id,
              source: vote.source
            });

          case 4:
            sameIdVotes = _context8.sent;
            flooding = sameIdVotes >= floodThresholdById;

          case 6:
            if (!(floodThresholdBySource > 0)) {
              _context8.next = 11;
              break;
            }

            _context8.next = 9;
            return similarVotes({
              source: vote.source
            });

          case 9:
            sameSourceVotes = _context8.sent;
            flooding = flooding || sameSourceVotes >= floodThresholdBySource;

          case 11:
            return _context8.abrupt("return", flooding);

          case 12:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));
  return _isFlooding.apply(this, arguments);
}

function similarVotes(_x10) {
  return _similarVotes.apply(this, arguments);
}
/**
 * Clears the vote storage.
 *
 * @param id
 *   (Optional) vote ID for which to clear the storage.
 *
 * @returns {Promise<void>}
 */


function _similarVotes() {
  _similarVotes = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee9(conditions) {
    var count;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            count = 0;
            _context9.next = 3;
            return voteHistoryStorage.forEach(function (data) {
              var vote = new Vote(data.value);
              var match = true;
              Object.keys(conditions).forEach(function (key) {
                match = match && conditions.key === vote.key;
              });

              if (match) {
                count += 1;
              }
            });

          case 3:
            return _context9.abrupt("return", count);

          case 4:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));
  return _similarVotes.apply(this, arguments);
}

function clearStorage() {
  return _clearStorage.apply(this, arguments);
}

function _clearStorage() {
  _clearStorage = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee10() {
    var id,
        _args10 = arguments;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            id = _args10.length > 0 && _args10[0] !== undefined ? _args10[0] : 0;

            if (!(id === 0)) {
              _context10.next = 10;
              break;
            }

            _context10.next = 4;
            return voteHistoryStorage.clear();

          case 4:
            _context10.next = 6;
            return voteAverageStorage.clear();

          case 6:
            _context10.next = 8;
            return voteCountStorage.clear();

          case 8:
            _context10.next = 12;
            break;

          case 10:
            voteAverageStorage.removeItem(id);
            voteCountStorage.removeItem(id);

          case 12:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));
  return _clearStorage.apply(this, arguments);
}