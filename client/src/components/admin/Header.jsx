import React from "react";
import { Menu, Bell } from "lucide-react";

const titles = {
  dashboard: "Dashboard",
  products: "Products",
  orders: "Orders",
  cancelled: "Cancelled Orders",
  customers: "Customers",
  analytics: "Analytics",
  settings: "Settings",
};

export default function Header({ activeTab, onMenuClick, adminName }) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-stone-200 px-6 lg:px-10 py-5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-stone-700 hover:text-black transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} strokeWidth={1.5} />
        </button>
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-stone-400">
            AVERNUS Admin
          </p>
          <h2 className="font-serif text-2xl tracking-wide">
            {titles[activeTab] || "Dashboard"}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button
          className="relative text-stone-500 hover:text-black transition-colors"
          aria-label="Notifications"
        >
          <Bell size={19} strokeWidth={1.5} />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-black" />
        </button>

        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs uppercase tracking-wide font-serif">
            {adminName ? adminName.charAt(0) : "A"}
          </div>
          <span className="hidden sm:block text-sm tracking-wide text-stone-700">
            {adminName || "Admin"}
          </span>
        </div>
      </div>
    </header>
  );
}