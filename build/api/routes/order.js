'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _orderController = require('../controllers/orderController');

var _orderController2 = _interopRequireDefault(_orderController);

var _authenticate = require('../../middlewares/authenticate');

var _authenticate2 = _interopRequireDefault(_authenticate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var orderRouter = (0, _express.Router)();

orderRouter.post('/', _authenticate2.default, _orderController2.default.createOrder);
orderRouter.get('/:orderId', _orderController2.default.getOrderInfo);

exports.default = orderRouter;