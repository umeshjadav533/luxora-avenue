import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlistProducts,
  toggleWishlistProduct,
} from "../features/wishlist/wishlistAPI";
import { Link } from "react-router-dom";
import LikedButton from "../components/LikedButton";
import { Trash } from "lucide-react";
import calculateSellingPrice from "../utils/priceUtil.js";
import WishlistProductCard from "../components/WishlistProductCard.jsx";

export default function WishlistPage() {
  const { wishlistProductsData } = useSelector((state) => state.wishlist);
  console.log(wishlistProductsData?.products[0]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchWishlistProducts());
  }, [dispatch]);

  return (
    <div className="p-10">
      {/* Empty Wishlist */}
      {wishlistProductsData?.products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-6 h-screen">
          <h2 className="text-2xl font-semibold text-gray-700">
            Your wishlist is empty
          </h2>

          <p className="text-gray-500 text-center max-w-sm">
            Looks like you haven't added anything to your wishlist yet. Start
            exploring products you love.
          </p>

          <Link
            to="/"
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          {/* Heading */}
          <div className="pt-30 py-20">
            <h1 className="text-center text-4xl font-bold tracking-wide">
              Your Wishlist ❤️
            </h1>
            <p className="text-center text-gray-500 mt-2">
              Products you loved the most
            </p>
          </div>

          {/* wishlist products */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wishlistProductsData?.products.map((product) => (
              <WishlistProductCard product={product} key={product._id} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
