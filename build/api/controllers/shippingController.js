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
 * @class ShippingController
 * @description Handles shipping regions related actions
 */

var ShippingController = function () {
  function ShippingController() {
    _classCallCheck(this, ShippingController);
  }

  _createClass(ShippingController, null, [{
    key: 'getShippingRegions',

    /**
        * @description -This method gets all shipping regions
        * @param {object} req - The request payload sent from the router
        * @param {object} res - The response payload sent back from the controller
        * @returns {object} - regions
        */
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
        var regions;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _models.ShoppingRegion.findAll();

              case 2:
                regions = _context.sent;
                return _context.abrupt('return', res.status(200).json(regions));

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getShippingRegions(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return getShippingRegions;
    }()

    /**
        * @description -This method gets a single shipping region detail
        * @param {object} req - The request payload sent from the router
        * @param {object} res - The response payload sent back from the controller
        * @returns {object} - tax
        */

  }, {
    key: 'getShippingRegion',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
        var regionId, region;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                regionId = req.params.regionId;
                _context2.prev = 1;

                if (!isNaN(regionId)) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt('return', errorResponse(res, 400, 'SHP_01', 'shipping region id must be a number', 'shipping region id'));

              case 4:
                _context2.next = 6;
                return _models.ShoppingRegion.findOne({
                  where: { shipping_region_id: regionId }
                });

              case 6:
                region = _context2.sent;

                if (!region) {
                  _context2.next = 9;
                  break;
                }

                return _context2.abrupt('return', res.status(200).json(region));

              case 9:
                return _context2.abrupt('return', errorResponse(res, 404, 'SHP_01', 'Shipping region Not found', 'shipping region'));

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

      function getShippingRegion(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return getShippingRegion;
    }()
  }]);

  return ShippingController;
}();

exports.default = ShippingController;