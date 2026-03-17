import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // ek user ki ek wishlist
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        size: {
          type: String,
          default: null,
        },
        variant: {
          type: String,
          default: null,
        },
      },
    ],
  },
  { timestamps: true },
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
