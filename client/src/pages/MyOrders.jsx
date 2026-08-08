import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useShop } from "../context/ShopContext";
import {
  Package,
  MapPin,
  CreditCard,
  CalendarDays,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Ban,
} from "lucide-react";

// Backend resolve image helper
const FALLBACK_IMAGE = "https://placehold.co/200x200/f5f5f4/78716c?text=No+Image";

const resolveImage = (image) => {
  const src = Array.isArray(image) ? image[0] : image;
  if (!src) return FALLBACK_IMAGE;
  if (src.startsWith("http")) return src;
  // Strip any leading slash before re-adding exactly one, so paths like
  // "/uploads/products/x.jpg" don't become a broken double-slash URL.
  return `http://192.168.10.6:5000/${src.replace(/^\/+/, "")}`;
};

// Helper to format MongoDB timestamp
const formatOrderDate = (dateString) => {
  if (!dateString) return { date: "N/A", time: "" };
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

// Once an order has shipped/delivered/already-cancelled, the customer can
// no longer cancel it themselves — only orders still awaiting fulfillment.
const CANCELLABLE_STATUSES = ["Pending", "Confirmed"];

export default function MyOrders() {
  // Get real data and loading state from context
  const { orders, getMyOrders, ordersLoading, cancelOrder } = useShop();

  // Track which order id is currently being cancelled so we can disable
  // just that one button and show a spinner on it, not the whole page.
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelError, setCancelError] = useState("");

  // Fetch orders on component mount
  useEffect(() => {
    getMyOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Cancel this order? This can't be undone.")) return;

    setCancelError("");
    setCancellingId(orderId);

    try {
      await cancelOrder(orderId);
      // Refresh the list so the status badge updates immediately.
      await getMyOrders();
    } catch (err) {
      setCancelError(
        err?.response?.data?.message ||
          "Couldn't cancel this order. Please try again."
      );
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50/40 text-stone-900 font-sans antialiased flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* HEADER */}
        <div className="text-center mb-12 sm:mb-16 border-b border-stone-100 pb-10">
          <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 font-mono mb-2">
            Purchase History
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl tracking-[0.2em] text-stone-950 uppercase">
            My Orders
          </h1>
          <p className="text-xs text-stone-500 uppercase tracking-[0.2em] mt-3 font-light">
            Review your Avernus acquisitions
          </p>
        </div>

        {cancelError && (
          <p className="max-w-2xl mx-auto mb-8 text-xs tracking-wide text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl text-center">
            {cancelError}
          </p>
        )}

        {/* LOADING STATE */}
        {ordersLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-stone-500 gap-4">
            <Loader2 className="animate-spin text-stone-900" size={32} />
            <p className="text-xs uppercase tracking-[0.2em]">Retrieving order history...</p>
          </div>
        ) : !orders || orders.length === 0 ? (
          /* EMPTY STATE */
          <div className="max-w-md mx-auto py-16 px-8 text-center bg-white border border-stone-100 rounded-2xl shadow-xs my-8 transition-all hover:border-stone-200 hover:shadow-sm">
            <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={36} className="text-stone-300 stroke-[1]" />
            </div>
            <h2 className="font-serif text-2xl tracking-wide uppercase text-stone-900 mb-2">
              No Orders Found
            </h2>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500 leading-relaxed font-light">
              You haven't placed any artisanal fragrance orders yet.
            </p>
          </div>
        ) : (
          /* ORDERS LIST - Fetched from MongoDB */
          <div className="space-y-10">
            {orders.map((order) => {
              const { date, time } = formatOrderDate(order.createdAt);
              const status = order.orderStatus || "Pending";

              return (
                <div
                  key={order._id}
                  className="bg-white border border-stone-100 rounded-2xl shadow-xs overflow-hidden transition-all hover:border-stone-200 hover:shadow-sm"
                >
                  {/* ORDER HEADER */}
                  <div className="bg-stone-50/50 p-6 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-mono">
                          Order ID: #{order._id.slice(-8).toUpperCase()}
                        </span>
                        
                        {/* STATUS BADGES & MESSAGES */}
                        {status === "Pending" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/60 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium">
                            <Clock size={12} className="text-amber-600" />
                            Pending Approval
                          </span>
                        )}
                        {status === "Confirmed" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium">
                            <CheckCircle2 size={12} className="text-emerald-600" />
                            Verified
                          </span>
                        )}
                        {/* Shipped/Delivered/Cancelled badges not defined in requirements but added for completeness based on model */}
                         {status === "Shipped" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200/60 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium">
                            <CheckCircle2 size={12} className="text-blue-600" />
                            Shipped
                          </span>
                        )}
                        {status === "Delivered" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium">
                            <CheckCircle2 size={12} className="text-emerald-700" />
                            Delivered
                          </span>
                        )}
                         {status === "Cancelled" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-800 border border-rose-200/60 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium">
                            <AlertTriangle size={12} className="text-rose-600" />
                            Cancelled
                          </span>
                        )}
                      </div>

                      {/* Status Specific Message */}
                      {status === "Confirmed" && (
                        <p className="text-xs text-emerald-700/90 font-light tracking-wide pt-0.5">
                          Your order is verified — you will receive it within 3–4 working days.
                        </p>
                      )}
                       {status === "Pending" && (
                        <p className="text-xs text-amber-800/80 font-light tracking-wide pt-0.5">
                           Your order is waiting for admin verification.
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col md:items-end gap-3">
                      <div className="flex flex-col md:items-end gap-1 font-light text-xs text-stone-500">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={14} className="text-stone-300" />
                          <span>{date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-stone-300" />
                          <span>{time}</span>
                        </div>
                      </div>

                      {CANCELLABLE_STATUSES.includes(status) && (
                        <button
                          type="button"
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={cancellingId === order._id}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-rose-200 text-rose-700 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-rose-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancellingId === order._id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Ban size={12} />
                          )}
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ORDER ITEMS */}
                  <div className="p-6 divide-y divide-stone-100">
                    {order.orderItems?.map((item) => (
                      <div
                        key={`${order._id}-${item.product}-${item.selectedSize}`}
                        className="py-5 flex gap-4 sm:gap-6 items-center first:pt-0 last:pb-0"
                      >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-stone-50 rounded-xl p-2 shrink-0 border border-stone-100 flex items-center justify-center transition hover:border-stone-200">
                          <img
                            src={resolveImage(item.image)}
                            alt={item.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = FALLBACK_IMAGE;
                            }}
                          />
                        </div>

                        <div className="flex-grow min-w-0 space-y-0.5">
                          <p className="text-[9px] uppercase tracking-[0.25em] text-stone-400 font-mono">
                            AVERNUS
                          </p>
                          <h3 className="font-serif text-base sm:text-lg text-stone-950 truncate">
                            {item.name}
                          </h3>
                          <p className="text-[11px] uppercase tracking-[0.15em] text-stone-500 mt-0.5 font-light">
                            Size: {item.selectedSize} &middot; Qty: {item.qty}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="font-serif text-base sm:text-lg font-medium text-stone-950">
                            ${Number(item.price) * Number(item.qty)}
                          </p>
                          <p className="text-[10px] text-stone-400 font-mono">
                            ${item.price} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ORDER FOOTER - Shipping & Summary */}
                  <div className="bg-stone-50/50 p-6 border-t border-stone-100 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 text-xs font-light text-stone-700">
                    {/* Shipping Address */}
                    <div className="md:col-span-2 flex gap-3.5 items-start">
                      <MapPin size={18} className="text-stone-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="uppercase tracking-[0.2em] font-medium text-stone-900 text-[10px]">
                          Shipping Details
                        </p>
                        <p>{order.shippingAddress?.name} &middot; {order.shippingAddress?.phone}</p>
                        <p className="leading-relaxed">
                          {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.province}{" "}
                          {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                        </p>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="border-t md:border-t-0 md:border-l border-stone-100 pt-6 md:pt-0 md:pl-6 space-y-3">
                       <div className="flex justify-between items-center text-stone-500">
                         <span className="uppercase tracking-[0.15em] text-[10px]">Payment Method</span>
                         <div className="flex items-center gap-1.5 text-stone-700">
                           <CreditCard size={14} className="text-stone-400" />
                           <span>{order.paymentMethod}</span>
                         </div>
                       </div>
                       
                       <div className="border-t border-stone-100 pt-3 flex justify-between items-baseline gap-2">
                          <span className="uppercase tracking-[0.25em] font-bold text-stone-950 text-[11px]">Grand Total</span>
                          <span className="font-serif text-2xl text-stone-950 font-semibold">
                             ${order.totalPrice}
                          </span>
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}