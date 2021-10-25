'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('dotenv/config');

var _stripe = require('stripe');

var _stripe2 = _interopRequireDefault(_stripe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var key = process.env.STRIPE_KEY;
var Stripe = (0, _stripe2.default)(key);

/**
 *
 *
 * @export
 * @class PaymentController
 * @description Payment with stripe
 */

var PaymentController = function () {
  function PaymentController() {
    _classCallCheck(this, PaymentController);
  }

  _createClass(PaymentController, null, [{
    key: 'paymentWithStripe',

    /**
      * @description -This method charges on stripe
      * @param {object} req - The request payload sent from the router
      * @param {object} res - The response payload sent back from the controller
      * @returns {object} - charge and message
      */
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
        var _req$body, orderId, description, amount, currency, stripeToken, email, customer, charge;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _req$body = req.body, orderId = _req$body.order_id, description = _req$body.description, amount = _req$body.amount, currency = _req$body.currency, stripeToken = _req$body.stripeToken;
                email = req.user.email;
                _context.prev = 2;
                _context.next = 5;
                return Stripe.customers.create({
                  email: email,
                  source: stripeToken
                });

              case 5:
                customer = _context.sent;
                _context.next = 8;
                return Stripe.charges.create({
                  amount: amount,
                  description: description,
                  currency: currency,
                  customer: customer.id,
                  metadata: { order_id: orderId }
                });

              case 8:
                charge = _context.sent;

                res.status(200).json({ charge: charge, message: 'Payment processed' });
                _context.next = 15;
                break;

              case 12:
                _context.prev = 12;
                _context.t0 = _context['catch'](2);

                res.status(500).json({ error: 'Internal Server Error' });

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 12]]);
      }));

      function paymentWithStripe(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return paymentWithStripe;
    }()
  }]);

  return PaymentController;
}();

exports.default = PaymentController;