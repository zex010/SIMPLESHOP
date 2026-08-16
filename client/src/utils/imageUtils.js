export const resolveImage = (image) => {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  return image;
};

export const getDisplayName = (product) => {
  if (!product) return "";

  return (
    product.name ||
    product.title ||
    "Product"
  );
};