import React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

const resolveImage = (src) => {
  if (!src) return "";

  if (src.startsWith("http")) return src;

  return `https://avernus-api.onrender.com${src}`;
};

export default function ProductsTable({
  products,
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between">
        <h3 className="font-serif text-xl tracking-wide">
          Products
        </h3>

        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-black text-white text-xs uppercase tracking-[0.2em] px-4 py-2.5 rounded-full hover:bg-stone-800 transition-colors"
        >
          <Plus size={14} />
          Add Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="border-b border-stone-200 text-left text-[10px] uppercase tracking-[0.25em] text-stone-400">
              <th className="px-6 py-4 font-normal">
                Product
              </th>

              <th className="px-6 py-4 font-normal">
                Brand
              </th>

              <th className="px-6 py-4 font-normal">
                Category
              </th>

              <th className="px-6 py-4 font-normal">
                Price
              </th>

              <th className="px-6 py-4 font-normal">
                Stock
              </th>

              <th className="px-6 py-4 font-normal text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="py-20 text-center text-stone-400"
                >
                  No products available.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-stone-100 hover:bg-stone-50 transition"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">

                      <div className="w-14 h-14 bg-stone-100 rounded-xl flex items-center justify-center overflow-hidden">

                        <img
                          src={resolveImage(product.image)}
                          alt={product.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.src =
                              "https://placehold.co/100x100/f5f5f4/78716c?text=No+Image";
                          }}
                        />

                      </div>

                      <span className="font-serif text-base">
                        {product.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {product.brand}
                  </td>

                  <td className="px-6 py-4">
                    {product.category}
                  </td>

                  <td className="px-6 py-4">
                    ${product.price}
                  </td>

                  <td className="px-6 py-4">
                    {product.stock}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">

                      <button
                        onClick={() => onEdit(product)}
                        className="w-9 h-9 rounded-full border border-stone-200 hover:bg-stone-100 flex items-center justify-center"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        onClick={() => onDelete(product._id)}
                        className="w-9 h-9 rounded-full border border-red-200 hover:bg-red-50 text-red-600 flex items-center justify-center"
                      >
                        <Trash2 size={15} />
                      </button>

                    </div>
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