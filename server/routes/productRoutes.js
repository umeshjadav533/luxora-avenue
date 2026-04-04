import express from "express";
import isAuthenticated from "../middlewares/authMiddleware.js";
import {
  getAllProducts,
  getFilterOptions,
  getProductById,
  getProductsByTag,
  getRelatedProducts,
  getSearchProducts,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/", isAuthenticated, getAllProducts);
productRouter.post("/related-products", isAuthenticated, getRelatedProducts);
productRouter.post("/tag", isAuthenticated, getProductsByTag);
productRouter.get("/filter/search", isAuthenticated, getSearchProducts);
productRouter.get("/filter/product-filter", isAuthenticated, getFilterOptions);
productRouter.get("/:id", isAuthenticated, getProductById);

export default productRouter;
