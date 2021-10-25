'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// handles various bcryptmpasswordmoperations
var bcryptService = function bcryptService() {
  var password = function password(user) {
    var salt = _bcrypt2.default.genSaltSync();
    var hash = _bcrypt2.default.hashSync(user.password, salt);
    return hash;
  };
  var comparePassword = function comparePassword(pw, hash) {
    return _bcrypt2.default.compareSync(pw, hash);
  };
  return {
    password: password,
    comparePassword: comparePassword
  };
};

exports.default = bcryptService;