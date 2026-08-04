const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/products");
  },


  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() + "-" + file.originalname.replace(/\s+/g, "-")
    );

  }

});


const upload = multer({

  storage,

  limits: {
    fileSize: 5 * 1024 * 1024
  },


  fileFilter: (req, file, cb) => {

    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];


    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    }
    else {
      cb(new Error("Only images allowed"));
    }

  }

});


module.exports = upload;