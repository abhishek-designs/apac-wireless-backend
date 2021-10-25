"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _productController = require("../controllers/productController");

var _productController2 = _interopRequireDefault(_productController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import authenticate from '../../middlewares/authenticate';

var productRouter = (0, _express.Router)();

productRouter.get("/", _productController2.default.getAllProducts);
productRouter.get("/incategory", _productController2.default.getProductsInCategory);
productRouter.get("/inDepartment", _productController2.default.getProductsInDepartment);
productRouter.get("/incategory/:categoryId", _productController2.default.getProductsInCategory);
productRouter.get("/inDepartment/:departmentId", _productController2.default.getProductsInDepartment);
productRouter.get("/search", _productController2.default.searchProducts);
productRouter.get("/:product_id", _productController2.default.getSingleProduct);
productRouter.post('/', _productController2.default.addProduct);
exports.default = productRouter;