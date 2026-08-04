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

      {/* HERO */}
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <p className="uppercase tracking-[0.45em] text-xs text-stone-400 mb-6">
            AVERNUS
          </p>

          <h1 className="font-serif text-5xl md:text-6xl tracking-[0.18em] font-normal">
            JOURNAL
          </h1>

          <p className="mt-6 text-sm uppercase tracking-[0.35em] text-stone-500">
            Stories From The World Of Fragrance
          </p>
        </div>
      </section>

      {/* ARTICLES */}
      <section className="max-w-7xl mx-auto px-8 md:px-16 pb-24">
        <div className="space-y-20">
          {ARTICLES.map((article, index) => (
            <div
              key={article.id}
              onClick={() => navigate(`/journal/${article.id}`)}
              className="cursor-pointer group"
            >
              <div className="grid lg:grid-cols-[340px_1fr] gap-12 items-start">
                {/* IMAGE */}
                <div className="overflow-hidden bg-stone-100">
                  <img
                    src={article.heroImage}
                    alt={article.title}
                    loading="lazy"
                    className="w-full h-[320px] object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>

                {/* CONTENT */}
                <div className="flex flex-col justify-between h-[320px]">
                  <div>
                    <p className="uppercase tracking-[0.35em] text-[11px] text-stone-400 mb-5">
                      {article.category} · {article.date} · {article.readTime}
                    </p>

                    <h2 className="font-serif text-3xl md:text-4xl leading-snug mb-8 group-hover:text-stone-600 transition-colors">
                      {article.title}
                    </h2>

                    <p className="text-stone-500 leading-8 text-[15px] max-w-lg font-light">
                      {article.excerpt}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-2 uppercase tracking-[0.35em] text-xs border-b border-black pb-1 w-fit group-hover:gap-4 transition-all">
                    Read More
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>

              {index !== ARTICLES.length - 1 && (
                <div className="border-b border-stone-300 mt-20"></div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Journal;