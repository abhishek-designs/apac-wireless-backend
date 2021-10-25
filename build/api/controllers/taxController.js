'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint no-restricted-globals: ["error", "event", "fdescribe"] */


require('dotenv/config');

var _models = require('../../models');

var _util = require('../../helpers/util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var errorResponse = _util2.default.errorResponse;

/**
 * @export
 * @class TaxController
 * @description Handles tax related actions
 */

var TaxController = function () {
  function TaxController() {
    _classCallCheck(this, TaxController);
  }

  _createClass(TaxController, null, [{
    key: 'getAllTaxes',

    /**
        * @description -This method gets all taxes
        * @param {object} req - The request payload sent from the router
        * @param {object} res - The response payload sent back from the controller
        * @returns {object} - taxes
        */
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
        var taxes;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _models.Tax.findAll();

              case 2:
                taxes = _context.sent;
                return _context.abrupt('return', res.status(200).json(taxes));

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getAllTaxes(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return getAllTaxes;
    }()

    /**
        * @description -This method gets a single tax detail
        * @param {object} req - The request payload sent from the router
        * @param {object} res - The response payload sent back from the controller
        * @returns {object} - tax
        */

  }, {
    key: 'getTax',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
        var taxId, tax;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                taxId = req.params.taxId;
                _context2.prev = 1;

                if (!isNaN(taxId)) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt('return', errorResponse(res, 400, 'USR_01', 'tax id must be a number', 'tax id'));

              case 4:
                _context2.next = 6;
                return _models.Tax.findOne({
                  where: { tax_id: taxId }
                });

              case 6:
                tax = _context2.sent;

                if (!tax) {
                  _context2.next = 9;
                  break;
                }

                return _context2.abrupt('return', res.status(200).json(tax));

              case 9:
                return _context2.abrupt('return', errorResponse(res, 404, 'PRO_01', 'Tax Not found', 'tax'));

              case 12:
                _context2.prev = 12;
                _context2.t0 = _context2['catch'](1);

                res.status(500).json({ error: 'Internal Server Error' });

              case 15:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[1, 12]]);
      }));

      function getTax(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return getTax;
    }()
  }]);

  return TaxController;
}();

exports.default = TaxController;