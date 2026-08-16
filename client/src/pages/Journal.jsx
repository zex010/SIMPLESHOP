
// src/pages/Journal.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ARTICLES } from "../data/journalData";

function Journal() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black selection:bg-stone-200">
      <Navbar />

      {/* =====================================================
          JOURNAL HEADER
      ===================================================== */}

      <section className="pt-28 sm:pt-32 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-16">

          <p className="uppercase tracking-[0.35em] sm:tracking-[0.45em] text-[10px] sm:text-xs text-stone-400 mb-4 sm:mb-5">
            AVERNUS
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-[0.12em] sm:tracking-[0.16em] font-normal">
            JOURNAL
          </h1>

          <p className="mt-4 sm:mt-5 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-stone-500">
            Stories From The World Of Fragrance
          </p>

          <div className="w-12 sm:w-16 h-px bg-stone-200 mt-6 sm:mt-8" />

        </div>
      </section>

      {/* =====================================================
          ARTICLES
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-5 sm:px-8 md:px-16 pb-20 sm:pb-28">

        <div className="space-y-16 sm:space-y-24">

          {ARTICLES.map((article, index) => {

            const isReversed = index % 2 !== 0;

            return (
              <React.Fragment key={article.id}>

                <article
                  onClick={() =>
                    navigate(`/journal/${article.id}`)
                  }
                  className="group cursor-pointer"
                >

                  {/* =================================================
                      50 / 50 EDITORIAL LAYOUT
                  ================================================= */}

                  <div
                    className={`
                      grid
                      grid-cols-1
                      lg:grid-cols-2
                      items-center
                      gap-8
                      lg:gap-12
                      xl:gap-16
                    `}
                  >

                    {/* =================================================
                        IMAGE
                    ================================================= */}

                    <div
                      className={`
                        w-full
                        overflow-hidden
                        bg-stone-100
                        ${isReversed ? "lg:order-2" : "lg:order-1"}
                      `}
                    >
                      <img
                        src={article.heroImage}
                        alt={article.title}
                        loading="lazy"
                        className="
                          w-full
                          h-[280px]
                          sm:h-[340px]
                          md:h-[400px]
                          lg:h-[480px]
                          object-cover
                          transition-transform
                          duration-1000
                          ease-out
                          group-hover:scale-105
                        "
                      />
                    </div>

                    {/* =================================================
                        CONTENT
                    ================================================= */}

                    <div
                      className={`
                        w-full
                        min-w-0
                        ${isReversed ? "lg:order-1" : "lg:order-2"}
                      `}
                    >

                      <div className="max-w-xl">

                        {/* CATEGORY / DATE */}

                        <p className="
                          uppercase
                          tracking-[0.22em]
                          sm:tracking-[0.3em]
                          text-[9px]
                          sm:text-[10px]
                          text-stone-400
                          mb-4
                          sm:mb-5
                          leading-relaxed
                        ">
                          {article.category}
                          {" · "}
                          {article.date}
                          {" · "}
                          {article.readTime}
                        </p>

                        {/* TITLE */}

                        <h2 className="
                          font-serif
                          text-2xl
                          sm:text-3xl
                          md:text-4xl
                          lg:text-3xl
                          xl:text-4xl
                          leading-tight
                          tracking-wide
                          font-normal
                          mb-5
                          sm:mb-6
                          break-words
                          group-hover:text-stone-600
                          transition-colors
                          duration-300
                        ">
                          {article.title}
                        </h2>

                        {/* EXCERPT */}

                        <p className="
                          text-stone-500
                          text-[12px]
                          sm:text-[13px]
                          md:text-sm
                          leading-7
                          sm:leading-8
                          font-light
                          tracking-wide
                          break-words
                          max-w-lg
                        ">
                          {article.excerpt}
                        </p>

                        {/* READ MORE */}

                        <div className="mt-7 sm:mt-9">

                          <span className="
                            inline-flex
                            items-center
                            gap-2
                            uppercase
                            tracking-[0.22em]
                            sm:tracking-[0.3em]
                            text-[9px]
                            sm:text-[10px]
                            border-b
                            border-black
                            pb-1.5
                            w-fit
                            group-hover:gap-4
                            transition-all
                            duration-300
                          ">
                            Read More
                            <ArrowRight size={12} strokeWidth={1.5} />
                          </span>

                        </div>

                      </div>

                    </div>

                  </div>

                </article>

                {/* =================================================
                    DIVIDER
                ================================================= */}

                {index !== ARTICLES.length - 1 && (
                  <div className="border-b border-stone-200" />
                )}

              </React.Fragment>
            );
          })}

        </div>

      </section>

      <Footer />
    </div>
  );
}

export default Journal;

