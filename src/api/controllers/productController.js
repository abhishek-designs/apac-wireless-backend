/* eslint no-restricted-globals: ["error", "event", "fdescribe"] */

import "dotenv/config";
import { DatabaseError, Op } from "sequelize";
import multer from "multer";
import redis from "async-redis";
import helpers from "../../helpers/util";
import db from "../../models";
import fs from "fs";
import ExcelJS from "exceljs";
import XLSX from "xlsx";

const redisClient = redis.createClient(process.env.REDIS_URL);

const { Product, Features } = db;

const { errorResponse, truncateDescription } = helpers;

/**
 *
 *
 * @export
 * @class ProductController
 * @description Operations on Products
 */
export default class ProductController {
  /**
   * @description -This method returns all products
   * @param {object} req - The request payload
   * @param {object} res - The response payload sent back from the method
   * @returns {object} - number of total products
   */
  static async getAllProducts(req, res) {
    try {
      const { description_length: descriptionLength, limit, page } = req.query;
      const productsQuery = {
        include: "feature",
        limit: parseInt(limit || 5),
        offset: parseInt(limit || 5) * (parseInt(page) - 1) || 0,
      };
      let products;
      const redisProducts = await redisClient.get("cacheKey");
      console.log(redisProducts);
      if (redisProducts) {
        products = JSON.parse(redisProducts);
        return res
          .status(200)
          .json({ count: products.count, rows: products.rows });
      }
      products = await Product.findAll(productsQuery);

      if (descriptionLength) {
        products = truncateDescription(products, descriptionLength);
      }
      const totalProducts = await Product.count();
      await redisClient.set(
        "cacheKey",
        JSON.stringify({ count: totalProducts, rows: products }),
        "EX",
        10
      );
      return res.status(200).json({ count: totalProducts, rows: products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * @description -This method views a single product
   * @param {object} req - The request payload
   * @param {object} res - The response payload sent back from the method
   * @returns {object} - product
   */
  static async getSingleProduct(req, res) {
    try {
      const { product_id: productId } = req.params;
      if (isNaN(productId))
        return errorResponse(
          res,
          400,
          "USR_01",
          "Product id must be a number",
          "product id"
        );

      const product = await Product.findOne({
        where: { product_id: productId },
      });
      if (product) return res.status(200).json(product);
      return errorResponse(res, 404, "PRO_01", "Product Not found", "product");
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * @description -This method search products
   * @param {object} req - The request payload
   * @param {object} res - The response payload sent back from the controller
   * @returns {object} - products
   */
  static async searchProducts(req, res) {
    try {
      const {
        page,
        limit,
        description_length: descriptionLength,
        query_string: queryString,
        all_words: allWords,
      } = req.query;
      if (!queryString) {
        errorResponse(
          res,
          400,
          "USR_01",
          "Query string is required",
          "query_string"
        );
      }
      let query;
      if (allWords === "on") {
        query = {
          where: {
            [Op.or]: [
              {
                name: { [Op.like]: `${queryString}` },
              },
              {
                description: { [Op.like]: `${queryString}` },
              },
            ],
          },
        };
      } else {
        query = {
          where: {
            [Op.or]: [
              {
                name: { [Op.like]: `%${queryString}%` },
              },
              {
                description: { [Op.like]: `%${queryString}%` },
              },
            ],
          },
        };
      }
      query.limit = parseInt(limit) || 20;
      query.offset = parseInt(limit || 20) * (parseInt(page) - 1) || 0;
      let products = await Product.findAll(query);
      if (descriptionLength) {
        products = truncateDescription(products, descriptionLength);
      }
      const count = products.length;
      return res.status(200).json({ count, rows: products });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * @description -This method gets products in a category
   * @param {object} req - The request payload sent from the router
   * @param {object} res - The response payload sent back from the controller
   * @returns {object} - products in category
   */
  static async getProductsInCategory(req, res) {
    try {
      const { categoryId } = req.params;
      if (!categoryId) {
        errorResponse(
          res,
          400,
          "USR_01",
          "Category Id is required",
          "category id"
        );
      }
      if (isNaN(categoryId))
        return errorResponse(
          res,
          400,
          "USR_01",
          "Category id must be a number",
          "category id"
        );
      const {
        page,
        limit = 20,
        description_length: descriptionLength = 200,
      } = req.query;
      let startIndex = 0;
      if (page) startIndex = (page - 1) * limit;

      const query =
        "CALL catalog_get_products_in_category(:categoryId,:descriptionLength,:limit,:startIndex)";
      const products = await db.sequelize.query(query, {
        replacements: {
          categoryId,
          descriptionLength,
          limit,
          startIndex,
        },
      });
      const count = products.length;
      return res.status(200).json({ count, rows: products });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * @description -This method gets products in a department
   * @param {object} req - The request payload sent from the router
   * @param {object} res - The response payload sent back from the controller
   * @returns {object} - products in department
   */
  static async getProductsInDepartment(req, res) {
    try {
      const { departmentId } = req.params;
      if (!departmentId) {
        errorResponse(
          res,
          400,
          "USR_01",
          "Category Id is required",
          "category id"
        );
      }
      if (isNaN(departmentId))
        return errorResponse(
          res,
          400,
          "USR_01",
          "department id must be a number",
          "department id"
        );
      const {
        page,
        limit = 20,
        description_length: descriptionLength = 200,
      } = req.query;
      let startIndex = 0;
      if (page) startIndex = (page - 1) * limit;

      const query =
        "CALL catalog_get_products_on_department(:departmentId,:descriptionLength,:limit,:startIndex)";
      const products = await db.sequelize.query(query, {
        replacements: {
          departmentId,
          descriptionLength,
          limit,
          startIndex,
        },
      });
      const count = products.length;
      return res.status(200).json({ count, rows: products });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * @description -Add a product (Admin only)
   * @param {object} req - The request payload sent from the router
   * @param {object} res - The response payload sent back from the controller
   * @returns {object} - Message regarding the product added
   */
  static async addProduct(req, res) {
    try {
      // Get the product data from the request
      const product = req.body;

      if (!product)
        return res.status(400).json({ msg: "Please give some products" });
      // await Product.sync();
      const addedProduct = await Product.create(product);
      console.log(addedProduct);
      // if(!addedProduct) throw new DatabaseError
      // console.log(addedProduct.product_id)
      res.status(200).json({ msg: "Product saved!!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * @description -Add product features (Admin only)
   * @param {object} req - The request payload sent from the router
   * @param {object} res - The response payload sent back from the controller
   * @returns {object} - Message regarding the product added
   */
  static async addProductFeatures(req, res) {
    try {
      // Get the product data from the request
      await Features.create(req.body);
      res.status(200).json({ msg: "Features saved!!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * @description -Get related products (Admin only)
   * @param {object} req - The request payload sent from the router
   * @param {object} res - The response payload sent back from the controller
   * @returns {object} - Message regarding the product added
   */
  static async getRelatedProducts(req, res) {
    try {
      const productBrand = req.query.brand;
      const productQuery = {
        where: { brand_name: productBrand },
        attributes: [
          "product_id",
          "name",
          "image",
          "price",
          "discounted_price",
          "brand_name",
        ],
      };

      const relatedProducts = await Product.findAll(productQuery);
      res.status(200).json(relatedProducts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal server error" });
    }
  }

  /**
   * @description -Upload products through excel sheet (Admin only)
   * @param {object} req - The request payload sent from the router
   * @param {object} res - The response payload sent back from the controller
   * @returns {object} - Message regarding the product added
   */
  static async addUploadedProducts(req, res) {
    try {
      const excelFilter = (req, file, callback) => {
        if (
          file.mimetype.includes(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ) ||
          file.mimetype.includes("application/vnd.ms-excel")
        ) {
          callback(null, true);
        } else {
          callback("Please upload only excel file", false);
        }
      };

      // Specifying the path for the uploaded file
      const storage = multer.diskStorage({
        destination: (req, file, callback) => {
          callback(null, "src/uploads");
        },
        filename: (req, file, callback) => {
          // callback(null, "products");
          callback(null, `${Date.now()}-${file.originalname}`);
        },
      });

      // ??Get the uploaded single file from the client through form data key 'file'
      const upload = multer({ storage, fileFilter: excelFilter }).single(
        "file"
      );

      // Upload the file to specified path
      upload(req, res, async (err) => {
        if (err)
          return res.status(400).json({ msg: "Error while uploading file!!" });
        // console.log(req.file);
        const productsWorkbook = XLSX.readFile(req.file.path);
        const sheetNames = productsWorkbook.SheetNames;
        const uploadedProducts = XLSX.utils.sheet_to_json(
          productsWorkbook.Sheets[sheetNames[0]]
        );
        // Store the data to database
        await Product.bulkCreate(uploadedProducts);
        console.log("excel data saved");
        res.status(201).json({ msg: "Data uploaded" });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
}
