import express from 'express'
import { getWishlistProducts, toggleWishlistProduct } from '../controllers/wishlistController.js';
import isAuthenticated from '../middlewares/authMiddleware.js';

const wishlistRouter = express.Router();

wishlistRouter.get("/", isAuthenticated, getWishlistProducts);
wishlistRouter.post("/toggle-wishlist", isAuthenticated, toggleWishlistProduct);

export default wishlistRouter;