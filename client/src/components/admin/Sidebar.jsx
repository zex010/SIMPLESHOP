import React from "react";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Users,
  BarChart3,
  Settings as SettingsIcon,
  LogOut,
  X,
  XCircle,
} from "lucide-react";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "products", label: "Products", icon: Package },
  { key: "orders", label: "Orders", icon: ClipboardList },
  { key: "cancelled", label: "Cancelled Orders", icon: XCircle },
  { key: "customers", label: "Customers", icon: Users },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "settings", label: "Settings", icon: SettingsIcon },
];

export default function Sidebar({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  onLogout,
}) {
  const handleSelect = (key) => {
    setActiveTab(key);
    onClose?.();
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-stone-950 text-stone-300 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-8 py-8">
          <h1 className="font-serif text-white text-2xl tracking-[0.3em]">
            AVERNUS
          </h1>
          <button
            onClick={onClose}
            className="lg:hidden text-stone-400 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <p className="px-8 text-[10px] uppercase tracking-[0.35em] text-stone-600 mb-4">
          Admin Panel
        </p>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map(({ key, label, icon: Icon }) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm tracking-wide transition-all duration-200 ${
                  active
                    ? "bg-white text-black"
                    : "text-stone-400 hover:bg-stone-900 hover:text-white"
                }`}
              >
                <Icon size={17} strokeWidth={1.5} />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-6 border-t border-stone-900">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm tracking-wide text-stone-400 hover:bg-stone-900 hover:text-white transition-all duration-200"
          >
            <LogOut size={17} strokeWidth={1.5} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}