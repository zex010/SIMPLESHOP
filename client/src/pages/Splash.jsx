import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ArrowRight } from "lucide-react";
import logoImage from "../assets/Avernus.png";

export default function Splash() {
  const navigate = useNavigate();

  const [region, setRegion] = useState("Select Country / Region");
  const [language, setLanguage] = useState("English");

  const [openRegion, setOpenRegion] = useState(false);
  const [openLanguage, setOpenLanguage] = useState(false);

  const countries = [
    "United States",
    "United Kingdom",
    "France",
    "Italy",
    "Germany",
    "Pakistan",
  ];

  const languages = [
    "English",
    "Français",
    "العربية",
  ];


  const enterBoutique = () => {
    localStorage.setItem("region", region);
    localStorage.setItem("language", language);
    navigate("/home");
  };


  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#ffffff",
        color: "#000000",
        zIndex: 99999,
      }}
      className="flex flex-col items-center justify-center px-6"
    >


      {/* AVENUS LOGO */}
      <img
  src={logoImage}
  alt="Avernus"
  className="
  w-56
  md:w-64
  mb-12
  object-contain
  "
/>


      {/* COUNTRY */}

      <div className="relative w-52 mb-4">

        <button
          onClick={() => {
            setOpenRegion(!openRegion);
            setOpenLanguage(false);
          }}
          className="
          w-full
          h-10
          border
          border-black
          bg-white
          text-black
          flex
          items-center
          justify-between
          px-4
          text-[10px]
          tracking-[0.2em]
          uppercase
          "
        >
          {region}
          <ChevronDown size={13}/>
        </button>


        {openRegion && (
          <div
            className="
            absolute
            top-11
            left-0
            w-full
            bg-white
            border
            border-black
            z-50
            "
          >
            {countries.map((item)=>(
              <button
                key={item}
                onClick={()=>{
                  setRegion(item);
                  setOpenRegion(false);
                }}
                className="
                w-full
                text-left
                px-4
                py-2
                text-[9px]
                tracking-[0.15em]
                uppercase
                text-black
                hover:bg-black
                hover:text-white
                "
              >
                {item}
              </button>
            ))}
          </div>
        )}

      </div>




      {/* LANGUAGE */}

      <div className="relative w-52">

        <button
          onClick={()=>{
            setOpenLanguage(!openLanguage);
            setOpenRegion(false);
          }}
          className="
          w-full
          h-10
          border
          border-black
          bg-white
          text-black
          flex
          items-center
          justify-between
          px-4
          text-[10px]
          tracking-[0.2em]
          uppercase
          "
        >
          {language}
          <ChevronDown size={13}/>
        </button>


        {openLanguage && (
          <div
            className="
            absolute
            top-11
            left-0
            w-full
            bg-white
            border
            border-black
            z-50
            "
          >

            {languages.map((item)=>(
              <button
                key={item}
                onClick={()=>{
                  setLanguage(item);
                  setOpenLanguage(false);
                }}
                className="
                w-full
                text-left
                px-4
                py-2
                text-[9px]
                tracking-[0.15em]
                uppercase
                text-black
                hover:bg-black
                hover:text-white
                "
              >
                {item}
              </button>
            ))}

          </div>
        )}

      </div>




      {/* BUTTON */}

      <button
        onClick={enterBoutique}
        className="
        mt-10
        w-52
        h-10
        bg-black
        text-white
        flex
        items-center
        justify-center
        gap-3
        text-[10px]
        tracking-[0.3em]
        uppercase
        "
      >
        Enter Avernus
        <ArrowRight size={13}/>
      </button>



      <p
        className="
        absolute
        bottom-5
        text-[9px]
        tracking-[0.3em]
        uppercase
        text-black
        "
      >
        © Avernus
      </p>


    </div>
  );
}