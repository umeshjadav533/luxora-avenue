import asyncHandler from "../utils/asyncHandler.js";
import Cart from "../models/cartModel.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import mongoose from "mongoose";
import Product from "../models/productModel.js";
import { getSellingPrice } from "../utils/priceUtils.js";
import formatProductResponse from "../utils/formatProductResponse.js";

// ----------------- GET ALL CART PRODUCTS -----------------
export const getAllCartProducts = asyncHandler(async (req, res, next) => {
  const userCart = await Cart.findOne({ user: req.user._id }).populate({
    path: "items.product",
    select: "title description category subCategory brand rating tags variants",
  });

  if (!userCart) {
    return next(new ErrorHandler("Cart not found", 404));
  }

  res.status(200).json({
    success: true,
    cartProducts: formatProductResponse(userCart.items || []),
  });
});

// ----------------- ADD TO CART PRODUCT -----------------
export const addToCart = asyncHandler(async (req, res, next) => {
  const { id, size, color, quantity } = req.body;

  const qty = Number(quantity);

  // Validate
  if (!id || !qty) {
    return next(new ErrorHandler("Product id and quantity required", 400));
  }

  if (qty <= 0) {
    return next(new ErrorHandler("Quantity must be greater than 0", 400));
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid product id", 400));
  }

  // Find product
  const product = await Product.findById(id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  //  Find or Create cart
  let userCart = await Cart.findOne({ user: req.user._id });
  if (!userCart) {
    userCart = await Cart.create({
      user: req.user._id,
      items: [],
    });
  }

  // Find variant
  let selectedVariant = null;
  if (color) {
    selectedVariant = product?.variants?.find(
      (v) => v?.color?.toLowerCase() === color?.toLowerCase(),
    );

    if (!selectedVariant) {
      return next(new ErrorHandler("Color not available", 400));
    }
  }

  // Find size
  let selectedSize = null;
  if (size && selectedVariant) {
    selectedSize = selectedVariant?.sizes?.find(
      (s) => s?.size?.toLowerCase() === size?.toLowerCase(),
    );

    if (!selectedSize) {
      return next(new ErrorHandler("Size not available", 400));
    }
  }

  // Check stock available
  let availableStock = selectedSize
    ? selectedSize?.stock
    : selectedVariant?.stock;

  if (availableStock <= 0) {
    return next(new ErrorHandler("Out of stock", 400));
  }

  // Find existing product safely
  const existingProduct = userCart.items.find(
    (item) =>
      item.product.toString() === id &&
      (!size || item?.size?.toLowerCase() === size?.toLowerCase()) &&
      (!color || item?.color?.toLowerCase() === color?.toLowerCase()),
  );

  // Add or update
  if (existingProduct) {
    if (existingProduct.quantity + qty > availableStock) {
      return next(new ErrorHandler("No more stock available", 400));
    }

    existingProduct.quantity += qty;
  } else {
    if (qty > availableStock) {
      return next(new ErrorHandler("No more stock available", 400));
    }

    userCart.items.push({
      product: product._id,
      size: selectedSize?.size || null,
      color: selectedVariant?.color || null,
      quantity: qty,
    });
  }

  await userCart.save();

  const populatedCart = await Cart.findById(userCart._id).populate({
    path: "items.product",
    select: "title description category subCategory brand rating tags variants",
  });

  // send response
  res.status(200).json({
    success: true,
    message: "Product added to cart",
    cartProducts: formatProductResponse(populatedCart.items || []),
  });
});

// ----------------- UPDATE CART PRODUCT -----------------
export const updateCartProduct = asyncHandler(async (req, res, next) => {
  const { id, size, color, quantity, type } = req.body;

  const qty = Number(quantity);

  if (!id || !qty) {
    return next(
      new ErrorHandler("Please provide product id and quantity", 400),
    );
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid product id", 400));
  }

  if (!["increment", "decrement"].includes(type?.toLowerCase())) {
    return next(new ErrorHandler("Invalid update type", 400));
  }

  const product = await Product.findById(id);
  if (!product) {
    return next(new ErrorHandler("Product not available", 404));
  }

  const userCart = await Cart.findOne({ user: req.user._id });

  if (!userCart) {
    return next(new ErrorHandler("Cart not found", 404));
  }

  const existingProduct = userCart.items.find(
    (item) =>
      item?.product?.toString() === id &&
      (!color || item?.color?.toLowerCase() === color?.toLowerCase()) &&
      (!size || item?.size?.toLowerCase() === size?.toLowerCase()),
  );

  if (!existingProduct) {
    return next(new ErrorHandler("Product not found in cart", 404));
  }

  // Find variant & stock
  let selectedVariant = color
    ? product?.variants?.find(
        (v) => v?.color?.toLowerCase() === color?.toLowerCase(),
      )
    : null;

  let selectedSize =
    size && selectedVariant
      ? selectedVariant?.sizes?.find(
          (s) => s?.size?.toLowerCase() === size?.toLowerCase(),
        )
      : null;

  let availableStock = selectedSize
    ? selectedSize?.stock
    : selectedVariant?.stock || product?.stock;

  // Increment quantity
  if (type.toLowerCase() === "increment") {
    if (existingProduct.quantity + qty > availableStock) {
      return next(new ErrorHandler("Stock limit exceeded", 400));
    }
    existingProduct.quantity += qty;
  } else {
    // If quantity is 1 → remove directly
    if (existingProduct.quantity === 1) {
      userCart.items = userCart.items.filter(
        (item) =>
          !(
            item.product.toString() === id &&
            (!color || item.color?.toLowerCase() === color?.toLowerCase()) &&
            (!size || item.size?.toLowerCase() === size?.toLowerCase())
          ),
      );
    } else {
      // otherwise just decrement
      existingProduct.quantity -= qty;
    }
  }

  await userCart.save();

  const populatedCart = await Cart.findById(userCart._id).populate({
    path: "items.product",
    select: "title description category subCategory brand rating tags variants",
  });

  res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    cart: formatProductResponse(populatedCart.items || []),
  });
});

// ----------------- REMOVE CART PRODUCT -----------------
export const removeCartProduct = asyncHandler(async (req, res, next) => {
  const { id, color, size } = req.body;

  if (!id) {
    return next(new ErrorHandler("Please provide product id", 400));
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Product id is invalid", 400));
  }

  // Get user cart
  const userCart = await Cart.findOne({ user: req.user._id });

  if (!userCart) {
    return next(new ErrorHandler("Cart not found", 404));
  }

  // Check product exists in cart
  const existingProduct = userCart.items.find(
    (item) =>
      item?.product?.toString() === id &&
      (!color || item?.color?.toLowerCase() === color?.toLowerCase()) &&
      (!size || item?.size?.toLowerCase() === size?.toLowerCase()),
  );

  if (!existingProduct) {
    return next(new ErrorHandler("Product not found in cart", 404));
  }

  // Remove product from cart
  userCart.items = userCart.items.filter(
    (item) =>
      !(
        item.product.toString() === id &&
        (!color || item.color?.toLowerCase() === color?.toLowerCase()) &&
        (!size || item.size?.toLowerCase() === size?.toLowerCase())
      ),
  );

  await userCart.save();

  const populatedCart = await Cart.findById(userCart._id).populate({
    path: "items.product",
    select: "title description category subCategory brand rating tags variants",
  });

  res.status(200).json({
    success: true,
    message: "Product removed from cart",
    cart: formatProductResponse(populatedCart.items || []),
  });
});

// ----------------- GET CART SUMMRY -----------------
export const getCartSummary = asyncHandler(async (req, res, next) => {
  const userCart = await Cart.findOne({ user: req.user._id }).populate({
    path: "items.product",
    select: "title category brand variants",
  });

  if (!userCart) {
    return next(new ErrorHandler("Cart not found", 404));
  }

  let subTotal = 0;
  let totalItems = 0;
  let discount = 0;

  userCart.items.forEach((item) => {
    const product = item.product;
    if (!product) return;

    // Find variant (color)
    const variant = product.variants?.find(
      (v) => v.color?.toLowerCase() === item.color?.toLowerCase()
    );

    if (!variant) return;

    // Find size (optional)
    let sizeObj = null;
    if (item.size && variant.sizes?.length) {
      sizeObj = variant.sizes.find(
        (s) => s.size?.toLowerCase() === item.size?.toLowerCase()
      );
    }

    // Stock check (optional but industry level)
    let availableStock = sizeObj?.stock ?? variant.stock;
    if (item.quantity > availableStock) {
      item.quantity = availableStock; // auto-fix (optional)
    }

    const mrp = variant.mrpPrice || 0;
    const discountPercent = variant.discountPercentage || 0;

    // Calculate selling price
    const price = getSellingPrice(mrp, discountPercent);

    const qty = item.quantity;

    // Totals
    subTotal += price * qty;
    totalItems += qty;

    // Discount amount
    discount += ((mrp - price) * qty);
  });

  // Shipping
  const shipping = subTotal > 0 && subTotal < 499 ? 40 : 0;

  // GST
  const taxRate = 0.18;
  const tax = Number((subTotal * taxRate).toFixed(2));

  // Final Total
  const total = Number((subTotal + tax + shipping).toFixed(2));

  res.status(200).json({
    success: true,
    summary: {
      totalProducts: totalItems,
      subTotal: Number(subTotal.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      tax,
      shipping,
      total,
    },
  });
});
