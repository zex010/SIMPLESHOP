
import React, { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  X,
  Save,
  Power,
} from "lucide-react";

import heroApi from "../../utils/heroApi";

const emptyForm = {
  sectionKey: "",
  title: "",
  subtitle: "",
  description: "",
  isActive: true,
  image: null,
};

const sectionOptions = [
  {
    value: "men",
    label: "Men",
  },
  {
    value: "women",
    label: "Women",
  },
  {
    value: "collection",
    label: "Collection",
  },
  {
    value: "bestsellers",
    label: "Best Sellers",
  },
  {
    value: "new-arrivals",
    label: "New Arrivals",
  },
];

export default function HeroSections() {
  const [sections, setSections] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingSection, setEditingSection] =
    useState(null);

  const [form, setForm] = useState({
    ...emptyForm,
  });

  // ==========================
  // LOAD HERO SECTIONS
  // ==========================

  const loadSections = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await heroApi.get("/");

      setSections(data.sections || []);
    } catch (err) {
      console.error(
        "Load Hero Sections Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load hero sections"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // INITIAL LOAD
  // ==========================

  useEffect(() => {
    loadSections();
  }, []);

  // ==========================
  // ADD SECTION
  // ==========================

  const handleAdd = () => {
    setEditingSection(null);

    setForm({
      ...emptyForm,
    });

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  // ==========================
  // EDIT SECTION
  // ==========================

  const handleEdit = (section) => {
    setEditingSection(section);

    setForm({
      sectionKey: section.sectionKey || "",
      title: section.title || "",
      subtitle: section.subtitle || "",
      description: section.description || "",
      isActive:
        section.isActive !== undefined
          ? section.isActive
          : true,
      image: null,
    });

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  // ==========================
  // CLOSE MODAL
  // ==========================

  const handleClose = () => {
    if (saving) return;

    setShowModal(false);

    setEditingSection(null);

    setForm({
      ...emptyForm,
    });

    setError("");
  };

  // ==========================
  // FORM CHANGE
  // ==========================

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ==========================
  // IMAGE CHANGE
  // ==========================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Frontend validation
    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Image must be smaller than 5 MB."
      );

      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, PNG and WEBP images are allowed."
      );

      return;
    }

    setForm((prev) => ({
      ...prev,
      image: file,
    }));

    setError("");
    setSuccess("");
  };

  // ==========================
  // SAVE SECTION
  // ==========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // Validate section key
      if (!form.sectionKey.trim()) {
        setError("Please select a section.");

        setSaving(false);

        return;
      }

      // Validate title
      if (!form.title.trim()) {
        setError("Title is required.");

        setSaving(false);

        return;
      }

      const data = new FormData();

      data.append(
        "sectionKey",
        form.sectionKey
          .trim()
          .toLowerCase()
      );

      data.append(
        "title",
        form.title.trim()
      );

      data.append(
        "subtitle",
        form.subtitle.trim()
      );

      data.append(
        "description",
        form.description.trim()
      );

      data.append(
        "isActive",
        String(form.isActive)
      );

      // Only append image if a new image
      // has been selected
      if (form.image) {
        data.append(
          "image",
          form.image
        );
      }

      let response;

      // ==========================
      // UPDATE
      // ==========================

      if (editingSection) {
        response = await heroApi.put(
          `/${editingSection._id}`,
          data,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        setSections((prev) =>
          prev.map((section) =>
            section._id ===
            editingSection._id
              ? response.data.section
              : section
          )
        );

        setSuccess(
          "Hero section updated successfully."
        );
      }

      // ==========================
      // CREATE
      // ==========================

      else {
        response = await heroApi.post(
          "/",
          data,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        setSections((prev) => [
          response.data.section,
          ...prev,
        ]);

        setSuccess(
          "Hero section created successfully."
        );
      }

      setShowModal(false);

      setEditingSection(null);

      setForm({
        ...emptyForm,
      });
    } catch (err) {
      console.error(
        "Save Hero Section Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to save hero section."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================
  // DELETE
  // ==========================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this hero section?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await heroApi.delete(
        `/${id}`
      );

      setSections((prev) =>
        prev.filter(
          (section) =>
            section._id !== id
        )
      );

      setSuccess(
        "Hero section deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete Hero Section Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete hero section."
      );
    }
  };

  // ==========================
  // TOGGLE ACTIVE
  // ==========================

  const handleToggleActive = async (
    section
  ) => {
    try {
      setError("");
      setSuccess("");

      const data = new FormData();

      data.append(
        "sectionKey",
        section.sectionKey
      );

      data.append(
        "title",
        section.title
      );

      data.append(
        "subtitle",
        section.subtitle || ""
      );

      data.append(
        "description",
        section.description || ""
      );

      data.append(
        "isActive",
        String(!section.isActive)
      );

      const response =
        await heroApi.put(
          `/${section._id}`,
          data,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      setSections((prev) =>
        prev.map((item) =>
          item._id === section._id
            ? response.data.section
            : item
        )
      );
    } catch (err) {
      console.error(
        "Toggle Hero Section Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update section status."
      );
    }
  };

  // ==========================
  // IMAGE PREVIEW
  // ==========================

  const getPreviewImage = () => {
    if (form.image) {
      return URL.createObjectURL(
        form.image
      );
    }

    if (
      editingSection?.imageUrl
    ) {
      return editingSection.imageUrl;
    }

    return "";
  };

  // ==========================
  // RENDER
  // ==========================

  return (
    <div className="space-y-8">
      {/* ==========================
          HEADER
      ========================== */}

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
            Content Management
          </p>

          <h2 className="mt-2 font-serif text-3xl tracking-wide">
            Hero Sections
          </h2>

          <p className="mt-2 text-sm text-stone-500">
            Manage the header images and
            content for your store pages.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-full text-xs uppercase tracking-[0.2em] hover:bg-stone-800 transition"
        >
          <Plus size={15} />

          Add Section
        </button>
      </div>

      {/* ==========================
          ERROR
      ========================== */}

      {error && (
        <div className="border border-red-200 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* ==========================
          SUCCESS
      ========================== */}

      {success && (
        <div className="border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl text-sm">
          {success}
        </div>
      )}

      {/* ==========================
          LOADING
      ========================== */}

      {loading ? (
        <div className="py-16 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-stone-400">
            Loading Hero Sections...
          </p>
        </div>
      ) : sections.length === 0 ? (
        /* ==========================
            EMPTY STATE
        ========================== */

        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center">
          <ImageIcon
            size={32}
            className="mx-auto text-stone-300"
          />

          <h3 className="mt-4 font-serif text-xl">
            No Hero Sections
          </h3>

          <p className="mt-2 text-sm text-stone-500">
            Create your first hero section.
          </p>

          <button
            type="button"
            onClick={handleAdd}
            className="mt-6 bg-black text-white px-5 py-3 rounded-full text-xs uppercase tracking-[0.2em]"
          >
            Add Hero Section
          </button>
        </div>
      ) : (
        /* ==========================
            SECTION GRID
        ========================== */

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sections.map((section) => (
            <div
              key={section._id}
              className="bg-white border border-stone-200 rounded-2xl overflow-hidden"
            >
              {/* IMAGE */}

              <div className="relative aspect-[16/9] bg-stone-100">
                {section.imageUrl ? (
                  <img
                    src={section.imageUrl}
                    alt={
                      section.title
                    }
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-300">
                    <ImageIcon size={35} />

                    <span className="mt-2 text-xs uppercase tracking-widest">
                      No Image
                    </span>
                  </div>
                )}

                {/* STATUS */}

                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.15em] ${
                      section.isActive
                        ? "bg-white text-black"
                        : "bg-black/70 text-white"
                    }`}
                  >
                    {section.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>
              </div>

              {/* CONTENT */}

              <div className="p-6">
                <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400">
                  {section.sectionKey}
                </p>

                <h3 className="mt-2 font-serif text-xl">
                  {section.title}
                </h3>

                {section.subtitle && (
                  <p className="mt-3 text-sm text-stone-600">
                    {section.subtitle}
                  </p>
                )}

                {section.description && (
                  <p className="mt-2 text-xs leading-5 text-stone-400 line-clamp-2">
                    {section.description}
                  </p>
                )}

                {/* ACTIONS */}

                <div className="mt-6 pt-5 border-t border-stone-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleToggleActive(
                        section
                      )
                    }
                    className="flex-1 flex items-center justify-center gap-2 border border-stone-200 px-3 py-2.5 rounded-full text-[10px] uppercase tracking-[0.15em] hover:border-black transition"
                  >
                    <Power size={13} />

                    {section.isActive
                      ? "Disable"
                      : "Activate"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(section)
                    }
                    className="flex items-center justify-center border border-stone-200 w-10 h-10 rounded-full hover:bg-black hover:text-white hover:border-black transition"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(
                        section._id
                      )
                    }
                    className="flex items-center justify-center border border-stone-200 w-10 h-10 rounded-full text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==========================
          ADD / EDIT MODAL
      ========================== */}

      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 bg-white border-b border-stone-100 px-6 py-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400">
                  {editingSection
                    ? "Edit Hero Section"
                    : "Create Hero Section"}
                </p>

                <h3 className="mt-1 font-serif text-2xl">
                  {editingSection
                    ? editingSection.title
                    : "New Hero Section"}
                </h3>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center hover:bg-black hover:text-white transition"
              >
                <X size={17} />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-6"
            >
              {/* SECTION */}

              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-2">
                  Section
                </label>

                <select
                  value={
                    form.sectionKey
                  }
                  onChange={(e) =>
                    handleChange(
                      "sectionKey",
                      e.target.value
                    )
                  }
                  disabled={
                    !!editingSection
                  }
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black disabled:bg-stone-50"
                >
                  <option value="">
                    Select Section
                  </option>

                  {sectionOptions.map(
                    (option) => (
                      <option
                        key={
                          option.value
                        }
                        value={
                          option.value
                        }
                      >
                        {option.label}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* TITLE */}

              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-2">
                  Title
                </label>

                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    handleChange(
                      "title",
                      e.target.value
                    )
                  }
                  placeholder="MEN"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black"
                />
              </div>

              {/* SUBTITLE */}

              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-2">
                  Subtitle
                </label>

                <input
                  type="text"
                  value={
                    form.subtitle
                  }
                  onChange={(e) =>
                    handleChange(
                      "subtitle",
                      e.target.value
                    )
                  }
                  placeholder="Discover the collection"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-2">
                  Description
                </label>

                <textarea
                  rows="4"
                  value={
                    form.description
                  }
                  onChange={(e) =>
                    handleChange(
                      "description",
                      e.target.value
                    )
                  }
                  placeholder="Write a short description..."
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black resize-none"
                />
              </div>

              {/* IMAGE */}

              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-2">
                  Hero Image
                </label>

                <div className="border border-dashed border-stone-300 rounded-xl p-4">
                  {getPreviewImage() ? (
                    <div className="mb-4">
                      <img
                        src={getPreviewImage()}
                        alt="Hero preview"
                        className="w-full h-56 object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="h-40 flex flex-col items-center justify-center text-stone-300">
                      <ImageIcon
                        size={35}
                      />

                      <p className="mt-2 text-xs uppercase tracking-widest">
                        No Image Selected
                      </p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      handleImageChange
                    }
                    className="w-full text-sm"
                  />

                  <p className="mt-2 text-[11px] text-stone-400">
                    JPG, PNG or WEBP.
                    Maximum 5 MB.
                  </p>
                </div>
              </div>

              {/* ACTIVE */}

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    form.isActive
                  }
                  onChange={(e) =>
                    handleChange(
                      "isActive",
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 accent-black"
                />

                <span className="text-sm">
                  Section is active
                </span>
              </label>

              {/* BUTTONS */}

              <div className="pt-4 border-t border-stone-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={
                    handleClose
                  }
                  disabled={saving}
                  className="px-5 py-3 rounded-full border border-stone-200 text-xs uppercase tracking-[0.2em] hover:border-black transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white text-xs uppercase tracking-[0.2em] hover:bg-stone-800 transition disabled:opacity-50"
                >
                  <Save size={14} />

                  {saving
                    ? "Saving..."
                    : editingSection
                    ? "Update Section"
                    : "Create Section"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

