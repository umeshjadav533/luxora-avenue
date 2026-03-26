import { useDispatch, useSelector } from "react-redux";
import HeroSection from "../components/HeroSection";
import CategoryProducts from "../components/categoryProducts";
import NewArrival from "../components/NewArrival";
import BestSeller from "../components/BestSeller";
import { useEffect } from "react";
import { fetchAllProducts } from "../features/product/productAPI";
import ProductCard from "../components/ProductCard";

const HomePage = () => {
  const { productsData } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllProducts({ page: 1, limit: 16 }));
  }, [dispatch]);
  console.log(productsData?.products);
  return (
    <div className="p-3 mt-8">
      <HeroSection />
      <CategoryProducts />
      <NewArrival />
      <BestSeller />
      <div className="grid grid-cols-4 gap-3 my-10">
        <h3 className="col-span-full text-2xl underline underline-offset-4">Explore More</h3>
        {productsData?.products &&
          productsData?.products.map((product) => (
            <ProductCard product={product} key={product._id} />
          ))}
      </div>
    </div>
  );
};

export default HomePage;
