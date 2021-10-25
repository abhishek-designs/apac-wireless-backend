'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _paymentController = require('../controllers/paymentController');

var _paymentController2 = _interopRequireDefault(_paymentController);

var _authenticate = require('../../middlewares/authenticate');

var _authenticate2 = _interopRequireDefault(_authenticate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var paymentRouter = (0, _express.Router)();

paymentRouter.post('/charge', _authenticate2.default, _paymentController2.default.paymentWithStripe);

exports.default = paymentRouter;