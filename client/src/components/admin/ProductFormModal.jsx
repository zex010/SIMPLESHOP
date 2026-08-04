import React, { useEffect, useState } from "react";
import { X, Upload, Trash2 } from "lucide-react";

const initialState = {
  name: "",
  brand: "",
  category: "Men",
  collection: "",
  price: "",
  stock: "",
  description: "",
  story: "",
  ingredients: "",

  topNotes: "",
  heartNotes: "",
  baseNotes: "",

  isNew: false,
  isBestseller: false,
};

export default function ProductFormModal({
  open,
  onClose,
  onSave,
  product,
}) {
  const [form, setForm] = useState(initialState);
  // Holds File objects selected by the user for upload
  const [selectedFiles, setSelectedFiles] = useState([]);
  // Holds existing image URLs when editing
  const [existingImages, setExistingImages] = useState([]);
  // Previews for newly selected files
  const [filePreviews, setFilePreviews] = useState([]);

  useEffect(() => {
    if (!product) {
      setForm(initialState);
      setSelectedFiles([]);
      setExistingImages([]);
      setFilePreviews([]);
      return;
    }

    setForm({
      name: product.name || "",
      brand: product.brand || "",
      category: product.category || "Men",
      collection: product.collection || "",
      price: product.price || "",
      stock: product.stock || "",
      description: product.description || "",
      story: product.story || "",
      ingredients: product.ingredients || "",

      topNotes: product.fragranceNotes?.top?.join(", ") || "",
      heartNotes: product.fragranceNotes?.heart?.join(", ") || "",
      baseNotes: product.fragranceNotes?.base?.join(", ") || "",

      isNew: product.isNew || false,
      isBestseller: product.isBestseller || false,
    });

    // Populate existing images from product payload
    const images = product.images?.length
      ? product.images
      : product.image
      ? [product.image]
      : [];
    setExistingImages(images);
    setSelectedFiles([]);
    setFilePreviews([]);
  }, [product]);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      filePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [filePreviews]);

  if (!open) return null;

  const changeHandler = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Limit combined image count to 3
    const maxAllowed = 3 - existingImages.length;
    const newFiles = files.slice(0, maxAllowed);

    const updatedFiles = [...selectedFiles, ...newFiles].slice(0, 3);
    setSelectedFiles(updatedFiles);

    // Create object URLs for dynamic preview
    const previews = updatedFiles.map((file) => URL.createObjectURL(file));
    setFilePreviews(previews);
  };

  const removeNewFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);

    URL.revokeObjectURL(filePreviews[index]);
    setFilePreviews(filePreviews.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Basic Fields
    formData.append("name", form.name);
    formData.append("brand", form.brand);
    formData.append("category", form.category);
    formData.append("collection", form.collection);
    formData.append("price", String(form.price));
    formData.append("stock", String(form.stock));

    // Text Descriptions
    formData.append("description", form.description);
    formData.append("story", form.story);
    formData.append("ingredients", form.ingredients);

    // Flags
    formData.append("isNew", String(form.isNew));
    formData.append("isBestseller", String(form.isBestseller));

    // Fragrance Notes formatted as required
    const top = form.topNotes
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);
    const heart = form.heartNotes
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);
    const base = form.baseNotes
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);

    formData.append(
      "fragranceNotes",
      JSON.stringify({ top, heart, base })
    );

    // Existing Image URLs retained during updates
    formData.append("existingImages", JSON.stringify(existingImages));

    // Append up to 3 image files
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    onSave(formData);
  };

  const totalImagesCount = existingImages.length + selectedFiles.length;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-xl w-full max-w-5xl max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b flex justify-between items-center px-8 py-6 z-10">
          <div>
            <h2 className="text-2xl font-serif">
              {product ? "Edit Product" : "Add Product"}
            </h2>
            <p className="text-stone-500 text-sm mt-1">
              AVERNUS Product Management
            </p>
          </div>

          <button onClick={onClose} type="button">
            <X className="w-6 h-6 text-stone-600 hover:text-black transition" />
          </button>
        </div>

        <form onSubmit={submitHandler} className="p-8 space-y-8">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium">Product Name</label>
              <input
                name="name"
                value={form.name}
                onChange={changeHandler}
                className="mt-2 w-full border rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Brand</label>
              <input
                name="brand"
                value={form.brand}
                onChange={changeHandler}
                className="mt-2 w-full border rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={changeHandler}
                className="mt-2 w-full border rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-black bg-white"
              >
                <option>Men</option>
                <option>Women</option>
                <option>Unisex</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Collection</label>
              <input
                name="collection"
                value={form.collection}
                onChange={changeHandler}
                className="mt-2 w-full border rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Price ($)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={changeHandler}
                className="mt-2 w-full border rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-black"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={changeHandler}
                className="mt-2 w-full border rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-black"
                required
                min="0"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={changeHandler}
              rows={4}
              className="mt-2 w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Story */}
          <div>
            <label className="text-sm font-medium">The Story</label>
            <textarea
              name="story"
              value={form.story}
              onChange={changeHandler}
              rows={4}
              className="mt-2 w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Ingredients */}
          <div>
            <label className="text-sm font-medium">Ingredients</label>
            <textarea
              name="ingredients"
              value={form.ingredients}
              onChange={changeHandler}
              rows={3}
              className="mt-2 w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Fragrance Notes */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium">Top Notes</label>
              <textarea
                name="topNotes"
                value={form.topNotes}
                onChange={changeHandler}
                rows={4}
                placeholder="Bergamot, Lemon, Apple"
                className="mt-2 w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-1 focus:ring-black text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Heart Notes</label>
              <textarea
                name="heartNotes"
                value={form.heartNotes}
                onChange={changeHandler}
                rows={4}
                placeholder="Rose, Jasmine, Lavender"
                className="mt-2 w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-1 focus:ring-black text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Base Notes</label>
              <textarea
                name="baseNotes"
                value={form.baseNotes}
                onChange={changeHandler}
                rows={4}
                placeholder="Amber, Musk, Sandalwood"
                className="mt-2 w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-1 focus:ring-black text-sm"
              />
            </div>
          </div>

          {/* Product Images Upload */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">
                Product Images (Up to 3)
              </label>
              <span className="text-xs text-stone-500">
                {totalImagesCount} / 3 slots used
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Existing Images */}
              {existingImages.map((src, idx) => (
                <div
                  key={`existing-${idx}`}
                  className="relative aspect-square border rounded-lg overflow-hidden group bg-stone-50"
                >
                  <img
                    src={src}
                    alt={`Existing product image ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                    {idx === 0 ? "Main" : `Gallery ${idx + 1}`}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExistingImage(idx)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Newly Selected Image Previews */}
              {filePreviews.map((preview, idx) => (
                <div
                  key={`new-${idx}`}
                  className="relative aspect-square border rounded-lg overflow-hidden group bg-stone-50"
                >
                  <img
                    src={preview}
                    alt={`New upload preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                    New File
                  </div>
                  <button
                    type="button"
                    onClick={() => removeNewFile(idx)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* File Input Upload Slot */}
              {totalImagesCount < 3 && (
                <label className="border-2 border-dashed border-stone-300 hover:border-black rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer p-4 transition bg-stone-50/50 hover:bg-stone-50">
                  <Upload className="w-6 h-6 text-stone-400 mb-2" />
                  <span className="text-xs text-stone-600 font-medium text-center">
                    Upload Image
                  </span>
                  <span className="text-[10px] text-stone-400 text-center mt-1">
                    PNG, JPG, WEBP
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isNew"
                checked={form.isNew}
                onChange={changeHandler}
                className="w-4 h-4 accent-black rounded"
              />
              <span className="text-sm font-medium">New Arrival</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isBestseller"
                checked={form.isBestseller}
                onChange={changeHandler}
                className="w-4 h-4 accent-black rounded"
              />
              <span className="text-sm font-medium">Bestseller</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg border border-stone-300 hover:bg-stone-100 transition text-sm font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-8 py-3 rounded-lg bg-black text-white hover:bg-stone-800 transition text-sm font-medium"
            >
              {product ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}