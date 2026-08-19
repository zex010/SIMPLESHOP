import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ArrowRight } from "lucide-react";
import logoImage from "../assets/Avernus.png";
import splashImage from "../assets/splash.jpg";

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

  // ============================================================
  // ENTER BOUTIQUE
  // Country must be selected before entering
  // ============================================================

  const enterBoutique = () => {
    if (region === "Select Country / Region") {
      setOpenRegion(true);
      setOpenLanguage(false);
      return;
    }

    localStorage.setItem("region", region);
    localStorage.setItem("language", language);

    navigate("/home");
  };

  return (
    <div className="fixed inset-0 z-[99999] w-screen h-screen overflow-hidden bg-black text-white">

      {/* ========================================================
          BACKGROUND IMAGE
      ======================================================== */}

      <div className="absolute inset-0">

        <img
          src={splashImage}
          alt="AVERNUS Haute Parfumerie"
          className="
            absolute
            inset-0
            w-full
            h-full
            object-cover
            object-center
          "
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Extra gradient for readability */}
        <div className="
          absolute
          inset-0
          bg-gradient-to-b
          from-black/70
          via-black/10
          to-black/70
        " />

      </div>


      {/* ========================================================
          MAIN CONTENT
      ======================================================== */}

      <div className="
        relative
        z-10
        w-full
        h-full
        flex
        flex-col
        items-center
        justify-between
        px-5
        py-7
        sm:px-8
        sm:py-10
      ">


        {/* ======================================================
            TOP / LOGO
        ====================================================== */}

        <div className="
          flex
          flex-col
          items-center
          text-center
          mt-2
          sm:mt-4
        ">

          
          <div className="
            w-6
            h-[1px]
            bg-white/60
            mt-3
            mb-2
          " />

          <p className="
            text-[8px]
            sm:text-[9px]
            tracking-[0.3em]
            uppercase
            text-white/80
          ">
            Haute Parfumerie
          </p>

        </div>


        {/* ======================================================
            CENTER DETAILS
        ====================================================== */}

        <div className="
          w-full
          flex
          flex-col
          items-center
          justify-center
          text-center
        ">

          <p className="
            text-[9px]
            sm:text-[10px]
            tracking-[0.25em]
            uppercase
            text-white/80
            mb-5
          ">
            Crafted for timeless elegance
          </p>


          {/* ==================================================
              COUNTRY
          ================================================== */}

          <div className="relative w-44 sm:w-48 mb-3">

            <button
              type="button"
              onClick={() => {
                setOpenRegion(!openRegion);
                setOpenLanguage(false);
              }}
              className="
                w-full
                h-8
                border
                border-white/60
                bg-white/10
                backdrop-blur-md
                text-white
                flex
                items-center
                justify-between
                px-3
                text-[8px]
                tracking-[0.15em]
                uppercase
                transition-all
                hover:bg-white/20
              "
            >

              <span className="truncate">
                {region}
              </span>

              <ChevronDown
                size={11}
                className={`
                  transition-transform
                  ${openRegion ? "rotate-180" : ""}
                `}
              />

            </button>


            {openRegion && (
              <div className="
                absolute
                top-9
                left-0
                w-full
                bg-black/90
                backdrop-blur-md
                border
                border-white/40
                z-50
                overflow-hidden
              ">

                {countries.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setRegion(item);
                      setOpenRegion(false);
                    }}
                    className="
                      w-full
                      text-left
                      px-3
                      py-1.5
                      text-[8px]
                      tracking-[0.12em]
                      uppercase
                      text-white
                      hover:bg-white
                      hover:text-black
                      transition-colors
                    "
                  >
                    {item}
                  </button>
                ))}

              </div>
            )}

          </div>


          {/* ==================================================
              LANGUAGE
          ================================================== */}

          <div className="relative w-44 sm:w-48">

            <button
              type="button"
              onClick={() => {
                setOpenLanguage(!openLanguage);
                setOpenRegion(false);
              }}
              className="
                w-full
                h-8
                border
                border-white/60
                bg-white/10
                backdrop-blur-md
                text-white
                flex
                items-center
                justify-between
                px-3
                text-[8px]
                tracking-[0.15em]
                uppercase
                transition-all
                hover:bg-white/20
              "
            >

              <span className="truncate">
                {language}
              </span>

              <ChevronDown
                size={11}
                className={`
                  transition-transform
                  ${openLanguage ? "rotate-180" : ""}
                `}
              />

            </button>


            {openLanguage && (
              <div className="
                absolute
                top-9
                left-0
                w-full
                bg-black/90
                backdrop-blur-md
                border
                border-white/40
                z-50
                overflow-hidden
              ">

                {languages.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setLanguage(item);
                      setOpenLanguage(false);
                    }}
                    className="
                      w-full
                      text-left
                      px-3
                      py-1.5
                      text-[8px]
                      tracking-[0.12em]
                      uppercase
                      text-white
                      hover:bg-white
                      hover:text-black
                      transition-colors
                    "
                  >
                    {item}
                  </button>
                ))}

              </div>
            )}

          </div>


          {/* ==================================================
              ENTER BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={enterBoutique}
            className="
              mt-6
              w-44
              sm:w-48
              h-8
              bg-white/15
              backdrop-blur-md
              border
              border-white/70
              text-white
              flex
              items-center
              justify-center
              gap-2
              text-[8px]
              tracking-[0.22em]
              uppercase
              transition-all
              hover:bg-white
              hover:text-black
            "
          >

            Enter Avernus

            <ArrowRight size={11} />

          </button>

        </div>


        {/* ======================================================
            FOOTER
        ====================================================== */}

        <div className="
          w-full
          flex
          items-center
          justify-between
          text-[7px]
          sm:text-[8px]
          uppercase
          tracking-[0.25em]
          text-white/60
        ">

          <span>
            Est. Paris
          </span>

          <span>
            © AVERNUS
          </span>

          <span>
            2026
          </span>

        </div>

      </div>


      {/* ========================================================
          MOBILE IMAGE SEPARATOR / LOWER IMAGE EMPHASIS
      ======================================================== */}

      <div className="
        pointer-events-none
        absolute
        bottom-0
        left-0
        w-full
        h-1/2
        z-[1]
        bg-gradient-to-t
        from-black/30
        to-transparent
        md:hidden
      " />

    </div>
  );
}