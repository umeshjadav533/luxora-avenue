import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchTagProducts } from "../features/product/productAPI";
import { MoveLeftIcon, MoveRightIcon } from "lucide-react";

const NewArrival = () => {
  const { tagProductsData } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    dispatch(fetchTagProducts({ tag: "new-arrival", page: 1, limit: 10 }));
  }, [dispatch]);

  const products = tagProductsData?.products || [];

  if (products.length === 0) return null;

  const prevIndex = (current - 1 + products.length) % products.length;
  const nextIndex = (current + 1) % products.length;

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % products.length);
  };

  return (
    <div className="flex flex-col items-center gap-10 py-10 overflow-hidden">
      <h3 className="text-2xl underline underline-offset-5 cursor-pointer">
        New Arrival
      </h3>

      <div className="relative w-full max-w-6xl flex items-center justify-center">
        {/* LEFT BUTTON */}
        <button
          className="absolute left-0 z-10 bg-black text-white p-3 cursor-pointer"
          onClick={prevSlide}
        >
          <MoveLeftIcon size={18} />
        </button>

        {/* SLIDER */}
        <div className="flex items-center gap-6 transition-all duration-500">
          {/* LEFT */}
          <div className="scale-75 transition-all duration-500">
            <div className="group relative">
              <img
                src={products[prevIndex].variants[0].images[0]}
                className="w-100 h-80 object-contain rounded-xl"
              />
            </div>
          </div>

          {/* CENTER */}
          <div className="scale-100 opacity-100 transition-all duration-500">
            <div className="group relative">
              <img
                src={products[current].variants[0].images[0]}
                className="w-100 h-100 object-contain rounded-xl"
              />
            </div>

            <h3 className="text-xl text-center mt-3">
              {products[current].title}
            </h3>
            <button className="text-center m-auto block px-5 py-1 my-5 rounded-full border-2 border-black hover:bg-black hover:text-white cursor-pointer text-sm">
              SHOP
            </button>
          </div>

          {/* RIGHT */}
          <div className="scale-75 transition-all duration-500">
            <div className="group relative">
              <img
                src={products[nextIndex].variants[0].images[0]}
                className="w-100 h-80 object-contain rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* RIGHT BUTTON */}
        <button
          className="absolute right-0 z-10 bg-black text-white p-3 cursor-pointer"
          onClick={nextSlide}
        >
          <MoveRightIcon size={18} />
        </button>
      </div>
    </div>
  );
};

export default NewArrival;
