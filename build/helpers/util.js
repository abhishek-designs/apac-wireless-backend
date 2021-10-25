"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bcrypt = require("bcrypt");

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _joi = require("@hapi/joi");

var _joi2 = _interopRequireDefault(_joi);

require("dotenv/config");

var _validationSchema = require("./validationSchema");

var _validationSchema2 = _interopRequireDefault(_validationSchema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var options = { language: { key: "{{key}} " } };

exports.default = {
  hashPassword: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(password) {
      var hash;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _bcrypt2.default.hash(password, 10);

            case 2:
              hash = _context.sent;
              return _context.abrupt("return", hash);

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function hashPassword(_x) {
      return _ref.apply(this, arguments);
    }

    return hashPassword;
  }(),
  comparePasswords: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(password, userPassword) {
      var match;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _bcrypt2.default.compare(password, userPassword);

            case 2:
              match = _context2.sent;
              return _context2.abrupt("return", match);

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function comparePasswords(_x2, _x3) {
      return _ref2.apply(this, arguments);
    }

    return comparePasswords;
  }(),
  createToken: function createToken(user) {
    var customerId = user.customer_id,
        name = user.name,
        email = user.email;

    return _jsonwebtoken2.default.sign({ customer_id: customerId, name: name, email: email }, process.env.SECRET, { expiresIn: 86400 });
  },
  validateRegisterDetails: function validateRegisterDetails(user) {
    return _joi2.default.validate(user, _validationSchema2.default.registerSchema, options);
  },
  validateLoginDetails: function validateLoginDetails(user) {
    return _joi2.default.validate(user, _validationSchema2.default.loginSchema, options);
  },
  validateAddressDetails: function validateAddressDetails(user) {
    return _joi2.default.validate(user, _validationSchema2.default.addressSchema, options);
  },
  validateCardDetails: function validateCardDetails(user) {
    return _joi2.default.validate(user, _validationSchema2.default.cardSchema, options);
  },
  validateCustomerDetails: function validateCustomerDetails(user) {
    return _joi2.default.validate(user, _validationSchema2.default.customerSchema, options);
  },
  validateCartDetails: function validateCartDetails(user) {
    return _joi2.default.validate(user, _validationSchema2.default.shoppingCartSchema, options);
  },
  validateOrderDetails: function validateOrderDetails(user) {
    return _joi2.default.validate(user, _validationSchema2.default.orderSchema, options);
  },
  errorResponse: function errorResponse(res, status, code, message, field) {
    return res.status(status).json({
      error: {
        status: status,
        code: code,
        message: message,
        field: field || ""
      }
    });
  },


  // lorem ipsum doler sit amet
  // lorem ipsum...
  truncateDescription: function truncateDescription(products, descriptionLength) {
    var allProducts = products.map(function (product) {
      var length = product.dataValues.description.length;

      console.log(length, descriptionLength);
      if (length > descriptionLength) {
        product.dataValues.description = product.dataValues.description.slice(0, descriptionLength) + "...";
      }
      // console.log(product);
      return product;
    });
    return allProducts;
  }
};