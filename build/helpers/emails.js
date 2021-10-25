'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mail = require('@sendgrid/mail');

var _mail2 = _interopRequireDefault(_mail);

require('dotenv/config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_mail2.default.setApiKey(process.env.SENDGRID_API_KEY);

var orderEmail = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(user, details) {
    var msg;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            msg = {
              to: '' + user.email,
              from: 'admin@tshirtshop.com',
              subject: 'Successful Order Placement',
              html: '<strong>Thanks for the order</strong>\n    <p>Here are your order details</p>\n    <p>Total Amount : ' + details[0].total_amount + '</p>\n    <p>Shipping Type : ' + details[0].shipping_type + '</p>\n    <p>Shipping Cost : ' + details[0].shipping_cost + '</p>\n    <p>Tax Type : ' + details[0].tax_type + '</p>\n    <p>Tax Percentage : ' + details[0].tax_percentage + '</p>\n    '
            };
            _context.next = 3;
            return _mail2.default.send(msg);

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function orderEmail(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = orderEmail;