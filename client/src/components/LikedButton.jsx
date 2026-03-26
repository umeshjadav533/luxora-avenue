import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlistProducts,
  toggleWishlistProduct,
} from "../features/wishlist/wishlistAPI";
import { Heart } from "lucide-react";
import { useEffect } from "react";

const LikedButton = ({ id, size, color }) => {
  const { wishlistProductsData } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchWishlistProducts());
  }, [dispatch]);

  console.log(wishlistProductsData?.products);

  const existingWishlistProduct = wishlistProductsData?.products.find(
    (product) =>
      product?._id.toString() === id &&
      product?.size?.toLowerCase() === size?.toLowerCase() &&
      product?.color?.toLowerCase() === color?.toLowerCase(),
  );

  const isWishlistedProduct = !!existingWishlistProduct;

  return (
    <button
      className="cursor-pointer"
      onClick={() => dispatch(toggleWishlistProduct({ id, size, color }))}
    >
      <Heart
        className={`transition ${
          isWishlistedProduct ? "fill-black text-black" : "text-black"
        }`}
      />
    </button>
  );
};

export default LikedButton;
