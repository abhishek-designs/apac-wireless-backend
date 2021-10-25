import { Router } from "express";
import productController from "../controllers/productController";
// import authenticate from '../../middlewares/authenticate';

const productRouter = Router();

productRouter.get("/", productController.getAllProducts);
productRouter.get("/incategory", productController.getProductsInCategory);
productRouter.get("/inDepartment", productController.getProductsInDepartment);
productRouter.get(
  "/incategory/:categoryId",
  productController.getProductsInCategory
);
productRouter.get(
  "/inDepartment/:departmentId",
  productController.getProductsInDepartment
);
productRouter.get("/search", productController.searchProducts);
productRouter.get("/related_products", productController.getRelatedProducts);
productRouter.get("/:product_id", productController.getSingleProduct);
productRouter.post("/", productController.addProduct);
productRouter.post("/features", productController.addProductFeatures);
productRouter.post("/upload", productController.addUploadedProducts);
export default productRouter;
