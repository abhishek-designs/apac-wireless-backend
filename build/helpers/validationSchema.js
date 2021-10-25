'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('@hapi/joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loginSchema = {
  email: _joi2.default.string().min(5).max(100).required().email(),
  password: _joi2.default.string().min(5).max(50).required()
};

var customerSchema = {
  email: _joi2.default.string().min(5).max(100).email(),
  password: _joi2.default.string().min(5).max(50),
  name: _joi2.default.string().min(1).max(50),
  day_phone: _joi2.default.string(),
  eve_phone: _joi2.default.string(),
  mob_phone: _joi2.default.string()
};
var registerSchema = {
  email: _joi2.default.string().min(5).max(100).required().email(),
  password: _joi2.default.string().min(5).max(50).required(),
  name: _joi2.default.string().min(1).max(50).required()
};

var addressSchema = {
  address_1: _joi2.default.string().required(),
  address_2: _joi2.default.string(),
  city: _joi2.default.string().required(),
  region: _joi2.default.string().required(),
  postal_code: _joi2.default.string().required(),
  country: _joi2.default.string().required(),
  shipping_region_id: _joi2.default.number().required()
};

var shoppingCartSchema = {
  cart_id: _joi2.default.required(),
  product_id: _joi2.default.number().required(),
  attributes: _joi2.default.required()

};

var orderSchema = {
  cart_id: _joi2.default.required(),
  shipping_id: _joi2.default.number().required(),
  tax_id: _joi2.default.number().required(),
  status: _joi2.default.number(),
  reference: _joi2.default.string(),
  auth_code: _joi2.default.string(),
  comments: _joi2.default.string(),
  shipped_on: _joi2.default.date()

};

var cardSchema = {
  credit_card: _joi2.default.string().required()
};

exports.default = {
  loginSchema: loginSchema,
  cardSchema: cardSchema,
  orderSchema: orderSchema,
  shoppingCartSchema: shoppingCartSchema,
  addressSchema: addressSchema,
  registerSchema: registerSchema,
  customerSchema: customerSchema
};