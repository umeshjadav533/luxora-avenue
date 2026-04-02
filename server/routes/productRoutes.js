import express from "express";
import isAuthenticated from "../middlewares/authMiddleware.js";
import {
  getAllProducts,
  getFilterOptions,
  getProductById,
  getProductsByTag,
  getProductsForNavigationLinkPage,
  getSearchProducts,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/", isAuthenticated, getAllProducts);
productRouter.get("/:id", isAuthenticated, getProductById);
productRouter.get(
  "/page/:category",
  isAuthenticated,
  getProductsForNavigationLinkPage,
);
productRouter.post("/tag", isAuthenticated, getProductsByTag);
productRouter.get("/filter/search", isAuthenticated, getSearchProducts);
productRouter.get("/filter/product-filter", isAuthenticated, getFilterOptions);

export default productRouter;
