import React from "react";
import { TrendingUp, ShoppingBag, DollarSign } from "lucide-react";

export default function Analytics({ analytics }) {
  const cards = [
    {
      label: "Total Revenue",
      value: `$${(analytics?.revenue ?? 0).toLocaleString()}`,
      icon: DollarSign,
    },
    {
      label: "Total Sales",
      value: analytics?.sales ?? 0,
      icon: TrendingUp,
    },
    {
      label: "Total Orders",
      value: analytics?.orders ?? 0,
      icon: ShoppingBag,
    },
  ];

  const monthly = analytics?.monthly || [];
  const maxValue = Math.max(1, ...monthly.map((m) => m.value));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-white border border-stone-200 rounded-2xl p-6 flex items-center gap-4"
          >
            <div className="h-11 w-11 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
              <Icon size={18} strokeWidth={1.5} />
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

      <div className="bg-white border border-stone-200 rounded-2xl p-6">
        <h3 className="font-serif text-xl tracking-wide mb-8">
          Revenue Trend
        </h3>

        {monthly.length === 0 ? (
          <p className="text-stone-400 text-sm tracking-wide py-10 text-center">
            No analytics data yet.
          </p>
        ) : (
          <div className="flex items-end gap-3 h-56">
            {monthly.map((m) => (
              <div
                key={m.label}
                className="flex-1 flex flex-col items-center justify-end gap-3 group"
              >
                <div
                  className="w-full bg-stone-900 rounded-t-md transition-all duration-500 group-hover:bg-stone-700"
                  style={{
                    height: `${(m.value / maxValue) * 100}%`,
                    minHeight: "4px",
                  }}
                  title={`$${m.value}`}
                />
                <span className="text-[10px] uppercase tracking-[0.15em] text-stone-400">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
