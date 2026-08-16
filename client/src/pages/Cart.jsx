import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useShop } from "../context/ShopContext";

function resolveImageSrc(src) {
  if (!src) return "/placeholder.png";

  return src.startsWith("http")
    ? src
    : `https://avernus-api.onrender.com${src}`;
}

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useShop();
  const navigate = useNavigate();

  const totalAmount = cart.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.qty || 0),
    0
  );

  const handleCheckout = () => {
    if (cart.length === 0) return;
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col overflow-x-hidden">
      <Navbar />

      <main className="flex-grow w-full max-w-6xl mx-auto px-5 sm:px-7 md:px-10 py-12 md:py-16">

        {/* ======================================================
            PAGE TITLE
        ====================================================== */}

        <div className="mb-10">
          <p className="text-[9px] uppercase tracking-[0.45em] text-stone-400 mb-3">
            AVERNUS
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl uppercase tracking-wide">
            Shopping Bag
          </h1>

          <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-stone-400">
            {cart.length} {cart.length === 1 ? "Item" : "Items"}
          </p>
        </div>

        {/* ======================================================
            EMPTY CART
        ====================================================== */}

        {cart.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center">

            <ShoppingBag
              size={46}
              strokeWidth={1}
              className="text-stone-300 mb-6"
            />

            <h2 className="font-serif text-3xl uppercase">
              Your Bag Is Empty
            </h2>

            <p className="text-xs uppercase tracking-[0.2em] text-stone-400 mt-3 mb-8">
              Explore our Haute Parfumerie selections
            </p>

            <Link
              to="/collection"
              className="
                bg-black
                text-white
                px-8
                py-3
                text-[10px]
                uppercase
                tracking-[0.25em]
                hover:bg-stone-800
                transition
              "
            >
              Discover Fragrances
            </Link>
          </div>
        ) : (

          /* ====================================================
             CART CONTENT
          ==================================================== */

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">

            {/* ==================================================
                LEFT — SHOPPING BAG
            ================================================== */}

            <div
              className="
                bg-white
                border
                border-stone-200
                flex
                flex-col
                h-full
              "
            >

              {/* CARD HEADER */}

              <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between">

                <div>
                  <p className="text-[9px] uppercase tracking-[0.35em] text-stone-400">
                    Your Selection
                  </p>

                  <h2 className="font-serif text-xl mt-1 uppercase">
                    Shopping Bag
                  </h2>
                </div>

                <ShoppingBag
                  size={19}
                  strokeWidth={1.2}
                  className="text-stone-400"
                />

              </div>

              {/* PRODUCTS */}

              <div className="flex-1">

                {cart.map((item) => (

                  <div
                    key={`${item._id}-${item.selectedSize}`}
                    className="
                      p-5
                      sm:p-6
                      border-b
                      border-stone-200
                      last:border-b-0
                    "
                  >

                    <div className="flex gap-5">

                      {/* PRODUCT IMAGE */}

                      <div
                        className="
                          w-28
                          h-28
                          sm:w-32
                          sm:h-32
                          shrink-0
                          bg-[#f8f8f8]
                          p-3
                          overflow-hidden
                        "
                      >
                        <img
                          src={resolveImageSrc(item.image)}
                          alt={item.name}
                          className="w-full h-full object-contain"
                          onError={(event) => {
                            event.currentTarget.src =
                              "/placeholder.png";
                          }}
                        />
                      </div>

                      {/* PRODUCT DETAILS */}

                      <div className="flex-1 min-w-0 flex flex-col">

                        <div className="flex justify-between gap-4">

                          <div className="min-w-0">

                            <p
                              className="
                                text-[9px]
                                uppercase
                                tracking-[0.25em]
                                text-stone-400
                              "
                            >
                              {item.brand || "AVERNUS"}
                            </p>

                            <h3
                              className="
                                font-serif
                                text-xl
                                leading-tight
                                mt-1
                                break-words
                              "
                            >
                              {item.name}
                            </h3>

                            <p
                              className="
                                text-[9px]
                                mt-2
                                uppercase
                                tracking-[0.18em]
                                text-stone-500
                              "
                            >
                              Size: {item.selectedSize}
                            </p>

                          </div>

                          {/* PRICE */}

                          <p
                            className="
                              font-serif
                              text-base
                              shrink-0
                            "
                          >
                            $
                            {(
                              Number(item.price || 0) *
                              Number(item.qty || 0)
                            ).toFixed(2)}
                          </p>

                        </div>

                        {/* QUANTITY + REMOVE */}

                        <div className="flex items-center justify-between mt-auto pt-6">

                          <div
                            className="
                              border
                              border-stone-300
                              flex
                              items-center
                              h-9
                            "
                          >

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item._id,
                                  item.selectedSize,
                                  -1
                                )
                              }
                              className="
                                w-9
                                h-full
                                flex
                                items-center
                                justify-center
                                hover:bg-stone-50
                              "
                              aria-label="Decrease quantity"
                            >
                              <Minus size={11} />
                            </button>

                            <span
                              className="
                                min-w-[32px]
                                text-center
                                text-xs
                              "
                            >
                              {item.qty}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item._id,
                                  item.selectedSize,
                                  1
                                )
                              }
                              className="
                                w-9
                                h-full
                                flex
                                items-center
                                justify-center
                                hover:bg-stone-50
                              "
                              aria-label="Increase quantity"
                            >
                              <Plus size={11} />
                            </button>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(
                                item._id,
                                item.selectedSize
                              )
                            }
                            className="
                              text-stone-400
                              hover:text-black
                              transition
                              p-2
                            "
                            aria-label="Remove item"
                          >
                            <Trash2
                              size={16}
                              strokeWidth={1.3}
                            />
                          </button>

                        </div>

                      </div>
                    </div>

                  </div>

                ))}

              </div>

            </div>

            {/* ==================================================
                RIGHT — ORDER SUMMARY
            ================================================== */}

            <div
              className="
                bg-white
                border
                border-stone-200
                h-full
                flex
                flex-col
              "
            >

              {/* HEADER */}

              <div className="px-6 py-5 border-b border-stone-200">

                <p className="text-[9px] uppercase tracking-[0.35em] text-stone-400">
                  AVERNUS
                </p>

                <h2 className="font-serif text-xl mt-1 uppercase">
                  Order Summary
                </h2>

              </div>

              {/* SUMMARY CONTENT */}

              <div className="p-6 flex-1 flex flex-col">

                <div className="space-y-5">

                  {/* SUBTOTAL */}

                  <div className="flex items-center justify-between text-sm">

                    <span className="text-stone-500">
                      Subtotal
                    </span>

                    <span>
                      ${totalAmount.toFixed(2)}
                    </span>

                  </div>

                  {/* SHIPPING */}

                  <div className="flex items-center justify-between text-sm">

                    <span className="text-stone-500">
                      Shipping
                    </span>

                    <span className="text-xs uppercase tracking-wide">
                      Complimentary
                    </span>

                  </div>

                </div>

                {/* TOTAL */}

                <div
                  className="
                    border-t
                    border-stone-200
                    mt-6
                    pt-5
                    flex
                    items-center
                    justify-between
                  "
                >

                  <span className="font-serif text-xl">
                    Total
                  </span>

                  <span className="font-serif text-xl">
                    ${totalAmount.toFixed(2)}
                  </span>

                </div>

                {/* FLEXIBLE SPACE */}

                <div className="flex-1 min-h-6" />

                {/* CHECKOUT */}

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="
                    w-full
                    max-w-[240px]
                    mx-auto
                    bg-black
                    text-white
                    h-11
                    px-5
                    uppercase
                    text-[9px]
                    tracking-[0.25em]
                    flex
                    items-center
                    justify-center
                    gap-3
                    hover:bg-stone-800
                    transition
                  "
                >
                  Checkout
                  <ArrowRight size={13} strokeWidth={1.5} />
                </button>

                <p
                  className="
                    text-center
                    text-[8px]
                    uppercase
                    tracking-[0.2em]
                    text-stone-400
                    mt-4
                  "
                >
                  Complimentary Worldwide Shipping
                </p>

              </div>

            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}