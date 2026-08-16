
// client/src/utils/imageUtils.js

export const resolveImage = (image) => {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  if (image.startsWith("/")) {
    return image;
  }

  return `/uploads/${image}`;
};

export const getDisplayName = (product) => {
  if (!product) return "AVERNUS";

  return (
    product.name ||
    product.title ||
    "AVERNUS"
  );
};

