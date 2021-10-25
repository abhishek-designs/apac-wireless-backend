"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint no-restricted-globals: ["error", "event", "fdescribe"] */

require("dotenv/config");

var _sequelize = require("sequelize");

var _multer = require("multer");

var _multer2 = _interopRequireDefault(_multer);

var _asyncRedis = require("async-redis");

var _asyncRedis2 = _interopRequireDefault(_asyncRedis);

var _util = require("../../helpers/util");

var _util2 = _interopRequireDefault(_util);

var _models = require("../../models");

var _models2 = _interopRequireDefault(_models);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _exceljs = require("exceljs");

var _exceljs2 = _interopRequireDefault(_exceljs);

var _xlsx = require("xlsx");

var _xlsx2 = _interopRequireDefault(_xlsx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var redisClient = _asyncRedis2.default.createClient(process.env.REDIS_URL);

var Product = _models2.default.Product,
    Features = _models2.default.Features;
var errorResponse = _util2.default.errorResponse,
    truncateDescription = _util2.default.truncateDescription;

/**
 *
 *
 * @export
 * @class ProductController
 * @description Operations on Products
 */

var ProductController = function () {
  function ProductController() {
    _classCallCheck(this, ProductController);
  }

  _createClass(ProductController, null, [{
    key: "getAllProducts",

    /**
     * @description -This method returns all products
     * @param {object} req - The request payload
     * @param {object} res - The response payload sent back from the method
     * @returns {object} - number of total products
     */
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
        var _req$query, descriptionLength, limit, page, productsQuery, products, redisProducts, totalProducts;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _req$query = req.query, descriptionLength = _req$query.description_length, limit = _req$query.limit, page = _req$query.page;
                productsQuery = {
                  include: "feature",
                  limit: parseInt(limit || 5),
                  offset: parseInt(limit || 5) * (parseInt(page) - 1) || 0
                };
                products = void 0;
                _context.next = 6;
                return redisClient.get("cacheKey");

              case 6:
                redisProducts = _context.sent;

                console.log(redisProducts);

                if (!redisProducts) {
                  _context.next = 11;
                  break;
                }

                products = JSON.parse(redisProducts);
                return _context.abrupt("return", res.status(200).json({ count: products.count, rows: products.rows }));

              case 11:
                _context.next = 13;
                return Product.findAll(productsQuery);

              case 13:
                products = _context.sent;


                if (descriptionLength) {
                  products = truncateDescription(products, descriptionLength);
                }
                _context.next = 17;
                return Product.count();

              case 17:
                totalProducts = _context.sent;
                _context.next = 20;
                return redisClient.set("cacheKey", JSON.stringify({ count: totalProducts, rows: products }), "EX", 10);

              case 20:
                return _context.abrupt("return", res.status(200).json({ count: totalProducts, rows: products }));

              case 23:
                _context.prev = 23;
                _context.t0 = _context["catch"](0);

                console.error(_context.t0);
                res.status(500).json({ error: "Internal Server Error" });

              case 27:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 23]]);
      }));

      function getAllProducts(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return getAllProducts;
    }()

    /**
     * @description -This method views a single product
     * @param {object} req - The request payload
     * @param {object} res - The response payload sent back from the method
     * @returns {object} - product
     */

  }, {
    key: "getSingleProduct",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
        var productId, product;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                productId = req.params.product_id;

                if (!isNaN(productId)) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt("return", errorResponse(res, 400, "USR_01", "Product id must be a number", "product id"));

              case 4:
                _context2.next = 6;
                return Product.findOne({
                  where: { product_id: productId }
                });

              case 6:
                product = _context2.sent;

                if (!product) {
                  _context2.next = 9;
                  break;
                }

                return _context2.abrupt("return", res.status(200).json(product));

              case 9:
                return _context2.abrupt("return", errorResponse(res, 404, "PRO_01", "Product Not found", "product"));

              case 12:
                _context2.prev = 12;
                _context2.t0 = _context2["catch"](0);

                res.status(500).json({ error: "Internal Server Error" });

              case 15:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 12]]);
      }));

      function getSingleProduct(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return getSingleProduct;
    }()

    /**
     * @description -This method search products
     * @param {object} req - The request payload
     * @param {object} res - The response payload sent back from the controller
     * @returns {object} - products
     */

  }, {
    key: "searchProducts",
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
        var _req$query2, page, limit, descriptionLength, queryString, allWords, query, products, count;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _req$query2 = req.query, page = _req$query2.page, limit = _req$query2.limit, descriptionLength = _req$query2.description_length, queryString = _req$query2.query_string, allWords = _req$query2.all_words;

                if (!queryString) {
                  errorResponse(res, 400, "USR_01", "Query string is required", "query_string");
                }
                query = void 0;

                if (allWords === "on") {
                  query = {
                    where: _defineProperty({}, _sequelize.Op.or, [{
                      name: _defineProperty({}, _sequelize.Op.like, "" + queryString)
                    }, {
                      description: _defineProperty({}, _sequelize.Op.like, "" + queryString)
                    }])
                  };
                } else {
                  query = {
                    where: _defineProperty({}, _sequelize.Op.or, [{
                      name: _defineProperty({}, _sequelize.Op.like, "%" + queryString + "%")
                    }, {
                      description: _defineProperty({}, _sequelize.Op.like, "%" + queryString + "%")
                    }])
                  };
                }
                query.limit = parseInt(limit) || 20;
                query.offset = parseInt(limit || 20) * (parseInt(page) - 1) || 0;
                _context3.next = 9;
                return Product.findAll(query);

              case 9:
                products = _context3.sent;

                if (descriptionLength) {
                  products = truncateDescription(products, descriptionLength);
                }
                count = products.length;
                return _context3.abrupt("return", res.status(200).json({ count: count, rows: products }));

              case 15:
                _context3.prev = 15;
                _context3.t0 = _context3["catch"](0);

                res.status(500).json({ error: "Internal Server Error" });

              case 18:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 15]]);
      }));

      function searchProducts(_x5, _x6) {
        return _ref3.apply(this, arguments);
      }

      return searchProducts;
    }()

    /**
     * @description -This method gets products in a category
     * @param {object} req - The request payload sent from the router
     * @param {object} res - The response payload sent back from the controller
     * @returns {object} - products in category
     */

  }, {
    key: "getProductsInCategory",
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
        var categoryId, _req$query3, page, _req$query3$limit, limit, _req$query3$descripti, descriptionLength, startIndex, query, products, count;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                categoryId = req.params.categoryId;

                if (!categoryId) {
                  errorResponse(res, 400, "USR_01", "Category Id is required", "category id");
                }

                if (!isNaN(categoryId)) {
                  _context4.next = 5;
                  break;
                }

                return _context4.abrupt("return", errorResponse(res, 400, "USR_01", "Category id must be a number", "category id"));

              case 5:
                _req$query3 = req.query, page = _req$query3.page, _req$query3$limit = _req$query3.limit, limit = _req$query3$limit === undefined ? 20 : _req$query3$limit, _req$query3$descripti = _req$query3.description_length, descriptionLength = _req$query3$descripti === undefined ? 200 : _req$query3$descripti;
                startIndex = 0;

                if (page) startIndex = (page - 1) * limit;

                query = "CALL catalog_get_products_in_category(:categoryId,:descriptionLength,:limit,:startIndex)";
                _context4.next = 11;
                return _models2.default.sequelize.query(query, {
                  replacements: {
                    categoryId: categoryId,
                    descriptionLength: descriptionLength,
                    limit: limit,
                    startIndex: startIndex
                  }
                });

              case 11:
                products = _context4.sent;
                count = products.length;
                return _context4.abrupt("return", res.status(200).json({ count: count, rows: products }));

              case 16:
                _context4.prev = 16;
                _context4.t0 = _context4["catch"](0);

                res.status(500).json({ error: "Internal Server Error" });

              case 19:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 16]]);
      }));

      function getProductsInCategory(_x7, _x8) {
        return _ref4.apply(this, arguments);
      }

      return getProductsInCategory;
    }()

    /**
     * @description -This method gets products in a department
     * @param {object} req - The request payload sent from the router
     * @param {object} res - The response payload sent back from the controller
     * @returns {object} - products in department
     */

  }, {
    key: "getProductsInDepartment",
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
        var departmentId, _req$query4, page, _req$query4$limit, limit, _req$query4$descripti, descriptionLength, startIndex, query, products, count;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                departmentId = req.params.departmentId;

                if (!departmentId) {
                  errorResponse(res, 400, "USR_01", "Category Id is required", "category id");
                }

                if (!isNaN(departmentId)) {
                  _context5.next = 5;
                  break;
                }

                return _context5.abrupt("return", errorResponse(res, 400, "USR_01", "department id must be a number", "department id"));

              case 5:
                _req$query4 = req.query, page = _req$query4.page, _req$query4$limit = _req$query4.limit, limit = _req$query4$limit === undefined ? 20 : _req$query4$limit, _req$query4$descripti = _req$query4.description_length, descriptionLength = _req$query4$descripti === undefined ? 200 : _req$query4$descripti;
                startIndex = 0;

                if (page) startIndex = (page - 1) * limit;

                query = "CALL catalog_get_products_on_department(:departmentId,:descriptionLength,:limit,:startIndex)";
                _context5.next = 11;
                return _models2.default.sequelize.query(query, {
                  replacements: {
                    departmentId: departmentId,
                    descriptionLength: descriptionLength,
                    limit: limit,
                    startIndex: startIndex
                  }
                });

              case 11:
                products = _context5.sent;
                count = products.length;
                return _context5.abrupt("return", res.status(200).json({ count: count, rows: products }));

              case 16:
                _context5.prev = 16;
                _context5.t0 = _context5["catch"](0);

                res.status(500).json({ error: "Internal Server Error" });

              case 19:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[0, 16]]);
      }));

      function getProductsInDepartment(_x9, _x10) {
        return _ref5.apply(this, arguments);
      }

      return getProductsInDepartment;
    }()

    /**
     * @description -Add a product (Admin only)
     * @param {object} req - The request payload sent from the router
     * @param {object} res - The response payload sent back from the controller
     * @returns {object} - Message regarding the product added
     */

  }, {
    key: "addProduct",
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
        var product, addedProduct;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;

                // Get the product data from the request
                product = req.body;

                if (product) {
                  _context6.next = 4;
                  break;
                }

                return _context6.abrupt("return", res.status(400).json({ msg: "Please give some products" }));

              case 4:
                _context6.next = 6;
                return Product.create(product);

              case 6:
                addedProduct = _context6.sent;

                console.log(addedProduct);
                // if(!addedProduct) throw new DatabaseError
                // console.log(addedProduct.product_id)
                res.status(200).json({ msg: "Product saved!!" });
                _context6.next = 15;
                break;

              case 11:
                _context6.prev = 11;
                _context6.t0 = _context6["catch"](0);

                console.error(_context6.t0);
                res.status(500).json({ error: "Internal Server Error" });

              case 15:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 11]]);
      }));

      function addProduct(_x11, _x12) {
        return _ref6.apply(this, arguments);
      }

      return addProduct;
    }()

    /**
     * @description -Add product features (Admin only)
     * @param {object} req - The request payload sent from the router
     * @param {object} res - The response payload sent back from the controller
     * @returns {object} - Message regarding the product added
     */

  }, {
    key: "addProductFeatures",
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res) {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                _context7.next = 3;
                return Features.create(req.body);

              case 3:
                res.status(200).json({ msg: "Features saved!!" });
                _context7.next = 10;
                break;

              case 6:
                _context7.prev = 6;
                _context7.t0 = _context7["catch"](0);

                console.error(_context7.t0);
                res.status(500).json({ error: "Internal Server Error" });

              case 10:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this, [[0, 6]]);
      }));

      function addProductFeatures(_x13, _x14) {
        return _ref7.apply(this, arguments);
      }

      return addProductFeatures;
    }()

    /**
     * @description -Get related products (Admin only)
     * @param {object} req - The request payload sent from the router
     * @param {object} res - The response payload sent back from the controller
     * @returns {object} - Message regarding the product added
     */

  }, {
    key: "getRelatedProducts",
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req, res) {
        var productBrand, productQuery, relatedProducts;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.prev = 0;
                productBrand = req.query.brand;
                productQuery = {
                  where: { brand_name: productBrand },
                  attributes: ["product_id", "name", "image", "price", "discounted_price", "brand_name"]
                };
                _context8.next = 5;
                return Product.findAll(productQuery);

              case 5:
                relatedProducts = _context8.sent;

                res.status(200).json(relatedProducts);
                _context8.next = 13;
                break;

              case 9:
                _context8.prev = 9;
                _context8.t0 = _context8["catch"](0);

                console.error(_context8.t0);
                res.status(500).json({ msg: "Internal server error" });

              case 13:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this, [[0, 9]]);
      }));

      function getRelatedProducts(_x15, _x16) {
        return _ref8.apply(this, arguments);
      }

      return getRelatedProducts;
    }()

    /**
     * @description -Upload products through excel sheet (Admin only)
     * @param {object} req - The request payload sent from the router
     * @param {object} res - The response payload sent back from the controller
     * @returns {object} - Message regarding the product added
     */

  }, {
    key: "addUploadedProducts",
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(req, res) {
        var _this = this;

        var excelFilter, storage, upload;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                try {
                  excelFilter = function excelFilter(req, file, callback) {
                    if (file.mimetype.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") || file.mimetype.includes("application/vnd.ms-excel")) {
                      callback(null, true);
                    } else {
                      callback("Please upload only excel file", false);
                    }
                  };

                  // Specifying the path for the uploaded file


                  storage = _multer2.default.diskStorage({
                    destination: function destination(req, file, callback) {
                      callback(null, "src/uploads");
                    },
                    filename: function filename(req, file, callback) {
                      // callback(null, "products");
                      callback(null, Date.now() + "-" + file.originalname);
                    }
                  });

                  // ??Get the uploaded single file from the client through form data key 'file'

                  upload = (0, _multer2.default)({ storage: storage, fileFilter: excelFilter }).single("file");

                  // Upload the file to specified path

                  upload(req, res, function () {
                    var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(err) {
                      var productsWorkbook, sheetNames, uploadedProducts;
                      return regeneratorRuntime.wrap(function _callee9$(_context9) {
                        while (1) {
                          switch (_context9.prev = _context9.next) {
                            case 0:
                              if (!err) {
                                _context9.next = 2;
                                break;
                              }

                              return _context9.abrupt("return", res.status(400).json({ msg: "Error while uploading file!!" }));

                            case 2:
                              // console.log(req.file);
                              productsWorkbook = _xlsx2.default.readFile(req.file.path);
                              sheetNames = productsWorkbook.SheetNames;
                              uploadedProducts = _xlsx2.default.utils.sheet_to_json(productsWorkbook.Sheets[sheetNames[0]]);
                              // Store the data to database

                              _context9.next = 7;
                              return Product.bulkCreate(uploadedProducts);

                            case 7:
                              console.log("excel data saved");
                              res.status(201).json({ msg: "Data uploaded" });

                            case 9:
                            case "end":
                              return _context9.stop();
                          }
                        }
                      }, _callee9, _this);
                    }));

                    return function (_x19) {
                      return _ref10.apply(this, arguments);
                    };
                  }());
                } catch (err) {
                  console.error(err);
                  res.status(500).json({ msg: "Internal server error" });
                }

              case 1:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function addUploadedProducts(_x17, _x18) {
        return _ref9.apply(this, arguments);
      }

      return addUploadedProducts;
    }()
  }]);

  return ProductController;
}();

exports.default = ProductController;