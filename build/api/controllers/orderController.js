"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint no-restricted-globals: ["error", "event", "fdescribe"] */

require("dotenv/config");

var _util = require("../../helpers/util");

var _util2 = _interopRequireDefault(_util);

var _emails = require("../../helpers/emails");

var _emails2 = _interopRequireDefault(_emails);

var _models = require("../../models");

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var errorResponse = _util2.default.errorResponse,
    validateOrderDetails = _util2.default.validateOrderDetails;

/**
 *
 *
 * @export
 * @class OrderController
 * @description Operations on Orders
 */

var OrderController = function () {
  function OrderController() {
    _classCallCheck(this, OrderController);
  }

  _createClass(OrderController, null, [{
    key: "createOrder",

    /**
     * @description -This method creates an order
     * @param {object} req - The request payload sent from the router
     * @param {object} res - The response payload sent back from the controller
     * @returns {object} - order id
     */
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
        var _req$body, cartId, shippingId, taxId, customerId, _validateOrderDetails, error, errorField, errorMessage, createOrderQuery, order, orderDetailsquery, orderDetails;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _req$body = req.body, cartId = _req$body.cart_id, shippingId = _req$body.shipping_id, taxId = _req$body.tax_id;
                customerId = req.user.customer_id;
                _validateOrderDetails = validateOrderDetails(req.body), error = _validateOrderDetails.error;

                if (!error) {
                  _context.next = 8;
                  break;
                }

                errorField = error.details[0].context.key;
                errorMessage = error.details[0].message;
                return _context.abrupt("return", errorResponse(res, 400, "ORD_01", errorMessage, errorField));

              case 8:
                createOrderQuery = "CALL shopping_cart_create_order(:cartId,:customerId,:shippingId,:taxId)";
                _context.next = 11;
                return _models2.default.sequelize.query(createOrderQuery, {
                  replacements: {
                    cartId: cartId,
                    customerId: customerId,
                    shippingId: shippingId,
                    taxId: taxId
                  }
                });

              case 11:
                order = _context.sent;
                orderDetailsquery = "CALL orders_get_order_info(" + order[0].orderId + ")";
                _context.next = 15;
                return _models2.default.sequelize.query(orderDetailsquery);

              case 15:
                orderDetails = _context.sent;
                _context.next = 18;
                return (0, _emails2.default)(req.user, orderDetails);

              case 18:
                res.status(200).json(order);
                _context.next = 25;
                break;

              case 21:
                _context.prev = 21;
                _context.t0 = _context["catch"](0);

                console.error(_context.t0);
                res.status(500).json({ error: "Internal Server Error" });

              case 25:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 21]]);
      }));

      function createOrder(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return createOrder;
    }()

    /**
     * @description -This gets details of an order
     * @param {object} req - The request payload
     * @param {object} res - The response payload sent back from the method
     * @returns {object} - order
     */

  }, {
    key: "getOrderInfo",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
        var orderId, query, order;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                orderId = req.params.orderId;

                if (!isNaN(orderId)) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt("return", errorResponse(res, 400, "ORD_01", "Order id must be a number", "order id"));

              case 4:
                query = "CALL orders_get_order_info(" + orderId + ")";
                _context2.next = 7;
                return _models2.default.sequelize.query(query);

              case 7:
                order = _context2.sent;

                if (!(order.length > 0)) {
                  _context2.next = 10;
                  break;
                }

                return _context2.abrupt("return", res.status(200).json(order));

              case 10:
                return _context2.abrupt("return", errorResponse(res, 404, "ORD_01", "Order Not found", "order"));

              case 13:
                _context2.prev = 13;
                _context2.t0 = _context2["catch"](0);

                res.status(500).json({ error: "Internal Server Error" });

              case 16:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 13]]);
      }));

      function getOrderInfo(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return getOrderInfo;
    }()
  }]);

  return OrderController;
}();

exports.default = OrderController;