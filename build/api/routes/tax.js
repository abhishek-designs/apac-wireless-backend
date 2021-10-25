'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _taxController = require('../controllers/taxController');

var _taxController2 = _interopRequireDefault(_taxController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var taxRouter = (0, _express.Router)();

taxRouter.get('/', _taxController2.default.getAllTaxes);
taxRouter.get('/:taxId', _taxController2.default.getTax);

exports.default = taxRouter;