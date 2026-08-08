import React from "react";
import { X, CheckCircle2, XCircle, Receipt } from "lucide-react";

// Backend's shippingAddress is an object (name, email, street, city, state,
// zip, country, phone — see adminOrderController.js formatOrder()), not a
// string. Rendering it directly as a JSX child throws "Objects are not
// valid as a React child" and crashes the whole app. Format it safely here.
const formatAddress = (address) => {
  if (!address) return "No address provided";
  if (typeof address === "string") return address;

  const {
    street,
    address1,
    address2,
    city,
    state,
    zip,
    postalCode,
    country,
  } = address;

  return (
    [street || address1, address2, city, state, zip || postalCode, country]
      .filter(Boolean)
      .join(", ") || "No address provided"
  );
};

// Same image path pattern used in ProductsTable.jsx — item.image comes back
// as a relative "/uploads/products/xyz.jpg" path from the backend.
const resolveImage = (src) => {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  return `http://192.168.10.6:5000${src}`;
};

export default function OrderModal({ order, onClose, onApprove, onReject }) {
  if (!order) return null;

  const items = Array.isArray(order.items) ? order.items : [];
  const addressText = formatAddress(order.address);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-5 border-b border-stone-200">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400">
              Order Details
            </p>
            <h3 className="font-serif text-xl tracking-wide mt-1">
              {order.orderId || order._id}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-black transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400 mb-1">
                Customer
              </p>
              <p className="tracking-wide">{order.customerName}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400 mb-1">
                Email
              </p>
              <p className="tracking-wide break-all">
                {order.customerEmail || "—"}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400 mb-1">
                Customer Phone
              </p>
              <p className="tracking-wide">{order.customerPhone || "—"}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400 mb-1">
                Recipient Phone
                <span className="normal-case tracking-normal text-stone-300"> (optional)</span>
              </p>
              <p className="tracking-wide">{order.recipientPhone || "—"}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400 mb-1">
                Payment
              </p>
              <p className="tracking-wide">{order.payment}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400 mb-1">
                Status
              </p>
              <p className="tracking-wide">{order.status}</p>
            </div>
          </div>

          {/* ITEMS — now with product image per line item */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400 mb-3">
              Items
            </p>
            <div className="space-y-3">
              {items.length === 0 ? (
                <p className="text-sm text-stone-400">No items on this order.</p>
              ) : (
                items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 text-sm border-b border-stone-100 pb-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 shrink-0 bg-stone-100 rounded-lg overflow-hidden">
                        <img
                          src={resolveImage(item.image)}
                          alt={item.name || "Product"}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.src =
                              "https://placehold.co/100x100/f5f5f4/78716c?text=No+Image";
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-serif truncate">{item.name}</p>
                        <p className="text-xs text-stone-400 uppercase tracking-wide mt-0.5">
                          {item.brand} &middot; Qty {item.qty}
                          {item.selectedSize ? ` \u00b7 Size ${item.selectedSize}` : ""}
                        </p>
                      </div>
                    </div>
                    <span className="tracking-[0.15em] shrink-0">${item.price}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400 mb-2">
              Shipping Address
            </p>
            <p className="text-sm text-stone-700 leading-6">
              {addressText}
            </p>
          </div>

          {/* PAYMENT RECEIPT */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400 mb-2 flex items-center gap-2">
              <Receipt size={12} />
              Payment Receipt
            </p>
            <div className="border border-stone-200 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Order ID</span>
                <span className="tracking-wide">{order.orderId || order._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Date</span>
                <span>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Payment Method</span>
                <span>{order.payment || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Status</span>
                <span>{order.status}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-100 font-serif text-base">
                <span>Total Paid</span>
                <span>${order.total}</span>
              </div>
            </div>
          </div>
        </div>

        {order.status === "Pending" && (
          <div className="sticky bottom-0 bg-white flex gap-3 px-6 py-5 border-t border-stone-200">
            <button
              onClick={() => onReject(order)}
              className="flex-1 flex items-center justify-center gap-2 border border-stone-300 text-stone-700 text-xs uppercase tracking-[0.2em] py-3 rounded-full hover:bg-stone-50 transition-colors"
            >
              <XCircle size={15} />
              Reject
            </button>
            <button
              onClick={() => onApprove(order)}
              className="flex-1 flex items-center justify-center gap-2 bg-black text-white text-xs uppercase tracking-[0.2em] py-3 rounded-full hover:bg-stone-800 transition-colors"
            >
              <CheckCircle2 size={15} />
              Approve
            </button>
          </div>
        )}
      </div>
    </div>
  );
}