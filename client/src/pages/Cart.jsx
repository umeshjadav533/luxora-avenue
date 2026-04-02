import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchCartProducts, fetchCartSummary } from "../features/cart/cartAPI";
import { X } from "lucide-react";
import { closeCart } from "../features/cart/cartSlice";
import CartProductCard from "../components/CartProductCard";

const Cart = () => {
  const dispatch = useDispatch();
  const { isCartOpen, cartProducts, cartSummary } = useSelector(
    (state) => state.cart,
  );
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCartProducts());
    dispatch(fetchCartSummary());
  }, [dispatch, isCartOpen]);

  if (!isCartOpen) return null;
  return (
    <div>
      <div
        onClick={() => dispatch(closeCart())}
        className="fixed inset-0 bg-black/50 z-40"
      />
      <div
        className={`fixed top-0 right-0 h-full 
        w-[35%] min-w-125 
        bg-white shadow-[0_0_40px_rgba(0,0,0,0.2)] 
        z-50 transition-transform duration-500 ease-in-out 
        flex flex-col`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-2 border-b-2">
          <h2 className="text-2xl font-bold tracking-wide">
            CART <span className="outfit-font">({cartProducts.length})</span>
          </h2>
          <button
            onClick={() => dispatch(closeCart())}
            className="p-3 rounded-full hover:bg-gray-100 transition cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {cartProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Your cart feels lonely
              </h2>

              <p className="text-gray-500 text-sm mt-2 max-w-xs">
                Looks like you haven't added anything to your cart yet.
              </p>

              <Link
                to="/"
                onClick={() => dispatch(closeCart())}
                className="mt-6 px-6 py-2 bg-black text-white rounded-full text-sm hover:opacity-90 transition"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            cartProducts.map((product, index) => (
              <CartProductCard product={product} key={index} />
            ))
          )}
        </div>

        {/* Bottom Section */}
        <div className="px-8 py-6 space-y-2 border-t-2">
          <div className="flex justify-between text-base">
            <span>Subtotal</span>
            <span className="outfit-font">
              ${cartSummary?.subTotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-base">
            <span>Shipping</span>
            <span>
              {cartSummary?.shipping === 0 ? (
                <span className="text-green-600 font-medium">Free</span>
              ) : (
                <span className="outfit-font">${cartSummary?.shipping}</span>
              )}
            </span>
          </div>

          <div className="flex justify-between text-xl font-bold pt-4 border-t">
            <span>Total</span>
            <span className="outfit-font">
              ${cartSummary?.total.toFixed(2)}
            </span>
          </div>

          <button
            className="w-full bg-black text-white py-2 rounded-full text-lg font-semibold tracking-wide hover:opacity-90 transition cursor-pointer"
            onClick={() => navigate("/checkout")}
          >
            CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
