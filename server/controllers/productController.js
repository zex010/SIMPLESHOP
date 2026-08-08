//const Product = require("../models/Product");
console.log("🔥 PRODUCT CONTROLLER LOADED");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// =======================
// Get All Products (Admin)
// =======================
const getAllProducts = async (req, res) => {
  try {
    console.log("HOST:", mongoose.connection.host);
    console.log("DATABASE:", mongoose.connection.name);
    console.log("COLLECTION:", Product.collection.name);
    console.log("COUNT:", await Product.countDocuments());

    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.log("Get Products Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// =======================
// Get Single Product By ID
// =======================
const getSingleProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

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

    console.log("Get Single Product Error:", error);

    // Malformed/invalid ObjectId strings throw a CastError here rather
    // than simply returning null, so surface that as a 404 too instead
    // of a 500.
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
// Create Product With Images
// =======================
const createProduct = async (req, res) => {
  try {

    console.log("========== CREATE PRODUCT ==========");
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);



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

      top,
      heart,
      base,

    } = req.body;



    // Validation

    if (!name || !brand || !category || !price) {

      return res.status(400).json({

        success:false,

        message:
        "Name, Brand, Category and Price are required."

      });

    }




    // Save uploaded images paths

    const uploadedImages = req.files
      ? req.files.map(
          (file)=> `/uploads/products/${file.filename}`
        )
      : [];




    const product = await Product.create({

      name,

      brand,

      category,

      collection,


      price:Number(price),

      stock:Number(stock || 0),


      description,

      story,

      ingredients,



      image:
      uploadedImages.length > 0
      ? uploadedImages[0]
      : "",



      images: uploadedImages,



      fragranceNotes:{

        top:
        top
        ? top.split(",")
        : [],


        heart:
        heart
        ? heart.split(",")
        : [],


        base:
        base
        ? base.split(",")
        : []

      },



      isNew:
      isNew === "true",



      isBestseller:
      isBestseller === "true"


    });




    res.status(201).json({

      success:true,

      message:"Product created successfully.",

      product

    });



  } catch(error){


    console.log(
      "Create Product Error:",
      error
    );


    res.status(500).json({

      success:false,

      message:error.message

    });


  }
};







// =======================
// Update Product With Images
// =======================
const updateProduct = async (req,res)=>{

  try{


    const {id}=req.params;



    const product =
    await Product.findById(id);



    if(!product){

      return res.status(404).json({

        success:false,

        message:"Product not found."

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

    }=req.body;




    let uploadedImages =
    product.images || [];



    if(req.files && req.files.length > 0){

      uploadedImages =
      req.files.map(

        file =>
        `/uploads/products/${file.filename}`

      );

    }




    product.name =
    name || product.name;


    product.brand =
    brand || product.brand;


    product.category =
    category || product.category;


    product.collection =
    collection || product.collection;


    product.price =
    price || product.price;


    product.stock =
    stock || product.stock;


    product.description =
    description || product.description;


    product.story =
    story || product.story;


    product.ingredients =
    ingredients || product.ingredients;



    product.image =
    uploadedImages[0] || product.image;



    product.images =
    uploadedImages;



    product.isNew =
    isNew === "true"
    ? true
    : product.isNew;



    product.isBestseller =
    isBestseller === "true"
    ? true
    : product.isBestseller;




    await product.save();




    res.status(200).json({

      success:true,

      message:"Product updated successfully.",

      product

    });



  }
  catch(error){


    console.log(
      "Update Product Error:",
      error
    );


    res.status(500).json({

      success:false,

      message:error.message

    });


  }

};







// =======================
// Delete Product
// =======================
const deleteProduct = async(req,res)=>{

  try{


    const {id}=req.params;


    const product =
    await Product.findById(id);



    if(!product){

      return res.status(404).json({

        success:false,

        message:"Product not found."

      });

    }



    await product.deleteOne();



    res.status(200).json({

      success:true,

      message:"Product deleted successfully."

    });



  }
  catch(error){


    console.log(
      "Delete Product Error:",
      error
    );


    res.status(500).json({

      success:false,

      message:error.message

    });


  }

};






module.exports = {

  getAllProducts,

  getSingleProduct,

  createProduct,

  updateProduct,

  deleteProduct,

};