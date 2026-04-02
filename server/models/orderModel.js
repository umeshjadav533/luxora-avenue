import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  orderItems: [
    {
      title: { type: String, required: true },
      quantity: { type: Number, required: true },
      images: { type: String, required: true },
      price: { type: Number, required: true },
      size: { type: String, default: null },
      color: { type: String, default: null },
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      },
    },
  ],
  shippingDetail: {
    first_name: {
      type: String,
      required: [true, "First name is Required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
      lowercase: true,
    },
    last_name: {
      type: String,
      required: [true, "Last name is Required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
      lowercase: true,
    },
    phone_number: {
      type: String,
      required: [true, "Phone number is Required"],
      trim: true,
      match: [/^[0-9]{10}$/, "Enter valid phone number"],
    },
    address: {
      street: { type: String, trim: true, lowercase: true },
      city: { type: String, trim: true, lowercase: true },
      state: { type: String, trim: true, lowercase: true },
      country: { type: String, trim: true, lowercase: true },
      pincode: { type: String, trim: true },
    },
  },
  paymentInfo: {
    method: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
    },
    paidAt: {
      type: Date,
    },
  },

  itemsPrice: {
    type: Number,
    required: true,
    default: 0,
  },

  shippingPrice: {
    type: Number,
    required: true,
    default: 0,
  },

  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },

  isPaid: {
    type: Boolean,
    default: false,
  },

  isDelivered: {
    type: Boolean,
    default: false,
  },

  isCancelled: {
    type: Boolean,
    default: false,
  },

  cancelledAt: Date,
});

const Order = mongoose.model("Order", orderSchema);
export default Order;