import { Link } from "react-router-dom";
import {
  fetchCartSummary,
  removeCartProduct,
  updateCartProduct,
} from "../features/cart/cartAPI";
import { Minus, Plus, Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const CartProductCard = ({ product }) => {
  const dispatch = useDispatch();

  return (
    <div className="w-full grid grid-cols-4 gap-4 p-4 border-b border-gray-200 transition duration-200">
      {/* Image */}
      <div className="flex justify-center items-center bg-gray-100 rounded-lg overflow-hidden">
        <Link to={`/product/${product.productId}`}>
          <img
            src={product?.images[0]}
            alt={product.title}
            className="w-24 h-24 object-contain p-2"
          />
        </Link>
      </div>

      <div className="col-span-2 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-gray-800 truncate">
            {product.title}
          </h3>

          <p className="text-sm text-gray-500">{product?.color}</p>

          <p className="text-sm text-gray-600">Size: {product?.size}</p>
        </div>

        <div className="flex items-center gap-1 mt-2">
          <span className="text-lg font-bold text-black outfit-font">
            ${product.price}
          </span>
          <span className="text-md line-through font-bold text-slate-400 outfit-font">
            ${product.mrpPrice}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col justify-between items-end">
        {/* Delete button */}
        <button
          className="text-gray-500 hover:text-black transition cursor-pointer"
          onClick={() =>
            dispatch(
              removeCartProduct({
                id: product._id,
                size: product?.size || null,
                color: product?.color || null,
              }),
            ).then(() => dispatch(fetchCartSummary()))
          }
        >
          <Trash size={20} />
        </button>

        <div className="grid grid-cols-3 border border-gray-300 rounded-full overflow-hidden shadow-sm">
          {/* Minus button */}
          <button
            className="px-2 hover:bg-gray-200 transition text-center"
            onClick={() =>
              dispatch(
                updateCartProduct({
                  id: product._id,
                  size: product?.size || null,
                  color: product?.color || null,
                  quantity: 1,
                  type: "decrement",
                }),
              ).then(() => dispatch(fetchCartSummary()))
            }
          >
            <Minus size={14} className="m-auto" />
          </button>

          <div className="px-2 text-center text-sm font-medium">
            <span>{product.quantity}</span>
          </div>

          {/* Plus button */}
          <button
            className="px-2 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={product.quantity >= product.stock}
            onClick={() =>
              dispatch(
                updateCartProduct({
                  id: product._id,
                  size: product?.size || null,
                  color: product?.color || null,
                  quantity: 1,
                  type: "increment",
                }),
              ).then(() => dispatch(fetchCartSummary()))
            }
          >
            <Plus size={14} className="m-auto" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartProductCard;
