import React from "react";

export default function CustomersTable({ customers = [] }) {
  const safeCustomers = Array.isArray(customers) ? customers : [];

  return (
    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between">
        <h3 className="font-serif text-xl tracking-wide">Customers</h3>
        <span className="text-[11px] uppercase tracking-[0.2em] text-stone-400">
          {safeCustomers.length} Total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[820px]">
          <thead>
            <tr className="text-left border-b border-stone-100 text-[10px] uppercase tracking-[0.2em] text-stone-400">
              <th className="px-6 py-4 font-normal">Name</th>
              <th className="px-6 py-4 font-normal">Email</th>
              <th className="px-6 py-4 font-normal">Phone</th>
              <th className="px-6 py-4 font-normal">Address</th>
              <th className="px-6 py-4 font-normal">Total Orders</th>
              <th className="px-6 py-4 font-normal">Joined</th>
            </tr>
          </thead>
          <tbody>
            {safeCustomers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-16 text-center text-stone-400 tracking-wide"
                >
                  No customers yet.
                </td>
              </tr>
            ) : (
              safeCustomers.map((customer) => (
                <tr
                  key={customer._id}
                  className="border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors"
                >
                  <td className="px-6 py-4 font-serif tracking-wide">
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 text-stone-700">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 text-stone-700">
                    {customer.phone || "—"}
                  </td>
                  <td
                    className="px-6 py-4 text-stone-700 max-w-[240px] truncate"
                    title={customer.address || ""}
                  >
                    {customer.address || "—"}
                  </td>
                  <td className="px-6 py-4 text-stone-700">
                    {customer.totalOrders ?? 0}
                  </td>
                  <td className="px-6 py-4 text-stone-500">
                    {customer.createdAt
                      ? new Date(customer.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}