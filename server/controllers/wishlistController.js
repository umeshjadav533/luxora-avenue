import asyncHandler from "../utils/asyncHandler.js";
import Product from "../models/productModel.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import mongoose from "mongoose";
import Wishlist from '../models/wishlistModel.js'

// ----------------- GET ALL WISHLIST PRODUCTS -----------------
export const getWishlistProducts = asyncHandler(async (req, res, next) => {
    const userWishlist = await  Wishlist.findById(req.user._id);
    console.log(userWishlist);


    res.status(200).json({
    success: true,
    // products: wishlist,
  });
});

export const toggleWishlistProduct = asyncHandler(async (req, res, next) => {});
