import express from 'express'
import { getWishlistProducts } from '../controllers/wishlistController.js';
import isAuthenticated from '../middlewares/authMiddleware.js';

const wishlistRouter = express.Router();

wishlistRouter.get("/", isAuthenticated, getWishlistProducts);

export default wishlistRouter;