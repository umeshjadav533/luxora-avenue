import asyncHandler from "../utils/asyncHandler.js";
import Product from "../models/productModel.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import mongoose from "mongoose";
import Wishlist from "../models/wishlistModel.js";
import formatProductResponse from '../utils/formatProductResponse.js'

// ----------------- GET ALL WISHLIST PRODUCTS -----------------
export const getWishlistProducts = asyncHandler(async (req, res, next) => {
  const userWishlist = await Wishlist.findOne({ user: req.user._id }).populate({
    path: "items.product",
    select: "title description category subCategory brand rating tags variants",
  });

  if (!userWishlist) {
    return res.status(404).json({
      success: false,
      message: "Wishlist not found",
    });
  }

  const wishlist = userWishlist.items.map((item) => {
    // find selected variant
    const selectedVariant = item?.product?.variants?.find(
      (v) =>
        v?.color?.toLowerCase() === item?.color?.toLowerCase()
    );

    // Select Size
    let selectedSize = null;
    if(selectedVariant || item.size){
      selectedSize = selectedVariant?.sizes?.find(
        s => s?.size?.toLowerCase() === item?.size?.toLowerCase()
      )
    }
    return {
      _id: item.product?._id,
      title: item.product?.title,
      description: item.product?.description,
      category: item.product?.category,
      subCategory: item.product?.subCategory,
      brand: item.product?.brand,
      rating: item.product?.rating,
      tags: item.product?.tags,
      color: selectedVariant?.color,
      images: selectedVariant?.images,
      size: selectedSize ? selectedSize?.size : null,
      stock: selectedSize ? selectedSize?.stock : selectedVariant.stock,
      mrpPrice: selectedVariant?.mrpPrice,
      discount: selectedVariant?.discountPercentage
    };
  });

  
  res.status(200).json({
    success: true,
    products: wishlist,
  });
});

// ----------------- TOGGLE WISHLIST PRODUCTS -----------------
export const toggleWishlistProduct = asyncHandler(async (req, res, next) => {
  // Destructure fields
  const { id, size, color } = req.body;

  // Check id is available
  if (!id) return next(new ErrorHandler("Please Provide id", 400));

  // Check id is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Product id is Invalid", 400));
  }

  // Find product
  const product = await Product.findById(id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  // find or create wishlist
  let userWishlist = await Wishlist.findOne({ user: req.user._id });
  if (!userWishlist) {
    userWishlist = await Wishlist.create({
      user: req.user._id,
      items: [],
    });
  }

  // find item
  const existingProduct = userWishlist.items.find(
    (item) =>
      item.product.toString() === id &&
      (!size || item?.size?.toLowerCase() === size?.toLowerCase()) &&
      (!color || item?.color?.toLowerCase() === color?.toLowerCase()),
  );

  if (existingProduct) {
    // REMOVE
    userWishlist.items = userWishlist.items.filter(
      (item) =>
        !(
          item.product.toString() === id &&
          (!size || item?.size?.toLowerCase() === size?.toLowerCase()) &&
          (!color || item?.color?.toLowerCase() === color?.toLowerCase())
        ),
    );
  } else {
    // ADD
    userWishlist.items.push({
      product: id,
      size: size || null,
      color: color || null,
    });
  }

  await userWishlist.save();

  const populatedWishlist = await Wishlist.findById(userWishlist._id).populate({
    path: "items.product",
    select: "title description category subCategory brand rating tags variants",
  });

  res.status(200).json({
    success: true,
    products: formatProductResponse(populatedWishlist.items || [], false),
    message: existingProduct ? "Removed from wishlist" : "Added to wishlist",
  });
});
