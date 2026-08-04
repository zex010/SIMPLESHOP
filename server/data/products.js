const products = [

  // ===================== CREED =====================

  {
    name: "Aventus",
    brand: "Creed",
    price: 300,
    category: "Men",
    collection: "Creed",
    isNew: true,
    isBestseller: true,
    description:
      "A legendary fruity woody fragrance with pineapple, birch, musk, and oakmoss.",
    image: "/uploads/products/aventus (1).jpg",
    images: [
      "/uploads/products/aventus (1).jpg",
      "/uploads/products/aventus (2).jpg",
      "/uploads/products/aventus (3).jpg",
    ],
    stock: 20
  },


  {
    name: "Green Irish Tweed",
    brand: "Creed",
    price: 290,
    category: "Men",
    collection: "Creed",
    description:
      "A fresh green fragrance with iris, violet leaves, sandalwood, and ambergris.",
    image: "/uploads/products/irish (1).jpg",
    images:[
      "/uploads/products/irish (1).jpg",
      "/uploads/products/irish (2).jpg",
      "/uploads/products/irish (3).jpg",
    ],
    stock:15
  },


  // ================= PARFUMS DE MARLY =================


  {
    name:"Layton",
    brand:"Parfums de Marly",
    price:260,
    category:"Men",
    collection:"Parfums de Marly",
    isNew:true,
    description:
      "A luxurious blend of apple, vanilla, lavender, and cardamom.",
    image:"/uploads/products/layton (2).jpg",
    images:[
      "/uploads/products/layton (2).jpg",
      "/uploads/products/layton.jpg",
      "/uploads/products/layton.jpg",

    ],
    stock:18
  },


  {
    name:"Delina",
    brand:"Parfums de Marly",
    price:280,
    category:"Women",
    collection:"Parfums de Marly",
    isNew:true,
    description:
      "A luxurious feminine fragrance with Turkish rose, lychee, vanilla and incense.",
    image:"/uploads/products/delina (1).jpg",
    images:[
      "/uploads/products/delina (1).jpg",
      "/uploads/products/delina (2).jpg",
      "/uploads/products/delina (1).jpg",
    ],
    stock:15
  },


  // ================= LOUIS VUITTON =================


  {
    name:"Imagination",
    brand:"Louis Vuitton",
    price:330,
    category:"Men",
    collection:"Louis Vuitton",
    description:
      "An elegant citrus fragrance with black tea, amber and incense.",
    image:"/uploads/products/lv1.jpg",
    images:[
      "/uploads/products/lv1.jpg",
      "/uploads/products/lv2.jpg",
      "/uploads/products/lv3.jpg",
    ],
    stock:14
  },


  {
    name:"Ombre Nomade",
    brand:"Louis Vuitton",
    price:390,
    category:"Unisex",
    collection:"Louis Vuitton",
    isBestseller:true,
    description:
      "An intense oud fragrance with raspberry, incense and smoky woods.",
    image:"/uploads/products/ombre (1).jpg",
    images:[
      "/uploads/products/ombre (1).jpg",
      "/uploads/products/ombre (2).jpg",
      "/uploads/products/ombre (1).jpg",
    ],
    stock:10
  },


  // ================= MANCERA =================


  {
    name:"Cedrat Boise",
    brand:"Mancera",
    price:190,
    category:"Men",
    collection:"Mancera",
    description:
      "A citrus woody fragrance with leather, cedar and blackcurrant.",
    image:"/uploads/products/cedratboise.jpg",
    images:[
      "/uploads/products/cedratboise.jpg",
      "/uploads/products/cedratboise2.jpg",
      "/uploads/products/cedratboise.jpg",
    ],
    stock:20
  },


  {
    name:"Roses Vanille",
    brand:"Mancera",
    price:200,
    category:"Women",
    collection:"Mancera",
    description:
      "A sweet floral fragrance with rose, vanilla and sugar notes.",
    image:"/uploads/products/rosesv (1).jpg",
    images:[
     "/uploads/products/rosesv (1).jpg",
     "/uploads/products/rosesv (2).jpg",
     "/uploads/products/rosesv (3).jpg",
    ],
    stock:15
  },


  // ================= TOM FORD =================


  {
    name:"Oud Wood",
    brand:"Tom Ford",
    price:295,
    category:"Men",
    collection:"Tom Ford",
    isBestseller:true,
    description:
      "A luxurious woody fragrance with oud, sandalwood and cardamom.",
    image:"/uploads/products/oudwood (1).jpg",
    images:[
      "/uploads/products/oudwood (1).jpg",
      "/uploads/products/oudwood (9).jpg",
      "/uploads/products/oudwood (10).jpg",
    ],
    stock:14
  },


  {
    name:"Lost Cherry",
    brand:"Tom Ford",
    price:320,
    category:"Women",
    collection:"Tom Ford",
    description:
      "A sweet gourmand fragrance with cherry, almond and tonka bean.",
    image:"/uploads/products/cherry (1).jpg",
    images:[
      "/uploads/products/cherry (1).jpg",
      "/uploads/products/cherry (2).jpg",
      "/uploads/products/cherry (3).jpg",
    ],
    stock:12
  },


  // ================= DIOR =================


  {
    name:"Sauvage Elixir",
    brand:"Dior",
    price:250,
    category:"Men",
    collection:"Dior",
    isBestseller:true,
    description:
      "A bold spicy fragrance with cinnamon, lavender and sandalwood.",
    image:"/uploads/products/elixr.jpg",
    images:[
      "/uploads/products/elixr.jpg",
      "/uploads/products/elixr2.jpg",
      "/uploads/products/elixr.jpg",
    ],
    stock:18
  },


  {
    name:"Miss Dior",
    brand:"Dior",
    price:230,
    category:"Women",
    collection:"Dior",
    description:
      "A romantic floral fragrance with rose, iris and soft woods.",
    image:"/uploads/products/missdior (1).jpg",
    images:[
      "/uploads/products/missdior (1).jpg",
      "/uploads/products/missdior (2).jpg",
      "/uploads/products/missdior (3).jpg"
    ],
    stock:15
  },


  // ================= CHANEL =================


  {
    name:"Bleu De Chanel",
    brand:"Chanel",
    price:250,
    category:"Men",
    collection:"Chanel",
    isBestseller:true,
    description:
      "A timeless masculine fragrance with citrus and aromatic woods.",
    image:"/uploads/products/channel.jpg",
    images:[
      "/uploads/products/channel.jpg",
      "/uploads/products/channel3.jpg",
      "/uploads/products/channel.jpg",
    ],
    stock:20
  },


  {
    name:"Coco Mademoiselle",
    brand:"Chanel",
    price:270,
    category:"Women",
    collection:"Chanel",
    description:
      "A sophisticated feminine fragrance with orange, rose, jasmine and patchouli.",
    image:"/uploads/products/coco (1).jpg",
    images:[
      "/uploads/products/coco (1).jpg",
      "/uploads/products/coco (2).jpg",
      "/uploads/products/coco (3).jpg",
    ],
    stock:15
  },


  // ================= UNISEX =================


  {
    name:"Santal 33",
    brand:"Le Labo",
    price:260,
    category:"Unisex",
    collection:"Le Labo",
    isBestseller:true,
    description:
      "An iconic woody fragrance with sandalwood, leather and spices.",
    image:"/uploads/products/santal33 (1).jpg",
    images:[
      "/uploads/products/santal33 (1).jpg",
      "/uploads/products/santal33 (2).jpg",
      "/uploads/products/santal33 (3).jpg",
    ],
    stock:20
  },


  {
    name:"Bois Imperial",
    brand:"Essential Parfums",
    price:220,
    category:"Unisex",
    collection:"Essential Parfums",
    isNew:true,
    description:
      "A modern woody fragrance with basil, vetiver and spicy woods.",
    image:"/uploads/products/boiseimperial (1).jpg",
    images:[
      "/uploads/products/boiseimperial (1).jpg",
      "/uploads/products/boiseimperial (2).jpg",
      "/uploads/products/boiseimperial (3).jpg",
    ],
    stock:15
  }

];


module.exports = products;