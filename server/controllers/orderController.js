import asyncHandler from "../utils/asyncHandler.js";
import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import formatProductResponse from "../utils/formatProductResponse.js";

// ----------------- CREATE ORDER -----------------
export const createOrder = asyncHandler(async (req, res) => {
  const { shippingDetail, paymentMethod } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
  );

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  // Use your existing formatter
  const formattedItems = formatProductResponse(cart.items);

  // Price calculation
  const itemsPrice = formattedItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const shippingPrice = itemsPrice > 500 ? 0 : 50;
  const totalPrice = itemsPrice + shippingPrice;

  // Order items
  const orderItems = formattedItems.map((item) => ({
    title: item.title,
    quantity: item.quantity,
    images: item.images[0],
    price: item.price,
    size: item.size,
    color: item.color,
    productId: item._id,
  }));

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingDetail,
    paymentInfo: {
      method: paymentMethod,
      status: "pending",
    },
    itemsPrice,
    shippingPrice,
    totalPrice,
  });

  // Clear Cart
  cart.items = [];
  await cart.save();

  res.status(201).json({
    success: true,
    order,
  });
});

// ----------------- GET MY ORDERS -----------------
export const getOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json({
    success: true,
    orders,
  });
});

// ----------------- GET SINGLE ORDER -----------------
export const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (!order) {
    return next(new ErrorHandler(404, "Order not found"));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// ----------------- CANCEL ORDER -----------------
export const cancelOrder = asyncHandler(async (req, res, next) => {
  console.log("Cancel API hit", req.params.id);

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  if (order.isDelivered) {
    return res.status(400).json({
      message: "Delivered order cannot be cancelled",
    });
  }

  if (order.isCancelled) {
    return res.status(400).json({
      message: "Order already cancelled",
    });
  }

  order.isCancelled = true;
  order.cancelledAt = new Date();

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
  });
});
