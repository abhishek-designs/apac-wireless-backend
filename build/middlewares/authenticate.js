'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

require('dotenv/config');

var _util = require('../helpers/util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var errorResponse = _util2.default.errorResponse;

// check and authenticate request token

var validateToken = function validateToken(req, res, next) {
  var token = req.headers['user-key'];
  if (!token) {
    return errorResponse(res, 401, 'AUT_01', 'Authorization code is empty', 'USER_KEY');
  }
  if (token.split(' ')[0] !== 'Bearer') {
    return errorResponse(res, 401, 'AUT_02', 'The userkey is invalid', 'USER_KEY');
  }
  var accessToken = token.split(' ')[1];
  _jsonwebtoken2.default.verify(accessToken, process.env.SECRET, function (err, decoded) {
    if (err) {
      return errorResponse(res, 401, 'AUT_02', 'The userkey is invalid', 'USER_KEY');
    }
    req.user = decoded;
    next();
  });
};
exports.default = validateToken;