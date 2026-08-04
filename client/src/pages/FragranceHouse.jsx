import { Search, Menu, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function FragranceHouse() {

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);


  const menuItems = [
    "New In",
    "Handbags",
    "Women",
    "Men",
    "Children",
    "Travel",
    "Jewellery & Watches",
    "Fragrances and Makeup",
    "Gifts",
    "Décor & Lifestyle",
    "Gucci Services"
  ];


  return (

    <div className="min-h-screen bg-black text-white relative overflow-hidden">


      {/* Background Glow */}

      <div className="
        absolute 
        inset-0 
        bg-[radial-gradient(circle_at_center,#222,transparent_70%)]
      ">
      </div>



      {/* Header */}

      <header className="
        relative 
        z-10 
        flex 
        justify-between 
        items-center 
        px-8 
        md:px-16 
        py-8
      ">


        {/* Contact */}

        <button
          onClick={() => navigate("/home")}
          className="
            uppercase 
            tracking-[0.3em] 
            text-sm 
            hover:text-gray-400 
            transition
          "
        >
          + Contact Us
        </button>




        {/* Logo */}

        <h1
          onClick={() => navigate("/home")}
          className="
            absolute 
            left-1/2 
            -translate-x-1/2 
            font-serif 
            text-white 
            tracking-[0.5em] 
            text-xl 
            md:text-2xl 
            cursor-pointer
          "
        >
          THE VINTAGE BOUTIQUE
        </h1>





        {/* Right */}

        <div className="flex items-center gap-6">


          <Search
            size={22}
            strokeWidth={1.5}
            className="cursor-pointer hover:text-gray-400 transition"
          />



          <button
            onClick={() => setMenuOpen(true)}
            className="
              flex 
              items-center 
              gap-2 
              uppercase 
              tracking-[0.25em]
              hover:text-gray-400
              transition
            "
          >

            <Menu size={22} strokeWidth={1.5}/>

            MENU

          </button>


        </div>


      </header>






      {/* FULL SCREEN MENU */}

      {menuOpen && (

        <div className="
          fixed
          inset-0
          z-50
          bg-black
          text-white
          flex
          flex-col
          px-10
          md:px-20
          py-10
        ">



          {/* Menu Header */}

          <div className="
            flex
            justify-between
            items-center
            border-b
            border-neutral-800
            pb-8
          ">


            <h2 className="
              font-serif
              text-2xl
              tracking-[0.4em]
            ">
              MENU
            </h2>



            <button
              onClick={() => setMenuOpen(false)}
            >

              <X
                size={30}
                strokeWidth={1.5}
              />

            </button>


          </div>






          {/* Menu List */}

          <div className="
            mt-12
            grid
            md:grid-cols-2
            gap-y-8
          ">


            {menuItems.map((item)=>(

              <div
                key={item}
                className="
                  text-2xl
                  md:text-4xl
                  font-serif
                  tracking-wide
                  cursor-pointer
                  hover:text-gray-400
                  transition
                "
              >

                {item}

              </div>


            ))}


          </div>


        </div>

      )}







      {/* Hero */}

      <section className="
        relative 
        z-10 
        flex 
        flex-col 
        items-center 
        justify-center 
        min-h-[80vh] 
        px-6
      ">



        <img
          src="/perfume.png"
          alt="Perfume"
          className="
            w-56
            md:w-80
            object-contain
            drop-shadow-2xl
          "
        />



        <h2 className="
          mt-10
          text-center
          text-4xl
          md:text-6xl
          font-serif
          tracking-[0.35em]
          text-white
        ">

          THE VINTAGE
          <br />
          BOUTIQUE

        </h2>




        <p className="
          mt-6
          uppercase
          tracking-[0.6em]
          text-sm
          text-gray-400
        ">

          MY FAV PERFUME

        </p>





        <button className="
          mt-12
          border
          border-white
          text-white
          px-8
          py-4
          uppercase
          tracking-[0.3em]
          hover:bg-white
          hover:text-black
          transition
          flex
          items-center
          gap-3
        ">

          Discover

          <ArrowRight size={18}/>

        </button>



      </section>



    </div>

  );

}


export default FragranceHouse;