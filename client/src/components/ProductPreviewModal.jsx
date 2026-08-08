import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

function ProductPreviewModal({ product, closeModal }) {
  const navigate = useNavigate();

  const images = [product.image, product.image, product.image];

  const [activeImage, setActiveImage] = useState(product.image);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("100ml");

  // ============================================================
  // LOCK SCROLL & SYNC WITH BROWSER BACK BUTTON + ESCAPE KEY
  // ============================================================
  useEffect(() => {
    // Lock background scroll
    document.body.style.overflow = "hidden";

    // Close modal on ESC key
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    // Close modal when user clicks browser BACK button
    const handlePopState = () => {
      closeModal();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [closeModal]);

  const nextImage = () => {
    const next = (currentIndex + 1) % images.length;
    setCurrentIndex(next);
    setActiveImage(images[next]);
  };

  const previousImage = () => {
    const prev = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prev);
    setActiveImage(images[prev]);
  };

  const handleGoToProductPage = () => {
    closeModal();
    navigate(`/product/${product._id}`);
  };

  return (
    <div
      onClick={closeModal} // Click outside modal box to close
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()} // Stop click propagation inside modal
        className="relative w-full max-w-6xl h-[90vh] rounded-2xl overflow-hidden shadow-2xl bg-[#121212] grid lg:grid-cols-2"
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={closeModal}
          aria-label="Close modal"
          className="absolute top-5 right-5 z-30 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 transition text-white flex items-center justify-center cursor-pointer"
        >
          <X size={22} />
        </button>

        {/* IMAGE SECTION */}
        <div className="relative bg-black p-0 overflow-hidden h-64 lg:h-full">
          <img
            src={`http://192.168.10.6:5000${activeImage}`}
            alt={product.name}
            className="w-full h-full object-cover"
          />

          <button
            onClick={previousImage}
            aria-label="Previous image"
            className="absolute left-5 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center cursor-pointer transition"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={nextImage}
            aria-label="Next image"
            className="absolute right-5 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center cursor-pointer transition"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
            {images.map((_, index) => (
              <span
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  currentIndex === index ? "bg-white w-4" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="bg-[#171717] text-white p-6 md:p-10 flex flex-col overflow-y-auto">
          <div>
            <p className="uppercase tracking-[0.5em] text-xs text-gray-400">
              {product.brand}
            </p>

            <h1 className="mt-3 md:mt-5 text-3xl md:text-5xl font-serif">
              {product.name}
            </h1>

            <p className="mt-4 md:mt-6 text-2xl md:text-3xl font-light">
              ${product.price}
            </p>

            <p className="mt-6 text-gray-400 text-sm md:text-base leading-relaxed">
              {product.description}
            </p>

            {/* SIZE SELECTION */}
            <div className="mt-8">
              <p className="uppercase tracking-widest text-xs text-gray-400 mb-4">
                Select Size
              </p>

              <div className="flex gap-3">
                {["50ml", "100ml", "250ml"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 border text-xs md:text-sm tracking-wider uppercase transition cursor-pointer ${
                      selectedSize === size
                        ? "bg-white text-black border-white"
                        : "border-gray-700 text-gray-300 hover:border-gray-500"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* OLFACTORY NOTES */}
            <div className="mt-8 space-y-3 text-xs md:text-sm">
              <div>
                <span className="font-semibold text-white uppercase tracking-wider">
                  Top Notes:
                </span>
                <span className="text-gray-300 ml-2">Pineapple, Bergamot</span>
              </div>
              <div>
                <span className="font-semibold text-white uppercase tracking-wider">
                  Heart Notes:
                </span>
                <span className="text-gray-300 ml-2">Birch, Patchouli</span>
              </div>
              <div>
                <span className="font-semibold text-white uppercase tracking-wider">
                  Base Notes:
                </span>
                <span className="text-gray-300 ml-2">
                  Musk, Oakmoss, Ambergris
                </span>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-auto pt-8 space-y-3">
            <button className="w-full bg-white text-black py-4 flex items-center justify-center gap-3 uppercase tracking-[0.3em] text-xs hover:bg-stone-200 transition font-medium cursor-pointer">
              <ShoppingBag size={18} />
              Add to Cart
            </button>

            {/* LINK TO DETAILED PRODUCT PAGE */}
            <button
              onClick={handleGoToProductPage}
              className="w-full border border-stone-700 text-stone-300 py-3.5 flex items-center justify-center gap-2 uppercase tracking-[0.25em] text-[11px] hover:border-white hover:text-white transition cursor-pointer"
            >
              <span>View Full Product Page</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPreviewModal;