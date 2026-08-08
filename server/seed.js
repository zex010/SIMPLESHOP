const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const products = require("./data/products");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)

.then(() => {

    console.log("MongoDB Connected");

    seedProducts();

})

.catch((error)=>{

    console.log(error);

});



async function seedProducts(){

    try{

        // remove old products
        await Product.deleteMany();

        console.log("Old Products Removed");


        // insert new products
        await Product.insertMany(products);


        console.log(
          `${products.length} Products Inserted Successfully`
        );


        process.exit();


    }

    catch(error){

        console.log("Seed Error:", error);

        process.exit(1);

    }

}
