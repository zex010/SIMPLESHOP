import React, { useState } from "react";
import { Save } from "lucide-react";

export default function Settings({ settings, onSave }) {
  const [form, setForm] = useState({
    storeName: settings?.storeName || "AVERNUS",
    shippingCharges: settings?.shippingCharges ?? 0,
    currency: settings?.currency || "USD",
    paymentMethods: settings?.paymentMethods || {
      cod: true,
      card: true,
      wallet: false,
    },
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const togglePayment = (method) => {
    setForm((prev) => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [method]: !prev.paymentMethods[method],
      },
    }));
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    setSaved(true);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-stone-200 rounded-2xl p-8 max-w-2xl space-y-8"
    >
      <div>
        <h3 className="font-serif text-xl tracking-wide mb-6">
          Store Settings
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-[0.25em] text-stone-500 mb-2">
              Store Name
            </label>
            <input
              type="text"
              value={form.storeName}
              onChange={(e) => handleChange("storeName", e.target.value)}
              className="w-full border-b border-stone-300 bg-transparent py-2.5 text-sm tracking-wide outline-none focus:border-black transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-[0.25em] text-stone-500 mb-2">
                Shipping Charges
              </label>
              <input
                type="number"
                min="0"
                value={form.shippingCharges}
                onChange={(e) =>
                  handleChange("shippingCharges", Number(e.target.value))
                }
                className="w-full border-b border-stone-300 bg-transparent py-2.5 text-sm tracking-wide outline-none focus:border-black transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.25em] text-stone-500 mb-2">
                Currency
              </label>
              <select
                value={form.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
                className="w-full border-b border-stone-300 bg-transparent py-2.5 text-sm tracking-wide outline-none focus:border-black transition-colors"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="PKR">PKR</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.25em] text-stone-500 mb-3">
              Payment Methods
            </label>
            <div className="flex flex-wrap gap-3">
              {Object.entries(form.paymentMethods).map(([method, active]) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => togglePayment(method)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] border transition-colors ${
                    active
                      ? "bg-black text-white border-black"
                      : "border-stone-300 text-stone-500 hover:border-stone-500"
                  }`}
                >
                  {method === "cod"
                    ? "Cash On Delivery"
                    : method === "card"
                    ? "Card"
                    : "Wallet"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          className="flex items-center gap-2 bg-black text-white text-xs uppercase tracking-[0.25em] px-6 py-3 rounded-full hover:bg-stone-800 transition-colors"
        >
          <Save size={14} />
          Save Changes
        </button>
        {saved && (
          <span className="text-xs uppercase tracking-[0.2em] text-emerald-600">
            Saved
          </span>
        )}
      </div>
    </form>
  );
}
