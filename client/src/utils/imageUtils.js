
// client/src/utils/imageUtils.js

export const resolveImage = (image) => {
  if (!image) return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("/")) {
    return image;
  }

  return `/uploads/${image}`;
};

export const getDisplayName = (product) => {
  if (!product) return "";

  return (
    product.name ||
    product.title ||
    "AVERNUS"
  );
};

