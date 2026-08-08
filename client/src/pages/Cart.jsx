import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useShop } from "../context/ShopContext";


function resolveImageSrc(src) {
  if (!src) return "";
  return src.startsWith("http")
    ? src
    : `http://localhost:5000${src}`;
}



export default function Cart() {

  const {
    cart,
    removeFromCart,
    updateQuantity
  } = useShop();


  const navigate = useNavigate();



  const totalAmount = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.qty),
    0
  );



  // FIXED CHECKOUT BUTTON
  const handleCheckout = () => {

    if(cart.length === 0){
      return;
    }

    navigate("/checkout");

  };



  return (

    <div className="
    min-h-screen
    bg-white
    text-stone-900
    flex
    flex-col
    ">


      <Navbar />



      <main className="
      flex-grow
      max-w-7xl
      mx-auto
      w-full
      px-4
      md:px-8
      py-10
      md:py-16
      ">



        <h1 className="
        font-serif
        text-3xl
        md:text-4xl
        uppercase
        mb-8
        ">
          Shopping Bag ({cart.length})
        </h1>




        {
        cart.length === 0 ?


        (

        <div className="
        py-20
        text-center
        flex
        flex-col
        items-center
        ">


          <ShoppingBag
          size={50}
          className="text-stone-300 mb-5"
          />


          <h2 className="
          font-serif
          text-3xl
          uppercase
          ">
            Your Bag Is Empty
          </h2>


          <p className="
          text-xs
          uppercase
          tracking-[0.2em]
          text-stone-400
          mt-3
          mb-8
          ">
            Explore our Haute Parfumerie selections
          </p>



          <Link
          to="/collection"
          className="
          bg-black
          text-white
          px-10
          py-4
          text-xs
          uppercase
          tracking-[0.25em]
          "
          >
            Discover Fragrances
          </Link>


        </div>

        )


        :


        (

        <div className="
        grid
        grid-cols-1
        lg:grid-cols-12
        gap-12
        ">



        {/* PRODUCTS */}

        <div className="
        lg:col-span-8
        border-t
        border-b
        divide-y
        ">


        {
        cart.map((item)=>(


        <div
        key={`${item._id}-${item.selectedSize}`}
        className="
        py-6
        flex
        gap-6
        "
        >



        <div className="
        w-32
        h-32
        bg-[#f8f8f8]
        p-3
        ">


        <img

        src={resolveImageSrc(item.image)}

        alt={item.name}

        className="
        w-full
        h-full
        object-contain
        "

        />


        </div>





        <div className="
        flex-grow
        ">


        <div className="
        flex
        justify-between
        ">


        <div>

        <p className="
        text-xs
        uppercase
        tracking-widest
        text-stone-400
        ">
        {item.brand || "AVERNUS"}
        </p>


        <h3 className="
        font-serif
        text-xl
        ">
        {item.name}
        </h3>


        <p className="
        text-xs
        mt-2
        uppercase
        ">
        Size: {item.selectedSize}
        </p>

        </div>



        <p className="
        font-serif
        ">
        ${item.price * item.qty}
        </p>


        </div>




        <div className="
        flex
        justify-between
        mt-8
        ">



        <div className="
        border
        flex
        items-center
        ">


        <button
        onClick={()=>
        updateQuantity(
          item._id,
          item.selectedSize,
          -1
        )}
        className="p-3"
        >

        <Minus size={12}/>

        </button>



        <span className="px-4">
        {item.qty}
        </span>




        <button

        onClick={()=>
        updateQuantity(
          item._id,
          item.selectedSize,
          1
        )}

        className="p-3"
        >

        <Plus size={12}/>

        </button>



        </div>




        <button

        onClick={()=>
        removeFromCart(
          item._id,
          item.selectedSize
        )}

        >

        <Trash2 size={17}/>

        </button>


        </div>


        </div>


        </div>


        ))
        }


        </div>






        {/* SUMMARY */}


        <div className="
        lg:col-span-4
        ">


        <div className="
        bg-stone-50
        p-8
        border
        space-y-6
        ">


        <h2 className="
        font-serif
        text-xl
        uppercase
        ">
        Order Summary
        </h2>




        <div className="
        flex
        justify-between
        ">
        <span>
        Subtotal
        </span>

        <span>
        ${totalAmount}
        </span>

        </div>




        <div className="
        flex
        justify-between
        ">
        <span>
        Shipping
        </span>

        <span>
        Complimentary
        </span>

        </div>




        <div className="
        border-t
        pt-5
        flex
        justify-between
        font-serif
        text-2xl
        ">

        <span>
        Total
        </span>

        <span>
        ${totalAmount}
        </span>

        </div>





        <button

        onClick={handleCheckout}

        className="
        w-full
        bg-black
        text-white
        py-4
        uppercase
        text-xs
        tracking-[0.3em]
        flex
        justify-center
        gap-3
        "

        >

        Proceed To Checkout

        <ArrowRight size={14}/>

        </button>



        </div>


        </div>



        </div>

        )


        }



      </main>



      <Footer />


    </div>

  );

}