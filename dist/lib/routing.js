"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAverage = getAverage;
exports.getStatistics = getStatistics;
exports.postVote = postVote;
exports.postVoteValidation = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _require = require('express-validator/check'),
    param = _require.param,
    validationResult = _require.validationResult;

var _require2 = require('./votes-persistent'),
    addVote = _require2.addVote,
    getVoteAverage = _require2.getVoteAverage,
    getVoteCount = _require2.getVoteCount;
/**
 * Callback: Return the vote average.
 */


function getAverage(_x, _x2) {
  return _getAverage.apply(this, arguments);
}
/**
 * Callback: Return the vote statistics.
 */


function _getAverage() {
  _getAverage = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(req, res) {
    var id;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            id = req.params.id;
            _context.t0 = res;
            _context.next = 4;
            return getVoteAverage(id);

          case 4:
            _context.t1 = _context.sent;

            _context.t0.json.call(_context.t0, _context.t1);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getAverage.apply(this, arguments);
}

function getStatistics(_x3, _x4) {
  return _getStatistics.apply(this, arguments);
}
/**
 * Validation chain for postVote.
 *
 * @type {ValidationChain[]}
 */


function _getStatistics() {
  _getStatistics = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(req, res) {
    var id;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id = req.params.id;
            _context2.t0 = res;
            _context2.next = 4;
            return getVoteAverage(id);

          case 4:
            _context2.t1 = _context2.sent;
            _context2.next = 7;
            return getVoteCount(id);

          case 7:
            _context2.t2 = _context2.sent;
            _context2.t3 = {
              average: _context2.t1,
              count: _context2.t2
            };

            _context2.t0.json.call(_context2.t0, _context2.t3);

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _getStatistics.apply(this, arguments);
}

var postVoteValidation = [param('value').isIn(['1', '2', '3', '4', '5']).withMessage('Parameter must be a value of 1 .. 5')];
/**
 * Callback: Store vote data.
 */

exports.postVoteValidation = postVoteValidation;

function postVote(_x5, _x6) {
  return _postVote.apply(this, arguments);
}

function _postVote() {
  _postVote = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(req, res) {
    var id, value, ip, errors;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id = req.params.id;
            value = req.params.value;
            ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            _context3.prev = 3;
            errors = validationResult(req);

            if (!errors.isEmpty()) {
              res.status(406).json({
                error: errors.mapped()
              });
            }

            _context3.next = 8;
            return addVote(id, value, ip);

          case 8:
            _context3.t0 = res;
            _context3.next = 11;
            return getVoteAverage(id);

          case 11:
            _context3.t1 = _context3.sent;

            _context3.t0.json.call(_context3.t0, _context3.t1);

            _context3.next = 17;
            break;

          case 15:
            _context3.prev = 15;
            _context3.t2 = _context3["catch"](3);

          case 17:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[3, 15]]);
  }));
  return _postVote.apply(this, arguments);
}