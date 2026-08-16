
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

  // 50ml selected by default
  const [selectedSize, setSelectedSize] = useState("50ml");

  // ============================================================
  // MODAL CONTROLS
  // ============================================================

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

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

  // ============================================================
  // IMAGE CONTROLS
  // ============================================================

  const nextImage = () => {
    const next = (currentIndex + 1) % images.length;

    setCurrentIndex(next);
    setActiveImage(images[next]);
  };

  const previousImage = () => {
    const prev =
      (currentIndex - 1 + images.length) % images.length;

    setCurrentIndex(prev);
    setActiveImage(images[prev]);
  };

  // ============================================================
  // PRODUCT PAGE
  // ============================================================

  const handleGoToProductPage = () => {
    closeModal();
    navigate(`/product/${product._id}`);
  };

  return (
    <div
      onClick={closeModal}
      className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
    >
      {/* ======================================================
          MODAL
      ====================================================== */}

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[900px] h-[78vh] max-h-[650px] bg-[#171717] overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]"
      >
        {/* ====================================================
            CLOSE
        ==================================================== */}

        <button
          onClick={closeModal}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-30 w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition"
        >
          <X size={19} strokeWidth={1.5} />
        </button>

        {/* ====================================================
            IMAGE
        ==================================================== */}

        <div className="relative h-[42vh] min-h-[280px] lg:h-full bg-black">
          <img
            src={`https://avernus-api.onrender.com${activeImage}`}
            alt={product.name}
            className="w-full h-full object-cover"
          />

          {/* LEFT ARROW */}

          <button
            onClick={previousImage}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition"
          >
            <ChevronLeft size={21} strokeWidth={1.5} />
          </button>

          {/* RIGHT ARROW */}

          <button
            onClick={nextImage}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition"
          >
            <ChevronRight size={21} strokeWidth={1.5} />
          </button>

          {/* IMAGE INDICATORS */}

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {images.map((_, index) => (
              <span
                key={index}
                className={`block h-[3px] transition-all duration-300 ${
                  currentIndex === index
                    ? "w-6 bg-white"
                    : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ====================================================
            PRODUCT DETAILS
        ==================================================== */}

        <div className="relative bg-[#171717] text-white px-7 py-8 md:px-9 md:py-9 flex flex-col overflow-y-auto">

          {/* PRODUCT INFORMATION */}

          <div className="max-w-sm">

            {/* BRAND */}

            <p className="uppercase tracking-[0.3em] text-[9px] text-white/45">
              {product.brand || "AVERNUS"}
            </p>

            {/* PRODUCT NAME */}

            <h1 className="mt-3 font-serif text-[27px] md:text-[31px] font-normal leading-tight tracking-wide">
              {product.name}
            </h1>

            {/* PRICE */}

            <p className="mt-3 text-[15px] font-light tracking-wide text-white/90">
              ${product.price}
            </p>

            {/* SMALL DIVIDER */}

            <div className="w-8 h-px bg-white/20 mt-6 mb-5" />

            {/* DESCRIPTION */}

            <p className="text-[11px] leading-[1.8] text-white/55">
              {product.description}
            </p>

            {/* =================================================
                SIZE
            ================================================= */}

            <div className="mt-7">

              <p className="uppercase tracking-[0.22em] text-[9px] text-white/45 mb-3">
                Size
              </p>

              <div className="flex items-center gap-2">
                {["50ml", "100ml", "250ml"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[65px] px-3 py-2 text-[9px] tracking-[0.15em] border transition ${
                      selectedSize === size
                        ? "border-white bg-white text-black"
                        : "border-white/20 text-white/55 hover:border-white/50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

            </div>

            {/* =================================================
                FRAGRANCE NOTES
            ================================================= */}

            <div className="mt-7">

              <p className="uppercase tracking-[0.22em] text-[9px] text-white/45 mb-4">
                Fragrance Notes
              </p>

              <div className="space-y-3">

                <div>
                  <p className="uppercase tracking-[0.12em] text-[8px] text-white/40">
                    Top
                  </p>

                  <p className="mt-1 text-[10px] text-white/70">
                    Pineapple, Bergamot
                  </p>
                </div>

                <div>
                  <p className="uppercase tracking-[0.12em] text-[8px] text-white/40">
                    Heart
                  </p>

                  <p className="mt-1 text-[10px] text-white/70">
                    Birch, Patchouli
                  </p>
                </div>

                <div>
                  <p className="uppercase tracking-[0.12em] text-[8px] text-white/40">
                    Base
                  </p>

                  <p className="mt-1 text-[10px] text-white/70">
                    Musk, Oakmoss, Ambergris
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* ====================================================
              BUTTONS
          ==================================================== */}

          <div className="mt-auto pt-8 max-w-sm">

            {/* ADD TO CART */}

            <button
              className="w-full h-11 bg-white text-black flex items-center justify-center gap-3 uppercase tracking-[0.22em] text-[9px] font-medium hover:bg-white/90 transition"
            >
              <ShoppingBag size={14} strokeWidth={1.5} />
              Add to Cart
            </button>

            {/* VIEW FULL PAGE */}

            <button
              onClick={handleGoToProductPage}
              className="w-full mt-2.5 h-10 border border-white/15 text-white/60 flex items-center justify-center gap-2 uppercase tracking-[0.18em] text-[8px] hover:border-white/40 hover:text-white transition"
            >
              View Full Product
              <ArrowRight size={12} strokeWidth={1.5} />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPreviewModal;

