'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('dotenv/config');

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _models = require('../../models');

var _util = require('../../helpers/util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var createToken = _util2.default.createToken,
    errorResponse = _util2.default.errorResponse;

/**
 * @export
 * @class SocialLoginController
 * @description Login with social accounts
 */

var SocialAuthController = function () {
  function SocialAuthController() {
    _classCallCheck(this, SocialAuthController);
  }

  _createClass(SocialAuthController, null, [{
    key: 'facebookAuth',

    /**
      * @description returns customer authentication details
      * @static
      * @param {object} req
      * @param {object} res
      * @returns {json} json
    */
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
        var _this = this;

        var facebookToken, path;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                facebookToken = req.body.access_token;

                if (facebookToken) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt('return', errorResponse(res, 400, 'USR_01', 'Access Token is required', 'facebook'));

              case 3:
                try {
                  if (facebookToken) {
                    path = 'https://graph.facebook.com/v3.3/me?access_token=' + facebookToken + '&fields=id,name,email';

                    (0, _request2.default)(path, function () {
                      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(error, response, body) {
                        var userDetails, customer, token;
                        return regeneratorRuntime.wrap(function _callee$(_context) {
                          while (1) {
                            switch (_context.prev = _context.next) {
                              case 0:
                                userDetails = JSON.parse(body);

                                if (!(!error && response && response.statusCode && response.statusCode === 200)) {
                                  _context.next = 10;
                                  break;
                                }

                                _context.next = 4;
                                return _models.Customer.scope('withoutPassword').findOrCreate({
                                  where: { email: userDetails.email },
                                  defaults: { name: userDetails.name, password: 'facebook' }
                                });

                              case 4:
                                customer = _context.sent;

                                if (customer[1]) {
                                  delete customer[0].dataValues.password;
                                }
                                token = createToken(customer[0]);

                                res.status(200).json({ customer: customer[0], accessToken: 'Bearer ' + token, expires_in: '24hr' });
                                _context.next = 11;
                                break;

                              case 10:
                                return _context.abrupt('return', errorResponse(res, 500, 'USR_01', 'Access Forbidden', 'facebook'));

                              case 11:
                              case 'end':
                                return _context.stop();
                            }
                          }
                        }, _callee, _this);
                      }));

                      return function (_x3, _x4, _x5) {
                        return _ref2.apply(this, arguments);
                      };
                    }());
                  }
                } catch (error) {
                  res.status(500).json({ error: 'Internal Server Error' });
                }

              case 4:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function facebookAuth(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return facebookAuth;
    }()
  }]);

  return SocialAuthController;
}();

exports.default = SocialAuthController;