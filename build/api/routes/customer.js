'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _customerController = require('../controllers/customerController');

var _customerController2 = _interopRequireDefault(_customerController);

var _socialAuthController = require('../controllers/socialAuthController');

var _socialAuthController2 = _interopRequireDefault(_socialAuthController);

var _authenticate = require('../../middlewares/authenticate');

var _authenticate2 = _interopRequireDefault(_authenticate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var customerRouter = (0, _express.Router)();

customerRouter.post('/', _customerController2.default.register);

customerRouter.post('/login', _customerController2.default.login);
customerRouter.put('/', _authenticate2.default, _customerController2.default.UpdateCustomer);
customerRouter.get('/', _authenticate2.default, _customerController2.default.getCustomer);
customerRouter.put('/address', _authenticate2.default, _customerController2.default.UpdateCustomerAddress);
customerRouter.put('/creditCard', _authenticate2.default, _customerController2.default.UpdateCreditCard);

customerRouter.post('/facebook', _socialAuthController2.default.facebookAuth);

exports.default = customerRouter;