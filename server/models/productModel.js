import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
      lowercase: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["men", "women", "kids", "unisex"],
      default: "unisex",
      index: true,
    },

    subCategory: {
      type: String,
      required: true,
      enum: ["clothing", "perfume", "shoes", "watch", "accessories"],
      index: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
      index: true,
      lowercase: true
    },

    sku: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      index: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    variants: [
      {
        color: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
        },

        images: [
          {
            type: String,
            required: true,
          },
        ],

        stock: {
          type: Number,
          default: 0,
          min: 0,
        },

        sizes: [
          {
            size: {
              type: String,
              lowercase: true,
              trim: true,
            },
            stock: {
              type: Number,
              default: 0,
              min: 0,
            },
          },
        ],

        mrpPrice: {
          type: Number,
          required: true,
          min: 0,
        },

        discountPercentage: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
    ],

    tags: {
      type: [String],
      default: [],
      lowercase: true,
    },

    onSale: {
      type: Boolean,
      default: false,
    },

    warrantyMonths: {
      type: Number,
      default: 0,
      min: 0,
    },

    returnDays: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

productSchema.plugin(mongoosePaginate);
const Product = mongoose.model("Product", productSchema);

export default Product;