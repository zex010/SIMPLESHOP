// src/pages/JournalArticle.jsx

import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Share2,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ARTICLES } from "../data/journalData";

export default function JournalArticle() {
  const { id } = useParams();

  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const articleIndex = ARTICLES.findIndex(
    (article) => article.id === id
  );

  const article = ARTICLES[articleIndex];

  /* =========================================================
     404
  ========================================================= */

  if (!article) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col">
        <Navbar />

        <main className="flex-1 flex items-center justify-center px-5 py-32">
          <div className="text-center max-w-xl">
            <p className="uppercase tracking-[0.35em] text-[10px] sm:text-xs text-stone-400 mb-5">
              AVERNUS JOURNAL
            </p>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-[0.08em] font-normal mb-6">
              Article Not Found
            </h1>

            <p className="text-stone-500 text-sm leading-7 font-light mb-8">
              The essay or editorial piece you are seeking does not exist
              or has been archived.
            </p>

            <Link
              to="/journal"
              className="
                inline-flex
                items-center
                gap-3
                uppercase
                tracking-[0.25em]
                text-[10px]
                sm:text-xs
                border-b
                border-black
                pb-2
                hover:gap-5
                transition-all
              "
            >
              <ArrowLeft size={14} />
              Back To Journal
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  /* =========================================================
     ARTICLE NAVIGATION
  ========================================================= */

  const prevArticle =
    ARTICLES[articleIndex - 1] || null;

  const nextArticle =
    ARTICLES[articleIndex + 1] || null;

  const relatedArticles = ARTICLES
    .filter((item) => item.id !== article.id)
    .slice(0, 3);

  /* =========================================================
     COPY LINK
  ========================================================= */

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        window.location.href
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (error) {
      console.error("Unable to copy link:", error);
    }
  };

  /* =========================================================
     NEWSLETTER
  ========================================================= */

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-stone-200 overflow-x-hidden">

      <Navbar />

      {/* =====================================================
          ARTICLE HERO
          50 / 50
      ===================================================== */}

      <section
        className="
          pt-24
          sm:pt-28
          md:pt-32
          pb-16
          sm:pb-20
          md:pb-24
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            px-5
            sm:px-8
            md:px-12
          "
        >
          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-2
              min-h-0
              lg:min-h-[560px]
              border-y
              border-stone-200
            "
          >

            {/* HERO IMAGE */}

            <div
              className="
                order-1
                lg:order-1
                overflow-hidden
                bg-stone-100
                min-h-[360px]
                sm:min-h-[450px]
                lg:min-h-[560px]
              "
            >
              <img
                src={article.heroImage}
                alt={article.title}
                className="
                  w-full
                  h-full
                  min-h-[360px]
                  sm:min-h-[450px]
                  lg:min-h-[560px]
                  object-cover
                  grayscale-[10%]
                  hover:grayscale-0
                  hover:scale-105
                  transition-all
                  duration-1000
                  ease-out
                "
              />
            </div>

            {/* ARTICLE INFORMATION */}

            <div
              className="
                order-2
                lg:order-2
                flex
                flex-col
                justify-center
                px-5
                sm:px-8
                md:px-12
                lg:px-14
                py-12
                sm:py-14
                lg:py-16
                bg-white
              "
            >
              {/* META */}

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-x-2
                  gap-y-2
                  text-[9px]
                  sm:text-[10px]
                  uppercase
                  tracking-[0.25em]
                  text-stone-400
                  mb-6
                "
              >
                <span>{article.category}</span>

                <span>·</span>

                <span>{article.date}</span>

                <span>·</span>

                <span>{article.readTime}</span>
              </div>

              {/* TITLE */}

              <h1
                className="
                  font-serif
                  text-3xl
                  sm:text-4xl
                  md:text-5xl
                  lg:text-[3.2rem]
                  leading-[1.15]
                  tracking-[0.04em]
                  font-normal
                  break-words
                  mb-6
                "
              >
                {article.title}
              </h1>

              {/* SUBTITLE */}

              {article.subtitle && (
                <p
                  className="
                    text-stone-500
                    font-serif
                    italic
                    text-base
                    sm:text-lg
                    leading-relaxed
                    mb-6
                    max-w-xl
                  "
                >
                  {article.subtitle}
                </p>
              )}

              {/* EXCERPT */}

              <p
                className="
                  text-stone-600
                  text-sm
                  sm:text-[15px]
                  leading-7
                  max-w-xl
                  font-light
                  break-words
                "
              >
                {article.excerpt}
              </p>

              {/* READ MORE */}

              <div className="mt-8">
                <a
                  href="#article-content"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    uppercase
                    tracking-[0.25em]
                    text-[10px]
                    sm:text-xs
                    border-b
                    border-black
                    pb-2
                    hover:gap-4
                    transition-all
                  "
                >
                  Read More
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ARTICLE CONTENT
          50 / 50 ALTERNATING
      ===================================================== */}

      <article
        id="article-content"
        className="
          max-w-7xl
          mx-auto
          px-5
          sm:px-8
          md:px-12
          pb-20
          sm:pb-24
          md:pb-28
        "
      >

        <div className="space-y-16 sm:space-y-20 lg:space-y-28">

          {article.contentBlocks.map((block, idx) => {
            const isHeading = block.type === "heading";

            /*
              Every content block gets a 50/50 section.

              Odd sections:
              IMAGE LEFT / TEXT RIGHT

              Even sections:
              TEXT LEFT / IMAGE RIGHT

              If there are no available images for the block,
              the text automatically becomes full width.
            */

            const image =
              idx === 0
                ? article.heroImage
                : article.secondaryImage;

            const imageOnLeft = idx % 2 === 0;

            return (
              <section
                key={idx}
                className="
                  grid
                  grid-cols-1
                  lg:grid-cols-2
                  border-y
                  border-stone-200
                "
              >

                {/* IMAGE */}

                {image && (
                  <div
                    className={`
                      overflow-hidden
                      bg-stone-100
                      min-h-[320px]
                      sm:min-h-[400px]
                      lg:min-h-[500px]
                      ${
                        imageOnLeft
                          ? "lg:order-1"
                          : "lg:order-2"
                      }
                    `}
                  >
                    <img
                      src={image}
                      alt={
                        isHeading
                          ? block.text
                          : article.title
                      }
                      loading="lazy"
                      className="
                        w-full
                        h-full
                        min-h-[320px]
                        sm:min-h-[400px]
                        lg:min-h-[500px]
                        object-cover
                        grayscale-[10%]
                        hover:grayscale-0
                        hover:scale-105
                        transition-all
                        duration-1000
                      "
                    />
                  </div>
                )}

                {/* TEXT */}

                <div
                  className={`
                    flex
                    flex-col
                    justify-center
                    px-5
                    sm:px-8
                    md:px-12
                    lg:px-14
                    py-12
                    sm:py-14
                    lg:py-16
                    ${
                      imageOnLeft
                        ? "lg:order-2"
                        : "lg:order-1"
                    }
                  `}
                >

                  {isHeading ? (
                    <>
                      <p
                        className="
                          uppercase
                          tracking-[0.3em]
                          text-[9px]
                          sm:text-[10px]
                          text-stone-400
                          mb-5
                        "
                      >
                        AVERNUS JOURNAL
                      </p>

                      <h2
                        className="
                          font-serif
                          text-2xl
                          sm:text-3xl
                          md:text-4xl
                          leading-tight
                          tracking-[0.04em]
                          font-normal
                          break-words
                        "
                      >
                        {block.text}
                      </h2>
                    </>
                  ) : (
                    <p
                      className="
                        text-stone-700
                        text-sm
                        sm:text-[15px]
                        md:text-base
                        leading-[2]
                        font-light
                        tracking-wide
                        break-words
                      "
                    >
                      {block.text}
                    </p>
                  )}

                </div>
              </section>
            );
          })}

        </div>

        {/* ===================================================
            QUOTE
        =================================================== */}

        {article.quote && (
          <figure
            className="
              my-16
              sm:my-20
              lg:my-24
              py-10
              sm:py-14
              border-y
              border-stone-200
              text-center
              px-5
            "
          >
            <blockquote
              className="
                font-serif
                text-xl
                sm:text-2xl
                md:text-3xl
                leading-relaxed
                text-black
                tracking-wide
                italic
                max-w-3xl
                mx-auto
                mb-5
                break-words
              "
            >
              “{article.quote}”
            </blockquote>

            {article.quoteAuthor && (
              <figcaption
                className="
                  uppercase
                  tracking-[0.3em]
                  text-[9px]
                  sm:text-xs
                  text-stone-400
                "
              >
                — {article.quoteAuthor}
              </figcaption>
            )}
          </figure>
        )}

        {/* ===================================================
            SHARE
        =================================================== */}

        <div
          className="
            py-10
            sm:py-12
            flex
            flex-col
            sm:flex-row
            items-start
            sm:items-center
            justify-between
            gap-5
            border-b
            border-stone-200
          "
        >
          <span
            className="
              uppercase
              tracking-[0.3em]
              text-[9px]
              sm:text-xs
              text-stone-400
            "
          >
            Share Article
          </span>

          <button
            onClick={handleCopyLink}
            className="
              inline-flex
              items-center
              gap-2
              uppercase
              tracking-[0.22em]
              text-[10px]
              sm:text-xs
              text-black
              hover:text-stone-500
              transition-colors
            "
          >
            {copied ? (
              <>
                <Check size={14} />
                Link Copied
              </>
            ) : (
              <>
                <Share2 size={14} />
                Copy Link
              </>
            )}
          </button>
        </div>

        {/* ===================================================
            PREVIOUS / JOURNAL / NEXT
        =================================================== */}

        <nav
          className="
            py-12
            sm:py-16
            grid
            grid-cols-3
            items-center
            border-b
            border-stone-200
            text-[9px]
            sm:text-xs
            uppercase
            tracking-[0.2em]
            sm:tracking-[0.3em]
          "
        >

          {/* PREVIOUS */}

          <div>
            {prevArticle ? (
              <Link
                to={`/journal/${prevArticle.id}`}
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-stone-600
                  hover:text-black
                  hover:-translate-x-1
                  transition-all
                "
              >
                <ArrowLeft size={13} />

                <span className="hidden sm:inline">
                  Previous
                </span>
              </Link>
            ) : (
              <span className="opacity-0">
                None
              </span>
            )}
          </div>

          {/* BACK */}

          <div className="text-center">
            <Link
              to="/journal"
              className="
                text-black
                border-b
                border-black
                pb-1
                hover:border-stone-400
                transition-colors
              "
            >
              Journal
            </Link>
          </div>

          {/* NEXT */}

          <div className="text-right">
            {nextArticle ? (
              <Link
                to={`/journal/${nextArticle.id}`}
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-stone-600
                  hover:text-black
                  hover:translate-x-1
                  transition-all
                "
              >
                <span className="hidden sm:inline">
                  Next
                </span>

                <ArrowRight size={13} />
              </Link>
            ) : (
              <span className="opacity-0">
                None
              </span>
            )}
          </div>

        </nav>
      </article>

      {/* =====================================================
          RELATED ARTICLES
      ===================================================== */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-5
          sm:px-8
          md:px-12
          py-20
          sm:py-24
          border-b
          border-stone-200
        "
      >

        <p
          className="
            uppercase
            tracking-[0.35em]
            text-[9px]
            sm:text-xs
            text-stone-400
            mb-12
            text-center
          "
        >
          You May Also Like
        </p>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-10
            lg:gap-12
          "
        >

          {relatedArticles.map((rel) => (
            <Link
              key={rel.id}
              to={`/journal/${rel.id}`}
              className="
                group
                flex
                flex-col
                justify-between
                h-full
                min-w-0
              "
            >

              <div>

                {/* IMAGE */}

                <div
                  className="
                    overflow-hidden
                    bg-stone-100
                    mb-5
                    h-[260px]
                    sm:h-[280px]
                  "
                >
                  <img
                    src={rel.heroImage}
                    alt={rel.title}
                    loading="lazy"
                    className="
                      w-full
                      h-full
                      object-cover
                      transition-transform
                      duration-700
                      group-hover:scale-105
                    "
                  />
                </div>

                {/* META */}

                <p
                  className="
                    uppercase
                    tracking-[0.25em]
                    text-[9px]
                    sm:text-[10px]
                    text-stone-400
                    mb-3
                  "
                >
                  {rel.category} · {rel.date}
                </p>

                {/* TITLE */}

                <h3
                  className="
                    font-serif
                    text-xl
                    sm:text-2xl
                    leading-snug
                    mb-4
                    break-words
                    group-hover:text-stone-600
                    transition-colors
                  "
                >
                  {rel.title}
                </h3>

                {/* EXCERPT */}

                <p
                  className="
                    text-stone-500
                    text-xs
                    leading-relaxed
                    line-clamp-3
                    font-light
                  "
                >
                  {rel.excerpt}
                </p>

              </div>

              {/* READ */}

              <span
                className="
                  inline-flex
                  items-center
                  gap-2
                  uppercase
                  tracking-[0.25em]
                  text-[10px]
                  sm:text-[11px]
                  border-b
                  border-black
                  pb-1
                  w-fit
                  mt-7
                  group-hover:gap-4
                  transition-all
                "
              >
                Read Article
                <ArrowRight size={12} />
              </span>

            </Link>
          ))}

        </div>
      </section>

      {/* =====================================================
          NEWSLETTER
      ===================================================== */}

      <section
        className="
          max-w-3xl
          mx-auto
          px-5
          sm:px-6
          py-20
          sm:py-24
          md:py-28
          text-center
        "
      >

        <p
          className="
            uppercase
            tracking-[0.35em]
            text-[9px]
            sm:text-xs
            text-stone-400
            mb-4
          "
        >
          AVERNUS GAZETTE
        </p>

        <h2
          className="
            font-serif
            text-2xl
            sm:text-3xl
            md:text-4xl
            tracking-[0.06em]
            mb-5
            font-normal
            break-words
          "
        >
          Subscribe To Our Journal
        </h2>

        <p
          className="
            text-stone-500
            text-xs
            sm:text-sm
            leading-relaxed
            max-w-md
            mx-auto
            mb-8
            font-light
          "
        >
          Receive monthly essays on perfumery, ingredient harvests,
          and private olfactive releases.
        </p>

        {subscribed ? (
          <p
            className="
              uppercase
              tracking-[0.25em]
              text-[10px]
              sm:text-xs
              text-black
              border
              border-stone-200
              py-4
              px-6
              inline-block
            "
          >
            Thank you for subscribing.
          </p>
        ) : (
          <form
            onSubmit={handleSubscribe}
            className="
              flex
              flex-col
              sm:flex-row
              items-center
              justify-center
              gap-4
              max-w-md
              mx-auto
            "
          >
            <input
              type="email"
              required
              placeholder="ENTER YOUR EMAIL"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="
                w-full
                px-4
                py-3
                bg-transparent
                border-b
                border-stone-300
                text-[10px]
                sm:text-xs
                tracking-[0.2em]
                focus:outline-none
                focus:border-black
                placeholder:text-stone-400
                uppercase
              "
            />

            <button
              type="submit"
              className="
                w-full
                sm:w-auto
                px-8
                py-3
                bg-black
                text-white
                text-[10px]
                sm:text-xs
                uppercase
                tracking-[0.3em]
                hover:bg-stone-800
                transition-colors
                whitespace-nowrap
              "
            >
              Join
            </button>
          </form>
        )}

      </section>

      <Footer />

    </div>
  );
}