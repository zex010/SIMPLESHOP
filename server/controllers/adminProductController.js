const Product = require("../models/Product");
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

  return `${process.env.R2_PUBLIC_URL}/${key}`;
};


// =======================
// GET ALL PRODUCTS
// =======================

const getAllProducts = async (req, res) => {

  try {

    const products = await Product.find()
      .sort({ createdAt: -1 });


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
// CREATE PRODUCT
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

      fragranceNotes,

      isNew,

      isBestseller,


    } = req.body;




    if (!name || !brand || !category || !price) {


      return res.status(400).json({

        success:false,

        message:
        "Name, Brand, Category and Price are required."

      });


    }





    // IMAGE UPLOAD

    let uploadedImages = [];


    if(req.files && req.files.length > 0){

      for (const file of req.files) {

        const imageUrl = await uploadToR2(file);

        uploadedImages.push(imageUrl);

      }

    }





    // FRAGRANCE NOTES

    let notes = {

      top:[],

      heart:[],

      base:[]

    };


    if(fragranceNotes){

      try{

        notes = JSON.parse(fragranceNotes);

      }
      catch(error){

        console.log("Notes JSON Error");

      }

    }





    const product = await Product.create({

      name,

      brand,

      category,

      collection: collection || "",


      price:Number(price),


      stock:Number(stock || 0),



      description: description || "",


      story: story || "",


      ingredients: ingredients || "",




      image:

      uploadedImages.length > 0

      ? uploadedImages[0]

      : "",




      images: uploadedImages,





      fragranceNotes:{


        top: notes.top || [],


        heart: notes.heart || [],


        base: notes.base || [],


      },





      isNew:

      isNew === "true",




      isBestseller:

      isBestseller === "true",


    });





    res.status(201).json({

      success:true,

      message:
      "Product created successfully.",

      product,

    });




  } catch(error) {


    console.log(
      "CREATE PRODUCT ERROR:",
      error
    );


    res.status(500).json({

      success:false,

      message:error.message,

    });


  }

};







// =======================
// UPDATE PRODUCT
// =======================

const updateProduct = async (req,res)=>{


  try{


    console.log("UPDATE BODY:",req.body);
    console.log("UPDATE FILES:",req.files);



    const product = await Product.findById(
      req.params.id
    );



    if(!product){

      return res.status(404).json({

        success:false,

        message:"Product not found."

      });

    }




    // Keep existing images the admin didn't remove

    let images = [];

    if (req.body.existingImages) {

      try {

        images = JSON.parse(req.body.existingImages);

      } catch (error) {

        console.log("Invalid existingImages JSON");

        images = product.images || [];

      }

    } else {

      images = product.images || [];

    }



    if(req.files && req.files.length > 0){

      for (const file of req.files) {

        const imageUrl = await uploadToR2(file);

        images.push(imageUrl);

      }

    }




    product.name =
    req.body.name || product.name;


    product.brand =
    req.body.brand || product.brand;


    product.category =
    req.body.category || product.category;


    product.collection =
    req.body.collection || product.collection;


    product.price =
    req.body.price || product.price;


    product.stock =
    req.body.stock || product.stock;


    product.description =
    req.body.description || product.description;


    product.story =
    req.body.story || product.story;


    product.ingredients =
    req.body.ingredients || product.ingredients;



    product.images = images;


    product.image =
    images[0] || product.image;




    if(req.body.fragranceNotes){

      product.fragranceNotes =
      JSON.parse(req.body.fragranceNotes);

    }





    product.isNew =
    req.body.isNew === "true";



    product.isBestseller =
    req.body.isBestseller === "true";





    await product.save();





    res.status(200).json({

      success:true,

      message:"Product updated successfully.",

      product

    });




  }catch(error){


    console.log(
      "UPDATE PRODUCT ERROR:",
      error
    );


    res.status(500).json({

      success:false,

      message:error.message

    });


  }


};







// =======================
// DELETE PRODUCT
// =======================

const deleteProduct = async(req,res)=>{


  try{


    const product =
    await Product.findById(req.params.id);



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




  }catch(error){


    console.log(
      "DELETE PRODUCT ERROR:",
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

  createProduct,

  updateProduct,

  deleteProduct,

};