'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint no-restricted-globals: ["error", "event", "fdescribe"] */

require('dotenv/config');

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _shoppingCart = require('../../helpers/shoppingCart');

var _shoppingCart2 = _interopRequireDefault(_shoppingCart);

var _util = require('../../helpers/util');

var _util2 = _interopRequireDefault(_util);

var _models = require('../../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShoppingCart = _models2.default.ShoppingCart,
    Product = _models2.default.Product;
var errorResponse = _util2.default.errorResponse,
    validateCartDetails = _util2.default.validateCartDetails;

/**
 *
 *
 * @export
 * @class ShoppingCartController
 * @description Operations on Products
 */

var ShoppingCartController = function () {
  function ShoppingCartController() {
    _classCallCheck(this, ShoppingCartController);
  }

  _createClass(ShoppingCartController, null, [{
    key: 'generateUniqueId',

    /**
      * @description -This method generates a unique id
      * @param {object} req - The request payload sent from the router
      * @param {object} res - The response payload sent back from the controller
      * @returns {object} - unique id
      */
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
        var uniqueId;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _crypto2.default.randomBytes(16).toString('hex');

              case 3:
                uniqueId = _context.sent;

                if (!uniqueId) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt('return', res.status(200).json({ cart_id: uniqueId }));

              case 6:
                _context.next = 11;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context['catch'](0);

                res.status(500).json({ error: 'Internal server error' });

              case 11:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 8]]);
      }));

      function generateUniqueId(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return generateUniqueId;
    }()

    /**
      * @description -This method adds a  product to cart
      * @param {object} req - The request payload sent from the router
      * @param {object} res - The response payload sent back from the controller
      * @returns {array} - adds a product to cart
      */

  }, {
    key: 'addProductToCart',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
        var _req$body, cartId, productId, attributes, _validateCartDetails, error, errorField, errorMessage, product, existingCart, quantity, cartItems, shoppingCartItems;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _req$body = req.body, cartId = _req$body.cart_id, productId = _req$body.product_id, attributes = _req$body.attributes;
                _validateCartDetails = validateCartDetails(req.body), error = _validateCartDetails.error;

                if (!error) {
                  _context2.next = 7;
                  break;
                }

                errorField = error.details[0].context.key;
                errorMessage = error.details[0].message;
                return _context2.abrupt('return', errorResponse(res, 400, 'PRD_01', errorMessage, errorField));

              case 7:
                _context2.next = 9;
                return Product.findOne({
                  where: { product_id: productId }
                });

              case 9:
                product = _context2.sent;

                if (!product) {
                  _context2.next = 29;
                  break;
                }

                _context2.next = 13;
                return ShoppingCart.findOne({
                  where: { cart_id: cartId, product_id: productId, attributes: attributes }
                });

              case 13:
                existingCart = _context2.sent;

                if (existingCart) {
                  _context2.next = 19;
                  break;
                }

                _context2.next = 17;
                return ShoppingCart.create({
                  cart_id: cartId,
                  product_id: productId,
                  quantity: 1,
                  added_on: Date.now(),
                  attributes: attributes
                });

              case 17:
                _context2.next = 22;
                break;

              case 19:
                quantity = existingCart.quantity + 1;
                _context2.next = 22;
                return existingCart.update({
                  cart_id: cartId,
                  product_id: productId,
                  quantity: quantity,
                  attributes: attributes
                });

              case 22:
                _context2.next = 24;
                return ShoppingCart.findAll({
                  where: { cart_id: cartId },
                  include: [{
                    model: Product
                  }]
                });

              case 24:
                cartItems = _context2.sent;
                shoppingCartItems = (0, _shoppingCart2.default)(cartItems);

                res.status(200).json(shoppingCartItems);
                _context2.next = 30;
                break;

              case 29:
                return _context2.abrupt('return', res.status(404).json({
                  error: {
                    status: 404,
                    message: 'Product cannot be found'
                  }
                }));

              case 30:
                _context2.next = 35;
                break;

              case 32:
                _context2.prev = 32;
                _context2.t0 = _context2['catch'](0);

                res.status(500).json({ error: 'Internal Server Error' });

              case 35:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 32]]);
      }));

      function addProductToCart(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return addProductToCart;
    }()

    /**
        * @description -This method gets products in cart
        * @param {object} req - The request payload sent from the router
        * @param {object} res - The response payload sent back from the controller
        * @returns {array} - cart products
        */

  }, {
    key: 'getProductsInCart',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
        var cartId, cartItems, shoppingCartItems;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                cartId = req.params.cart_id;
                _context3.next = 4;
                return ShoppingCart.findAll({
                  where: { cart_id: cartId },
                  include: [{
                    model: Product
                  }]
                });

              case 4:
                cartItems = _context3.sent;

                if (!(cartItems.length > 0)) {
                  _context3.next = 10;
                  break;
                }

                shoppingCartItems = (0, _shoppingCart2.default)(cartItems);

                res.status(200).json(shoppingCartItems);
                _context3.next = 11;
                break;

              case 10:
                return _context3.abrupt('return', errorResponse(res, 400, 'PRD_01', 'Cart id  does not exist', 'cart Id'));

              case 11:
                _context3.next = 16;
                break;

              case 13:
                _context3.prev = 13;
                _context3.t0 = _context3['catch'](0);

                res.status(500).json({ error: 'Internal Server Error' });

              case 16:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 13]]);
      }));

      function getProductsInCart(_x5, _x6) {
        return _ref3.apply(this, arguments);
      }

      return getProductsInCart;
    }()

    /**
      * @description -This method clears the cart
      * @param {object} req - The request payload sent from the router
      * @param {object} res - The response payload sent back from the controller
      * @returns {array} - empty cart
      */

  }, {
    key: 'emptyCart',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
        var cartId;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                cartId = req.params.cart_id;
                _context4.next = 4;
                return ShoppingCart.destroy({
                  where: { cart_id: cartId }
                });

              case 4:
                res.status(200).json([]);
                _context4.next = 10;
                break;

              case 7:
                _context4.prev = 7;
                _context4.t0 = _context4['catch'](0);

                res.status(500).json({ error: 'Internal Server Error' });

              case 10:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 7]]);
      }));

      function emptyCart(_x7, _x8) {
        return _ref4.apply(this, arguments);
      }

      return emptyCart;
    }()

    /**
      * @description -This method removes an item from the cart
      * @param {object} req - The request payload sent from the router
      * @param {object} res - The response payload sent back from the controller
      * @returns {array} - empty cart
      */

  }, {
    key: 'removeProduct',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
        var itemId, item, query;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                itemId = req.params.item_id;
                _context5.next = 4;
                return ShoppingCart.findOne({ where: { item_id: itemId } });

              case 4:
                item = _context5.sent;

                if (item) {
                  _context5.next = 7;
                  break;
                }

                return _context5.abrupt('return', errorResponse(res, 404, 'CART_01', 'No item found', 'item_id'));

              case 7:
                query = 'CALL shopping_cart_remove_product(' + itemId + ');';
                _context5.next = 10;
                return _models2.default.sequelize.query(query);

              case 10:
                return _context5.abrupt('return', res.status(204).json());

              case 13:
                _context5.prev = 13;
                _context5.t0 = _context5['catch'](0);

                res.status(500).json({ error: 'Internal Server Error' });

              case 16:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[0, 13]]);
      }));

      function removeProduct(_x9, _x10) {
        return _ref5.apply(this, arguments);
      }

      return removeProduct;
    }()
  }]);

  return ShoppingCartController;
}();

exports.default = ShoppingCartController;