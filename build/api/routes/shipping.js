'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _shippingController = require('../controllers/shippingController');

var _shippingController2 = _interopRequireDefault(_shippingController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var shippingRouter = (0, _express.Router)();

shippingRouter.get('/:regionId', _shippingController2.default.getShippingRegion);
shippingRouter.get('/', _shippingController2.default.getShippingRegions);

exports.default = shippingRouter;