'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _shoppingCartController = require('../controllers/shoppingCartController');

var _shoppingCartController2 = _interopRequireDefault(_shoppingCartController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var productRouter = (0, _express.Router)();

productRouter.get('/generateUniqueId', _shoppingCartController2.default.generateUniqueId);
productRouter.post('/add', _shoppingCartController2.default.addProductToCart);
productRouter.get('/:cart_id', _shoppingCartController2.default.getProductsInCart);
productRouter.delete('/empty/:cart_id', _shoppingCartController2.default.emptyCart);
productRouter.delete('/removeProduct/:item_id', _shoppingCartController2.default.removeProduct);

exports.default = productRouter;