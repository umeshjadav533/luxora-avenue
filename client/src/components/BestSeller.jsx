import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchTagProducts } from "../features/product/productAPI";
import { Handbag, Heart } from "lucide-react";
import LikedButton from "./LikedButton";
import { Link } from "react-router-dom";
import { toggleWishlistProduct } from "../features/wishlist/wishlistAPI";
import Rating from "./Rating";

const BestSeller = () => {
  const { tagProductsData } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTagProducts({ tag: "best-seller", page: 1, limit: 10 }));
  }, [dispatch]);

  if (tagProductsData?.products.length === 0) return null;

  return (
    <div className="">
      <h3 className="text-2xl underline underline-offset-5 cursor-pointer my-5">
        Best Seller
      </h3>
      <div className="grid grid-cols-5 gap-3">
        {tagProductsData?.products &&
          tagProductsData?.products.map((product) => (
            <div key={product._id} className="bg-white p-2 rounded-2xl">
              <div className="w-full h-70 relative overflow-hidden">
                <Link to={`product/${product._id}`}>
                  <img
                    src={product.variants?.[0].images?.[0]}
                    className="w-full h-full object-contain hover:scale-110 transition duration-200"
                  />
                </Link>
                <div className="absolute top-3 right-3">
                  <LikedButton
                    id={product._id}
                    color={product?.variants[0]?.color}
                    size={product?.variants[0]?.sizes[0]?.size}
                  />
                </div>
              </div>

              <div className="">
                <h4 className="truncate-title">{product?.title}</h4>
                <div className="flex justify-between">
                  <Rating rating={product?.rating} starSize={15} />
                  <button className="border-2 px-2 py-1 rounded-md border-black cursor-pointer hover:bg-black hover:text-white transition duration-200">
                    <Handbag size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BestSeller;
