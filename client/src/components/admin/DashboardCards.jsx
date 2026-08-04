import React from "react";
import { DollarSign, Clock, CalendarCheck, Package, Users } from "lucide-react";

export default function DashboardCards({ stats }) {
  const cards = [
    {
      label: "Revenue",
      value: `$${(stats?.revenue ?? 0).toLocaleString()}`,
      icon: DollarSign,
    },
    {
      label: "Pending Orders",
      value: stats?.pendingOrders ?? 0,
      icon: Clock,
    },
    {
      label: "Today's Orders",
      value: stats?.todaysOrders ?? 0,
      icon: CalendarCheck,
    },
    {
      label: "Products",
      value: stats?.productsCount ?? 0,
      icon: Package,
    },
    {
      label: "Customers",
      value: stats?.customersCount ?? 0,
      icon: Users,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col gap-6 transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
        >
          <div className="h-10 w-10 rounded-full bg-stone-100 flex items-center justify-center">
            <Icon size={17} strokeWidth={1.5} className="text-stone-900" />
          </div>
          <div>
            <p className="text-2xl font-serif tracking-wide">{value}</p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-stone-400 mt-1">
              {label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
