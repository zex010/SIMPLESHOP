// client/src/utils/imageUtils.js
//
// Single source of truth for turning a MongoDB `product.image` value into
// a usable <img src>. Products may have:
//   - a complete Cloudflare R2 URL (new uploads)      -> use as-is
//   - an old relative Render/backend path              -> prepend API host
//   - nothing                                           -> fall back to placeholder
//
// Import this everywhere a product image is rendered instead of re-writing
// the same if/else in every page.

const API_HOST = "https://avernus-api.onrender.com";

export function resolveImage(src) {
  if (!src) return "/placeholder.png";

  // Already a complete URL (Cloudflare R2 or any other absolute host).
  if (/^https?:\/\//i.test(src)) {
    return src;
  }

  // Old-style relative path stored before R2 was introduced, e.g.
  // "/uploads/products/example.jpg"
  return `${API_HOST}${src}`;
}

// Normalizes the raw MongoDB category value ("men" / "Men" / "women" /
// "unisex" / etc.) into the label the UI displays. Does NOT touch the
// database value anywhere - display only.
export function getCategoryLabel(category) {
  const normalized = (category || "").trim().toLowerCase();

  if (normalized === "men") return "MASCULINE";
  if (normalized === "women") return "FEMININE";
  return "UNISEX";
}

// Some product names include suffixes like "Pour Femme" that can make an
// already-long name push a card's layout out of alignment. This only
// changes what's rendered on the card - the underlying MongoDB `name`
// field is never modified.
export function getDisplayName(name) {
  if (!name) return "";
  return name.replace(/\s*pour\s+femme\s*/gi, " ").replace(/\s+/g, " ").trim();
}