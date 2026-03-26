import { Link } from "react-router-dom";
import LikedButton from "./LikedButton";
import Rating from "./Rating";
import calculateSellingPrice from "../utils/priceUtil";

const ProductCard = ({ product }) => {
  console.log(product?.variants?.[0]?.mrpPrice);
  return (
    <div className="bg-white rounded-xl overflow-hidden ">
      <div className="h-100 relative overflow-hidden">
        <Link to={`/product/${product._id}`}>
          <img
            src={product?.variants?.[0]?.images?.[0]}
            className="w-full h-full hover:scale-110 transition duration-200 object-cover"
          />
        </Link>
        {product.tags.includes("best-seller") ? (
          <span
            className="absolute top-3 left-3 bg-[#ECE9E2] px-3 py-1 rounded-full text-sm"
            style={{ fontWeight: 700 }}
          >
            BEST SELLER
          </span>
        ) : null}
        <div className="absolute top-5 right-5">
          <LikedButton
            id={product._id}
            color={product?.variants[0]?.color}
            size={product?.variants[0]?.sizes[0]?.size}
          />
        </div>
      </div>
      {/*  Prodct Information */}
      <div className="w-full h-20 overflow-hidden flex flex-col justify-end gap-1 p-2">
        <p className="truncate-title text-gray-900">{product.title}</p>
        <div className="flex justify-between">
          <div>
            <Rating rating={product.rating} starSize={17} />
          </div>
          <div className="flex gap-2">
            <span className="text-xl">
              $
              {calculateSellingPrice(
                product?.variants[0]?.mrpPrice,
                product?.variants[0]?.discountPercentage,
              )}
            </span>
            <span className="text-xl line-through text-red-600">
              ${product?.variants[0]?.mrpPrice}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
