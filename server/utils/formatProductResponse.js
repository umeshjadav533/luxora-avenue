import { getSellingPrice } from "./priceUtils.js";

const formatProductResponse = (items, showQuantity = true) => {
  return items.map((item) => {
    const product = item.product;

    const selectedVariant = product?.variants?.find(
      (v) => v?.color?.toLowerCase() === item?.color?.toLowerCase(),
    );

    const selectedSize = selectedVariant?.sizes?.find(
      (s) => s?.size?.toLowerCase() === item?.size?.toLowerCase(),
    );

    return {
      _id: product._id,
      title: product.title,
      description: product.description,
      category: product.category,
      subCategory: product.subCategory,
      brand: product.brand,
      rating: product.rating,
      tags: product.tags,

      color: selectedVariant?.color || null,
      images: selectedVariant?.images || [],

      size: selectedSize?.size || null,
      stock: selectedSize?.stock || selectedVariant?.stock,

      price:
        selectedVariant?.mrpPrice &&
        getSellingPrice(
          selectedVariant?.mrpPrice,
          selectedVariant?.discountPercentage || 0,
        ),

      mrpPrice: selectedVariant?.mrpPrice,
      discount: selectedVariant?.discountPercentage || 0,

      if(showQuantity){
        quantity: item.quantity
      }
    };
  });
};

export default formatProductResponse;
