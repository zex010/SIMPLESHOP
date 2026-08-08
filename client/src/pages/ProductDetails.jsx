import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Star, ChevronDown, ShoppingBag, Check } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useShop } from "../context/ShopContext";

/* ============================================================
   DEMO CATALOGUE
   Used whenever the backend has no record for the requested id,
   or the API call fails, so the page always has something rich
   to show while real product data is wired up.
   ============================================================ */
const DEMO_PRODUCTS = [
  {
    _id: "avernus-aetheria",
    name: "Aetheria",
    brand: "AVERNUS",
    concentration: "Eau de Parfum",
    price: 220,
    rating: 4.8,
    isNew: true,
    description:
      "A luminous opening of citrus and pear gives way to a heart of jasmine and iris, settling into a warm veil of white musk and cashmere wood. Aetheria was composed to feel like sunlight caught in glass — bright, weightless, and quietly radiant.",
    story:
      "Aetheria began as a study of early morning light over the Mediterranean coast. Our perfumers spent two years refining the balance between the sheer citrus opening and the soft, skin-like musk base, aiming for a fragrance that reveals itself slowly rather than announcing itself all at once.",
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Citral. Crafted without parabens or phthalates.",
    notes: {
      top: ["Sicilian Bergamot", "Nashi Pear", "Pink Pepper"],
      heart: ["Jasmine Sambac", "Iris Root", "Orange Blossom"],
      base: ["White Musk", "Cashmere Wood", "Ambrette"],
    },
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1615368144592-e2c2d4b3d8f3?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    _id: "avernus-celestial-oud",
    name: "Celestial Oud",
    brand: "AVERNUS",
    concentration: "Pure Oud Parfum",
    price: 340,
    rating: 4.9,
    isNew: true,
    description:
      "A commanding blend of rare oud, dark rose, and smoked woods. Celestial Oud is rich, resinous, and unapologetically opulent — built for those drawn to fragrances with real presence and remarkable longevity.",
    story:
      "Sourced from sustainably managed Agarwood plantations, the oud at the heart of this composition is aged for depth before being paired with Bulgarian rose and a whisper of incense, echoing the ceremonial fragrances of centuries past.",
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Eugenol, Benzyl Benzoate, Farnesol. Crafted without parabens or phthalates.",
    notes: {
      top: ["Saffron", "Black Pepper", "Bergamot"],
      heart: ["Bulgarian Rose", "Oud Wood", "Incense"],
      base: ["Amber", "Sandalwood", "Leather"],
    },
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    _id: "avernus-velvet-moss",
    name: "Velvet Moss",
    brand: "AVERNUS",
    concentration: "Eau de Parfum",
    price: 195,
    rating: 4.6,
    isNew: false,
    description:
      "An earthy, green fragrance layered with soft florals and a mossy, forest-floor base. Velvet Moss is contemplative and grounded — an ode to quiet walks through old woodland after rain.",
    story:
      "Inspired by the damp undergrowth of the Vosges forest, Velvet Moss pairs oakmoss and vetiver with a delicate violet heart, resulting in a scent that feels both cultivated and completely natural.",
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Coumarin, Geraniol, Linalool. Crafted without parabens or phthalates.",
    notes: {
      top: ["Green Fig Leaf", "Cardamom", "Bergamot"],
      heart: ["Violet", "Geranium", "Clary Sage"],
      base: ["Oakmoss", "Vetiver", "Cedarwood"],
    },
    images: [
      "https://images.unsplash.com/photo-1615529162924-f8605388461d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524634126442-357e0eac3c14?auto=format&fit=crop&w=1200&q=80",
    ],
  },
];

const DEFAULT_NOTES = { top: ["—"], heart: ["—"], base: ["—"] };

const SIZE_OPTIONS = [
  { label: "30ML", multiplier: 0.5 },
  { label: "50ML", multiplier: 0.72 },
  { label: "100ML", multiplier: 1 },
];

function getDemoProduct(id) {
  return DEMO_PRODUCTS.find((p) => p._id === id) || DEMO_PRODUCTS[0];
}

// Fills in any fields a real backend record might not yet have
// (notes, story, concentration, rating) so the layout never breaks.
function normalizeProduct(raw) {
  const fallback = getDemoProduct(raw._id);

  return {
    _id: raw._id,
    name: raw.name || fallback.name,
    brand: "AVERNUS",
    concentration: raw.concentration || fallback.concentration,
    price:
      (typeof raw.price === "string"
        ? parseFloat(raw.price.replace(/[^0-9.]/g, ""))
        : Number(raw.price)) || fallback.price,
    rating: raw.rating || fallback.rating,
    isNew: raw.isNew ?? fallback.isNew,
    description: raw.description || fallback.description,
    story: raw.story || fallback.story,
    ingredients: raw.ingredients || fallback.ingredients,
    notes: raw.notes || fallback.notes || DEFAULT_NOTES,
    images:
      raw.images?.length > 0
        ? raw.images
        : raw.image
        ? [raw.image]
        : fallback.images,
  };
}

// 1. Updated image resolver to support placeholders and strip leading slashes
function resolveImageSrc(src) {
  if (!src) return "/placeholder.jpg";

  if (src.startsWith("http")) {
    return src;
  }

  return `https://avernus-api.onrender.com/${src.replace(/^\/+/, "")}`;
}

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Connected to ShopContext
  const { addToCart, wishlist, addToWishlist, removeFromWishlist } = useShop();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("50ML");
  const [activeImage, setActiveImage] = useState(0);
  const [imageFading, setImageFading] = useState(false);
  const [openSection, setOpenSection] = useState("top");
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setActiveImage(0);

    fetch(`https://avernus-api.onrender.com/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const found = data.product || data.data || data;
        setProduct(found?.name ? normalizeProduct(found) : normalizeProduct(getDemoProduct(id)));
      })
      .catch(() => {
        if (!cancelled) setProduct(normalizeProduct(getDemoProduct(id)));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="h-[60vh] flex items-center justify-center font-serif text-sm uppercase tracking-[0.5em] text-stone-400">
          Loading...
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images;
  const sizeInfo = SIZE_OPTIONS.find((s) => s.label === selectedSize) || SIZE_OPTIONS[1];
  const displayedPrice = Math.round(product.price * sizeInfo.multiplier);
  const roundedRating = Math.round(product.rating);

  // Check if item currently exists in wishlist context
  const isWishlisted = wishlist?.some((p) => p._id === product._id) || false;

  const handleThumbnailClick = (index) => {
    if (index === activeImage) return;
    setImageFading(true);
    setTimeout(() => {
      setActiveImage(index);
      setImageFading(false);
    }, 150);
  };

  // 2. Updated handleAddToBag to preserve full product details + log
  const handleAddToBag = () => {
    const cartProduct = {
      ...product,
      _id: product._id,
      name: product.name,
      brand: product.brand,
      concentration: product.concentration,
      price: displayedPrice,
      image: images[0],
      selectedSize,
      qty: 1,
    };

    console.log("Cart Product:", cartProduct);

    addToCart(cartProduct);

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  // Adds the item to the cart (same shape as Add to Bag) and jumps
  // straight to checkout, skipping the cart page.
  const handleBuyNow = () => {
    const cartProduct = {
      ...product,
      _id: product._id,
      name: product.name,
      brand: product.brand,
      concentration: product.concentration,
      price: displayedPrice,
      image: images[0],
      selectedSize,
      qty: 1,
    };

    addToCart(cartProduct);
    navigate("/checkout");
  };

  const toggleSection = (key) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  const accordionItems = [
    { key: "top", title: "Top Notes", content: product.notes.top?.join(", ") },
    { key: "heart", title: "Heart Notes", content: product.notes.heart?.join(", ") },
    { key: "base", title: "Base Notes", content: product.notes.base?.join(", ") },
    { key: "story", title: "The Story", content: product.story },
    { key: "ingredients", title: "Ingredients", content: product.ingredients },
    {
      key: "shipping",
      title: "Shipping & Returns",
      content:
        "Complimentary shipping on all orders. Returns accepted within 30 days of delivery, provided the seal is intact.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-stone-900 antialiased">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
        {/* ================= LEFT: GALLERY ================= */}
        <div>
          <div className="relative w-full aspect-square bg-[#f8f8f8] overflow-hidden">
            {product.isNew && (
              <span className="absolute top-5 left-5 z-10 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.35em] shadow-sm">
                New
              </span>
            )}
            <img
              src={resolveImageSrc(images[activeImage])}
              alt={product.name}
              className={`w-full h-full object-contain p-8 md:p-14 transition-opacity duration-150 ${
                imageFading ? "opacity-0" : "opacity-100"
              }`}
            />
          </div>

          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 sm:grid-cols-5 gap-3">
              {images.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleThumbnailClick(index)}
                  aria-label={`View image ${index + 1}`}
                  className={`aspect-square bg-[#f8f8f8] overflow-hidden border transition-colors cursor-pointer ${
                    activeImage === index
                      ? "border-stone-900"
                      : "border-transparent hover:border-stone-300"
                  }`}
                >
                  <img
                    src={resolveImageSrc(img)}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-contain p-2"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================= RIGHT: DETAILS ================= */}
        <div className="flex flex-col lg:pt-2">
          <p className="uppercase tracking-[0.35em] text-xs text-stone-400">
            {product.concentration}
          </p>

          <h1 className="mt-3 font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.15] tracking-tight">
            AVERNUS — {product.name}
          </h1>

          <div className="flex items-center gap-2 mt-5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                size={14}
                strokeWidth={1.5}
                className={n <= roundedRating ? "fill-stone-900 text-stone-900" : "text-stone-300"}
              />
            ))}
            <span className="text-xs text-stone-400 tracking-wide">{product.rating.toFixed(1)}</span>
          </div>

          <p className="mt-6 font-serif text-2xl md:text-3xl">${displayedPrice}</p>

          <p className="mt-6 text-stone-600 text-sm md:text-base leading-relaxed max-w-md">
            {product.description}
          </p>

          {/* SIZE SELECTOR PILLS */}
          <div className="mt-9">
            <p className="uppercase text-[11px] tracking-[0.3em] text-stone-400 mb-3">Size</p>
            <div className="flex gap-3">
              {SIZE_OPTIONS.map((size) => (
                <button
                  key={size.label}
                  type="button"
                  onClick={() => setSelectedSize(size.label)}
                  className={`px-5 py-2.5 rounded-full text-xs font-medium tracking-[0.15em] transition-all duration-200 cursor-pointer ${
                    selectedSize === size.label
                      ? "bg-black text-white"
                      : "bg-white text-stone-700 border border-stone-300 hover:border-stone-900"
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* ADD TO BAG + BUY NOW + WISHLIST */}
          <div className="mt-9 flex items-center gap-3">
            <button
              type="button"
              onClick={handleAddToBag}
              className="flex-1 inline-flex items-center justify-center gap-3 bg-black text-white py-4 uppercase tracking-[0.25em] text-xs font-semibold transition-all duration-300 hover:bg-stone-800 active:scale-[0.99] cursor-pointer"
            >
              {justAdded ? (
                <>
                  <Check size={16} />
                  Added to Bag
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  Add to Bag
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 inline-flex items-center justify-center gap-3 border border-black text-black py-4 uppercase tracking-[0.25em] text-xs font-semibold transition-all duration-300 hover:bg-black hover:text-white active:scale-[0.99] cursor-pointer"
            >
              Buy Now
            </button>

            <button
              type="button"
              onClick={() =>
                isWishlisted ? removeFromWishlist(product._id) : addToWishlist(product)
              }
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={`h-[52px] w-[52px] shrink-0 flex items-center justify-center border transition-all duration-200 cursor-pointer ${
                isWishlisted
                  ? "bg-black border-black text-white"
                  : "border-stone-300 text-stone-700 hover:border-stone-900"
              }`}
            >
              <Heart size={18} className={isWishlisted ? "fill-current" : ""} />
            </button>
          </div>

          {/* FRAGRANCE PYRAMID + STORY ACCORDION */}
          <div className="mt-12 border-t border-stone-200">
            {accordionItems.map((item) => (
              <div key={item.key} className="border-b border-stone-200">
                <button
                  type="button"
                  onClick={() => toggleSection(item.key)}
                  className="w-full flex items-center justify-between py-5 text-left cursor-pointer"
                >
                  <span className="uppercase tracking-[0.2em] text-xs md:text-sm font-medium text-stone-900">
                    {item.title}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-stone-500 transition-transform duration-300 ${
                      openSection === item.key ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    openSection === item.key ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 text-sm text-stone-600 leading-relaxed">{item.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ProductDetails;