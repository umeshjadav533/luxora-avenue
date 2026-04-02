import { Link } from "react-router-dom";
import LikedButton from "./LikedButton";
import calculateSellingPrice from "../utils/priceUtil";
import { toggleWishlistProduct } from "../features/wishlist/wishlistAPI";
import { Trash } from "lucide-react";

const WishlistProductCard = ({product}) => {
  return (
    <div
      key={product._id}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 grid grid-cols-3 overflow-hidden"
    >
      {/* Product Image */}
      <div className="relative bg-gray-50 flex items-center justify-center p-3">
        <div className="h-40 w-full">
          <Link to={`/product/${product._id}`}>
            <img
              src={product.images[0]}
              className="w-full h-full object-contain"
            />
          </Link>

          <div className="absolute top-3 right-3">
            <LikedButton
              id={product._id}
              size={product?.size || null}
              color={product?.color || null}
            />
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="col-span-2 flex flex-col justify-between relative p-5">
        <div className="flex flex-col gap-3 pr-10">
          <p className="text-sm font-semibold text-gray-800 line-clamp-2">
            {product.title}
          </p>

          {product?.size && (
            <span className="text-sm text-gray-500">Size: {product.size}</span>
          )}

          {product?.color && (
            <span className="text-sm text-gray-500">
              Color: {product.color.toLowerCase()}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1 mt-2">
            <span className="text-lg font-bold text-black outfit-font">
              ${calculateSellingPrice(product?.mrpPrice, product?.discount)}
            </span>
            <span className="text-md line-through font-bold text-slate-400 outfit-font">
              ${product.mrpPrice}
            </span>
          </div>

          <span className="text-green-600 text-sm font-semibold">
            {product?.discount}% OFF
          </span>
        </div>

        {/* Remove Button */}
        <div
          className="text-gray-700 hover:text-black absolute top-5 right-5 cursor-pointer"
          onClick={() => {
            dispatch(
              toggleWishlistProduct({
                id: product._id,
                size: product?.size || null,
                color: product?.color || null,
              }),
            );
          }}
        >
          <Trash size={20} />
        </div>
      </div>
    </div>
  );
};

export default WishlistProductCard;
