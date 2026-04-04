import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchProductById,
  fetchRelatedProducts,
} from "../features/product/productAPI";
import capitalizeWords from "../utils/capitalizeWords";
import Rating from "../components/Rating";
import calculateSellingPrice from "../utils/priceUtil";
import { addToCartProduct } from "../features/cart/cartAPI";
import ProductCard from "../components/ProductCard";

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { productData } = useSelector((state) => state.product);
  const { product, loading } = productData;
  const { relatedProductsData } = useSelector((state) => state.product);
  const [image, setImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  // 1. Product fetch
  useEffect(() => {
    dispatch(fetchProductById({ id }));
    console.log("product: ", product);
  }, [dispatch, id]);

  // 2. Related products fetch
  useEffect(() => {
    if (product?.subCategory) {
      dispatch(
        fetchRelatedProducts({
          subCategory: product.subCategory,
          page: 1,
          limit: 12,
        }),
      );
    }
    console.log("related products: ", relatedProductsData);
  }, [product?.subCategory]);

  useEffect(() => {
    if (product?.variants?.length) {
      setImage(product?.variants?.[0].images[0]);
      setSelectedColor(product?.variants?.[0].color);
      setSelectedSize(product?.variants?.[0]?.sizes[0].size);
    }
  }, [product]);

  const selectedVariant = product?.variants?.find(
    (v) => v.color === selectedColor,
  );

  const images = selectedVariant?.images || [];
  const leftImages = images.slice(0, 5);
  const bottomImages = images.length > 5 ? images.slice(5) : [];
  
  return (
    <div className="p-3 mt-26">
      {/* PRODUCT INFORMATION */}
      <div className="grid grid-cols-10 gap-5">
        {/* IMAGE SECTION */}
        <div className="col-span-6 h-162.5 flex flex-col gap-2 sticky top-5">
          <div className="flex flex-1 gap-2 overflow-hidden">
            {/* LEFT IMAGES */}
            <ul className="w-22.5 flex flex-col gap-2">
              {leftImages.map((img, i) => (
                <li className="h-20" key={i}>
                  <img
                    src={img}
                    onClick={() => setImage(img)}
                    className={`w-full h-full object-contain bg-[#E0DACF] rounded-lg cursor-pointer ${image === img ? "border-2" : ""}`}
                  />
                </li>
              ))}
            </ul>

            {/* MAIN IMAGE */}
            <div className="flex-1 bg-[#E0DACF] rounded-xl flex items-center justify-center">
              {image && (
                <img src={image} className="w-full h-full object-contain" />
              )}
            </div>
          </div>

          {/* BOTTOM IMAGES */}
          {bottomImages.length > 0 && (
            <ul className="grid grid-cols-6 gap-2 h-25">
              {bottomImages.map((img, i) => (
                <li key={i}>
                  <img
                    src={img}
                    onClick={() => setImage(img)}
                    className="w-full h-full object-contain bg-[#E0DACF] rounded-lg cursor-pointer"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* PRODUCT DETAIL */}
        <div className="col-span-4 bg-white rounded-2xl p-4 flex flex-col gap-4">
          {/* TITLE */}
          {product?.title && product?.brand && (
            <div>
              <span className="text-3xl font-bold">
                {capitalizeWords(product.title)}
              </span>
              <span> - </span>
              <span className="text-xl">
                ({capitalizeWords(product.brand)})
              </span>
            </div>
          )}

          {/* DESCRIPTION */}
          {product?.description && (
            <p className="text-justify">
              {capitalizeWords(product.description)}
            </p>
          )}

          {/* TAGS */}
          {product?.tags?.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {product.tags.map((tag, i) => (
                <li key={i}>
                  <span className="bg-red-400 px-3 py-1 rounded text-white text-sm">
                    {capitalizeWords(tag)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* RATING */}
          <ul className="flex items-center gap-2">
            <li>
              <Rating rating={product?.rating} starSize={15} />
            </li>

            {selectedVariant?.discountPercentage && (
              <li className="text-yellow-400">
                ({selectedVariant.discountPercentage}% OFF)
              </li>
            )}
          </ul>

          {/* PRICE */}
          {selectedVariant?.mrpPrice && (
            <div className="flex gap-2 items-end">
              <span className="text-3xl font-medium">
                $
                {calculateSellingPrice(
                  selectedVariant.mrpPrice,
                  selectedVariant.discountPercentage,
                )}
              </span>

              <span className="line-through">${selectedVariant.mrpPrice}</span>
            </div>
          )}

          {/* COLOR + STOCK */}
          <div className="flex gap-4">
            <p>
              <span className="font-medium">Color:</span>{" "}
              {capitalizeWords(selectedColor)}
            </p>

            <p>
              <span className="font-medium">Stock:</span>{" "}
              {selectedVariant?.sizes[0]?.stock}
            </p>
          </div>

          {/* COLOR VARIANTS */}
          {product?.variants?.length && (
            <ul className="grid grid-cols-6 gap-2">
              {product.variants.map((variant, i) => (
                <li
                  key={i}
                  onClick={() => {
                    setSelectedColor(variant.color);
                    setImage(variant.images[0]);
                  }}
                >
                  <img
                    src={variant.images[0]}
                    className={`bg-[#E0DACF] rounded-lg cursor-pointer ${
                      selectedColor === variant.color ? "border-2" : ""
                    }`}
                  />
                </li>
              ))}
            </ul>
          )}

          {/* SIZE */}
          <span className="text-xl underline">Sizes</span>
          <ul className="grid grid-cols-7 gap-2">
            {selectedVariant?.sizes?.map((item, i) => (
              <li
                key={i}
                onClick={() => setSelectedSize(item.size)}
                className={`text-center border px-4 py-2 rounded cursor-pointer ${
                  selectedSize === item.size ? "bg-black text-white" : ""
                }`}
              >
                {item.size.toUpperCase()}
              </li>
            ))}
          </ul>

          {/* ADD TO CART */}
          <button
            className="bg-black py-3 rounded-full text-white flex justify-center gap-2 cursor-pointer"
            onClick={() =>
              dispatch(
                addToCartProduct({
                  id: product._id,
                  size: selectedSize || null,
                  color: selectedColor || null,
                  quantity: 1,
                }),
              )
            }
          >
            ADD TO CART - $
            {calculateSellingPrice(
              selectedVariant?.mrpPrice,
              selectedVariant?.discountPercentage,
            )}
          </button>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="my-15">
        <h1 className="text-3xl my-10 premium-cursive">Related Products</h1>
        <ul className="grid grid-cols-4 gap-3">
          {relatedProductsData?.products?.length > 0 &&
            relatedProductsData.products.map((item) => (
              <li key={item._id}>
                <ProductCard product={item} />
              </li>
            ))}
        </ul>
      </div>

      {/* IMAGE GALLERY */}
      <div>
        <h1 className="text-3xl my-10 text-center">Image Gallery</h1>

        <ul className="grid grid-cols-2 gap-3">
          {selectedVariant?.images?.map((img) => (
            <li key={img}>
              <img
                src={img}
                className="bg-[#E0DACF] w-full h-screen object-contain rounded-2xl"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductPage;
