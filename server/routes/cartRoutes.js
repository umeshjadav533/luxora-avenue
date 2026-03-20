import express from 'express'
import isAuthenticated from '../middlewares/authMiddleware.js';
import { getAllCartProducts, addToCart, updateCartProduct, removeCartProduct, getCartSummary } from '../controllers/cartController.js'

const cartRouter = express.Router();

cartRouter.get("/", isAuthenticated, getAllCartProducts);
cartRouter.post("/add", isAuthenticated, addToCart);
cartRouter.put("/update", isAuthenticated, updateCartProduct);
cartRouter.delete("/remove", isAuthenticated, removeCartProduct);
cartRouter.get("/cart-summary", isAuthenticated, getCartSummary);

export default cartRouter;