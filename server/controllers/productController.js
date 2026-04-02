import asyncHandler from "../utils/asyncHandler.js";
import Product from "../models/productModel.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import mongoose from "mongoose";

// ----------------- GET ALL PRODUCTS -----------------
export const getAllProducts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const products = await Product.paginate(
    {},
    { page, limit, sort: { createdAt: -1 } },
  );

  if (!products.docs || products.docs.length === 0) {
    return next(new ErrorHandler("Products not found", 404));
  }

  res.status(200).json({
    success: true,
    products: products.docs,
    meta: {
      totalDocs: products.totalDocs,
      limit: products.limit,
      totalPages: products.totalPages,
      currentPage: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
    },
  });
});

// ----------------- GET PRODUCT BY ID -----------------
export const getProductById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) return next(new ErrorHandler("Please provide Product id", 400));
  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new ErrorHandler("Product id is Inavliad", 400));

  const product = await Product.findById(id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  res.status(200).json({
    success: true,
    product,
  });
});

// ----------------- GET PRODUCTS BY CATEGORY -----------------
export const getProductsForNavigationLinkPage = asyncHandler(
  async (req, res, next) => {
    const { category } = req.params;
    if (!category)
      return next(new ErrorHandler("Please provide category page", 400));

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const products = await Product.paginate(
      { category: category.toLowerCase() },
      { page, limit, sort: { createdAt: -1 } },
    );

    if (!products.docs || products.docs.length === 0) {
      return next(new ErrorHandler("No Products Found", 404));
    }

    res.status(200).json({
      success: true,
      products: products.docs,
      meta: {
        totalDocs: products.totalDocs,
        limit: products.limit,
        totalPages: products.totalPages,
        currentPage: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
      },
    });
  },
);

// ----------------- GET PRODUCTS BY TAG -----------------
export const getProductsByTag = asyncHandler(async (req, res, next) => {
  const { tag } = req.body;
  if (!tag || tag.trim() === "")
    return next(new ErrorHandler("Please Provide tag", 400));

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const products = await Product.paginate(
    { tags: tag.toLowerCase() },
    { page, limit, sort: { createdAt: -1 } },
  );

  if (!products.docs || products.docs.length === 0) {
    return next(new ErrorHandler("No Products Found", 404));
  }

  res.status(200).json({
    success: true,
    products: products.docs,
    meta: {
      totalDocs: products.totalDocs,
      limit: products.limit,
      totalPages: products.totalPages,
      currentPage: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
    },
  });
});

// ----------------- GET SEARCH PRODUCTS -----------------
export const getSearchProducts = asyncHandler(async (req, res, next) => {
  const {
    query,
    category,
    subCategory,
    brand,
    tags,
    minPrice,
    maxPrice,
    rating,
    page = 1,
    limit = 50,
  } = req.query;

  let filter = {};

  // Search by general query across multiple fields
  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { brand: { $regex: query, $options: "i" } },
      { tags: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } },
      { subCategory: { $regex: query, $options: "i" } },
    ];
  }

  // Filters
  if (category) filter.category = category.toLowerCase();
  if (subCategory) filter.subCategory = subCategory.toLowerCase();
  if (brand) filter.brand = { $in: brand.split(",").map((b) => b.toLowerCase()) };
  if (tags) filter.tags = { $in: tags.split(",").map((t) => t.toLowerCase()) };

  if (minPrice || maxPrice) {
    filter["variants.mrpPrice"] = {};
    if (minPrice) filter["variants.mrpPrice"].$gte = Number(minPrice);
    if (maxPrice) filter["variants.mrpPrice"].$lte = Number(maxPrice);
  }

  if (rating) filter.rating = { $gte: Number(rating) };

  const products = await Product.paginate(filter, {
    page: Number(page),
    limit: Number(limit),
    sort: { createdAt: -1 },
  });

  if (!products.docs || products.docs.length === 0) {
    return next(new ErrorHandler("No Products Found", 404));
  }

  res.status(200).json({
    success: true,
    products: products.docs,
    meta: {
      totalDocs: products.totalDocs,
      limit: products.limit,
      totalPages: products.totalPages,
      currentPage: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
    },
  });
});

// ----------------- GET FILTER OPTIONS -----------------
export const getFilterOptions = asyncHandler(async (req, res, next) => {
  const brands = await Product.distinct("brand");
  const categories = await Product.distinct("category");
  const subCategories = await Product.distinct("subCategory");
  const tags = await Product.distinct("tags");

  res.json({
    success: true,
    brands,
    categories,
    subCategories,
    tags,
  });
});