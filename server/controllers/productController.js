console.log("🔥 PRODUCT CONTROLLER LOADED");

const Product = require("../models/Product");
const mongoose = require("mongoose");

const {
  r2,
  PutObjectCommand,
  BUCKET_NAME,
} = require("../config/r2");

// =======================
// R2 UPLOAD HELPER
// =======================

const uploadToR2 = async (file) => {
  const safeName = file.originalname
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "");

  const key = `products/${Date.now()}-${safeName}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  /*
    R2 public URL.

    IMPORTANT:
    This requires your R2 bucket to have a public/custom
    domain configured.

    We will configure this after the upload itself works.
  */

  const publicUrl =
    `${process.env.R2_PUBLIC_URL}/${key}`;

  return publicUrl;
};

// =======================
// GET ALL PRODUCTS
// =======================

const getAllProducts = async (req, res) => {
  try {
    console.log("HOST:", mongoose.connection.host);
    console.log("DATABASE:", mongoose.connection.name);
    console.log("COLLECTION:", Product.collection.name);
    console.log(
      "COUNT:",
      await Product.countDocuments()
    );

    const products = await Product
      .find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });

  } catch (error) {
    console.log("❌ GET PRODUCTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// GET SINGLE PRODUCT
// =======================

const getSingleProduct = async (req, res) => {
  try {
    const product =
      await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    console.log(
      "❌ GET SINGLE PRODUCT ERROR:",
      error
    );

    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// CREATE PRODUCT
// =======================

const createProduct = async (req, res) => {
  try {
    console.log(
      "========== CREATE PRODUCT =========="
    );

    console.log("BODY:", req.body);

    console.log(
      "FILES:",
      req.files?.length || 0
    );

    const {
      name,
      brand,
      category,
      collection,
      price,
      stock,
      description,
      story,
      ingredients,
      isNew,
      isBestseller,
      fragranceNotes,
    } = req.body;

    // =======================
    // VALIDATION
    // =======================

    if (
      !name ||
      !brand ||
      !category ||
      !price
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, Brand, Category and Price are required.",
      });
    }

    // =======================
    // FRAGRANCE NOTES
    // =======================

    let notes = {
      top: [],
      heart: [],
      base: [],
    };

    if (fragranceNotes) {
      try {
        notes =
          JSON.parse(fragranceNotes);
      } catch (error) {
        console.log(
          "⚠️ Invalid fragranceNotes JSON"
        );
      }
    }

    // =======================
    // UPLOAD IMAGES TO R2
    // =======================

    const uploadedImages = [];

    if (
      req.files &&
      req.files.length > 0
    ) {
      console.log(
        "☁️ Uploading images to R2..."
      );

      for (const file of req.files) {
        console.log(
          "Uploading:",
          file.originalname
        );

        const imageUrl =
          await uploadToR2(file);

        uploadedImages.push(
          imageUrl
        );

        console.log(
          "✅ R2 uploaded:",
          imageUrl
        );
      }
    }

    // =======================
    // CREATE PRODUCT
    // =======================

    const product =
      await Product.create({
        name,

        brand,

        category,

        collection:
          collection || "",

        price:
          Number(price),

        stock:
          Number(stock || 0),

        description:
          description || "",

        story:
          story || "",

        ingredients:
          ingredients || "",

        image:
          uploadedImages.length > 0
            ? uploadedImages[0]
            : "",

        images:
          uploadedImages,

        fragranceNotes: {
          top:
            notes.top || [],

          heart:
            notes.heart || [],

          base:
            notes.base || [],
        },

        isNew:
          isNew === "true",

        isBestseller:
          isBestseller === "true",
      });

    console.log(
      "✅ PRODUCT CREATED:",
      product._id
    );

    res.status(201).json({
      success: true,
      message:
        "Product created successfully.",
      product,
    });

  } catch (error) {
    console.log(
      "❌ CREATE PRODUCT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// UPDATE PRODUCT
// =======================

const updateProduct = async (
  req,
  res
) => {
  try {
    console.log(
      "========== UPDATE PRODUCT =========="
    );

    console.log(
      "BODY:",
      req.body
    );

    console.log(
      "FILES:",
      req.files?.length || 0
    );

    const { id } = req.params;

    // =======================
    // FIND PRODUCT
    // =======================

    const product =
      await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const {
      name,
      brand,
      category,
      collection,
      price,
      stock,
      description,
      story,
      ingredients,
      isNew,
      isBestseller,
      fragranceNotes,
      existingImages,
    } = req.body;

    // =======================
    // EXISTING IMAGES
    // =======================

    let images = [];

    if (existingImages) {
      try {
        images =
          JSON.parse(existingImages);
      } catch (error) {
        console.log(
          "⚠️ Invalid existingImages JSON"
        );

        images =
          product.images || [];
      }
    } else {
      images =
        product.images || [];
    }

    // =======================
    // UPLOAD NEW IMAGES
    // =======================

    if (
      req.files &&
      req.files.length > 0
    ) {
      console.log(
        "☁️ Uploading new images to R2..."
      );

      for (const file of req.files) {
        console.log(
          "Uploading:",
          file.originalname
        );

        const imageUrl =
          await uploadToR2(file);

        images.push(imageUrl);

        console.log(
          "✅ R2 uploaded:",
          imageUrl
        );
      }
    }

    // Maximum 3 images

    images =
      images.slice(0, 3);

    // =======================
    // FRAGRANCE NOTES
    // =======================

    let notes =
      product.fragranceNotes || {
        top: [],
        heart: [],
        base: [],
      };

    if (fragranceNotes) {
      try {
        notes =
          JSON.parse(
            fragranceNotes
          );
      } catch (error) {
        console.log(
          "⚠️ Invalid fragranceNotes JSON"
        );
      }
    }

    // =======================
    // UPDATE DATA
    // =======================

    product.name =
      name !== undefined
        ? name
        : product.name;

    product.brand =
      brand !== undefined
        ? brand
        : product.brand;

    product.category =
      category !== undefined
        ? category
        : product.category;

    product.collection =
      collection !== undefined
        ? collection
        : product.collection;

    product.price =
      price !== undefined
        ? Number(price)
        : product.price;

    product.stock =
      stock !== undefined
        ? Number(stock)
        : product.stock;

    product.description =
      description !== undefined
        ? description
        : product.description;

    product.story =
      story !== undefined
        ? story
        : product.story;

    product.ingredients =
      ingredients !== undefined
        ? ingredients
        : product.ingredients;

    // =======================
    // UPDATE IMAGES
    // =======================

    product.images =
      images;

    product.image =
      images.length > 0
        ? images[0]
        : "";

    // =======================
    // FRAGRANCE NOTES
    // =======================

    product.fragranceNotes = {
      top:
        notes.top || [],

      heart:
        notes.heart || [],

      base:
        notes.base || [],
    };

    // =======================
    // FLAGS
    // =======================

    product.isNew =
      isNew === "true";

    product.isBestseller =
      isBestseller === "true";

    // =======================
    // SAVE
    // =======================

    await product.save();

    console.log(
      "✅ PRODUCT UPDATED:",
      product._id
    );

    res.status(200).json({
      success: true,
      message:
        "Product updated successfully.",
      product,
    });

  } catch (error) {
    console.log(
      "❌ UPDATE PRODUCT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// DELETE PRODUCT
// =======================

const deleteProduct = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    const product =
      await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    await product.deleteOne();

    console.log(
      "✅ PRODUCT DELETED:",
      id
    );

    res.status(200).json({
      success: true,
      message:
        "Product deleted successfully.",
    });

  } catch (error) {
    console.log(
      "❌ DELETE PRODUCT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// EXPORT
// =======================

module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};