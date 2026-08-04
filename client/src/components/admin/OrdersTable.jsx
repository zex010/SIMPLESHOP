import React, { useState } from "react";
import { Eye, CheckCircle2, XCircle } from "lucide-react";
import OrderModal from "./OrderModal";

const statusStyles = {
  Approved: "text-emerald-700 bg-emerald-50",
  Rejected: "text-red-700 bg-red-50",
  Pending: "text-amber-700 bg-amber-50",
};

// order.address is the shippingAddress OBJECT from adminOrderController.js
// (formatOrder -> address: order.shippingAddress), never a string.
// Rendering it directly as a JSX child throws "Objects are not valid as a
// React child" and unmounts the whole app. Flatten it to a string first.
const formatAddress = (address) => {
  if (!address) return "—";
  if (typeof address === "string") return address;

  const { street, address1, address2, city, state, zip, postalCode, country } =
    address;

  return (
    [street || address1, address2, city, state, zip || postalCode, country]
      .filter(Boolean)
      .join(", ") || "—"
  );
};

export default function OrdersTable({ orders = [], onApprove, onReject }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const safeOrders = Array.isArray(orders) ? orders : [];

  const handleApprove = (order) => {
    onApprove(order._id || order.orderId);
    setSelectedOrder(null);
  };

  const handleReject = (order) => {
    onReject(order._id || order.orderId);
    setSelectedOrder(null);
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between">
        <h3 className="font-serif text-xl tracking-wide">Orders</h3>
        <span className="text-[11px] uppercase tracking-[0.2em] text-stone-400">
          {safeOrders.length} Total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left border-b border-stone-100 text-[10px] uppercase tracking-[0.2em] text-stone-400">
              <th className="px-6 py-4 font-normal">Order ID</th>
              <th className="px-6 py-4 font-normal">Customer</th>
              <th className="px-6 py-4 font-normal">Address</th>
              <th className="px-6 py-4 font-normal">Payment</th>
              <th className="px-6 py-4 font-normal">Status</th>
              <th className="px-6 py-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {safeOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-16 text-center text-stone-400 tracking-wide"
                >
                  No orders yet.
                </td>
              </tr>
            ) : (
              safeOrders.map((order) => {
                const addressText = formatAddress(order.address);
                return (
                <tr
                  key={order._id || order.orderId}
                  className="border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors"
                >
                  <td className="px-6 py-4 font-serif tracking-wide">
                    {order.orderId || order._id}
                  </td>
                  <td className="px-6 py-4 text-stone-700">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 text-stone-700 max-w-[220px] truncate" title={addressText}>
                    {addressText}
                  </td>
                  <td className="px-6 py-4 text-stone-700">
                    {order.payment}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.15em] font-medium ${
                        statusStyles[order.status] || "text-stone-600 bg-stone-100"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="h-8 w-8 flex items-center justify-center rounded-full border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
                        aria-label="View order"
                        title="View"
                      >
                        <Eye size={14} />
                      </button>

                      {order.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(order)}
                            className="h-8 w-8 flex items-center justify-center rounded-full border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors"
                            aria-label="Approve order"
                            title="Approve"
                          >
                            <CheckCircle2 size={14} />
                          </button>
                          <button
                            onClick={() => handleReject(order)}
                            className="h-8 w-8 flex items-center justify-center rounded-full border border-red-200 text-red-700 hover:bg-red-50 transition-colors"
                            aria-label="Reject order"
                            title="Reject"
                          >
                            <XCircle size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}