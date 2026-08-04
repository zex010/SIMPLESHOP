// src/pages/JournalArticle.jsx
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Share2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ARTICLES } from "../data/journalData";

export default function JournalArticle() {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const articleIndex = ARTICLES.findIndex((a) => a.id === id);
  const article = ARTICLES[articleIndex];

  // 404 Page for Invalid Article IDs
  if (!article) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col justify-between">
        <Navbar />
        <main className="max-w-3xl mx-auto px-8 py-40 text-center flex-1 flex flex-col items-center justify-center">
          <p className="uppercase tracking-[0.45em] text-xs text-stone-400 mb-6">
            AVERNUS JOURNAL
          </p>
          <h1 className="font-serif text-4xl md:text-5xl tracking-[0.1em] mb-6 font-normal">
            Article Not Found
          </h1>
          <p className="text-stone-500 max-w-md leading-relaxed text-sm mb-10 font-light">
            The essay or editorial piece you are seeking does not exist or has been archived.
          </p>
          <Link
            to="/journal"
            className="inline-flex items-center gap-3 uppercase tracking-[0.35em] text-xs border-b border-black pb-2 hover:gap-5 transition-all"
          >
            <ArrowLeft size={14} /> Back To Journal
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Previous & Next navigation
  const prevArticle = ARTICLES[articleIndex - 1] || null;
  const nextArticle = ARTICLES[articleIndex + 1] || null;

  // 3 Related Articles (filtered)
  const relatedArticles = ARTICLES.filter((a) => a.id !== article.id).slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-stone-200">
      <Navbar />

      {/* ARTICLE HEADER */}
      <header className="pt-32 md:pt-40 pb-16 max-w-4xl mx-auto px-6 md:px-12 text-center">
        <div className="flex items-center justify-center gap-3 text-xs uppercase tracking-[0.35em] text-stone-400 mb-8">
          <span>{article.category}</span>
          <span>·</span>
          <span>{article.date}</span>
          <span>·</span>
          <span>{article.readTime}</span>
        </div>

        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.15] tracking-[0.05em] mb-8 font-normal">
          {article.title}
        </h1>

        {article.subtitle && (
          <p className="text-stone-500 font-serif italic text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            {article.subtitle}
          </p>
        )}

        <p className="text-stone-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto tracking-wide font-light">
          {article.excerpt}
        </p>
      </header>

      {/* HERO IMAGE */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-20 md:mb-28">
        <div className="w-full h-[50vh] md:h-[75vh] overflow-hidden bg-stone-100">
          <img
            src={article.heroImage}
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-1000 ease-out"
          />
        </div>
      </section>

      {/* MAIN ARTICLE BODY */}
      <article className="max-w-[780px] mx-auto px-6 md:px-8">
        <div className="space-y-8 text-stone-800 text-base md:text-[17px] leading-[2.1] font-light">
          {article.contentBlocks.map((block, idx) => {
            if (block.type === "heading") {
              return (
                <h2
                  key={idx}
                  className="font-serif text-2xl md:text-3xl text-black font-normal tracking-wide pt-8 pb-2"
                >
                  {block.text}
                </h2>
              );
            }
            return (
              <p key={idx} className="tracking-wide">
                {block.text}
              </p>
            );
          })}
        </div>

        {/* ELEGANT QUOTE BLOCK */}
        {article.quote && (
          <figure className="my-20 py-12 border-y border-stone-200 text-center">
            <blockquote className="font-serif text-2xl md:text-3xl leading-relaxed text-black tracking-wide italic max-w-2xl mx-auto mb-6">
              “{article.quote}”
            </blockquote>
            {article.quoteAuthor && (
              <figcaption className="uppercase tracking-[0.35em] text-xs text-stone-400">
                — {article.quoteAuthor}
              </figcaption>
            )}
          </figure>
        )}

        {/* SECONDARY FULL-WIDTH IMAGE */}
        {article.secondaryImage && (
          <div className="my-16 overflow-hidden bg-stone-100">
            <img
              src={article.secondaryImage}
              alt="Editorial illustration"
              loading="lazy"
              className="w-full h-[450px] object-cover"
            />
          </div>
        )}

        {/* SHARE BAR */}
        <div className="pt-12 pb-16 flex items-center justify-between border-b border-stone-200">
          <span className="uppercase tracking-[0.35em] text-xs text-stone-400">
            Share Article
          </span>
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 uppercase tracking-[0.25em] text-xs text-black hover:text-stone-500 transition-colors"
          >
            {copied ? (
              <>
                <Check size={14} /> Link Copied
              </>
            ) : (
              <>
                <Share2 size={14} /> Copy Link
              </>
            )}
          </button>
        </div>

        {/* NAVIGATION: PREVIOUS / BACK TO JOURNAL / NEXT */}
        <nav className="py-16 grid grid-cols-3 items-center border-b border-stone-200 text-xs uppercase tracking-[0.3em]">
          <div>
            {prevArticle ? (
              <Link
                to={`/journal/${prevArticle.id}`}
                className="inline-flex items-center gap-2 text-stone-600 hover:text-black hover:-translate-x-1 transition-all"
              >
                <ArrowLeft size={14} />
                <span className="hidden md:inline">Previous</span>
              </Link>
            ) : (
              <span className="opacity-0">None</span>
            )}
          </div>

          <div className="text-center">
            <Link
              to="/journal"
              className="text-black border-b border-black pb-1 hover:border-stone-400 transition-colors"
            >
              Back To Journal
            </Link>
          </div>

          <div className="text-right">
            {nextArticle ? (
              <Link
                to={`/journal/${nextArticle.id}`}
                className="inline-flex items-center gap-2 text-stone-600 hover:text-black hover:translate-x-1 transition-all"
              >
                <span className="hidden md:inline">Next</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <span className="opacity-0">None</span>
            )}
          </div>
        </nav>
      </article>

      {/* YOU MAY ALSO LIKE */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 border-b border-stone-200">
        <p className="uppercase tracking-[0.45em] text-xs text-stone-400 mb-12 text-center">
          You May Also Like
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {relatedArticles.map((rel) => (
            <Link
              key={rel.id}
              to={`/journal/${rel.id}`}
              className="group flex flex-col justify-between h-full"
            >
              <div>
                <div className="overflow-hidden bg-stone-100 mb-6 h-[280px]">
                  <img
                    src={rel.heroImage}
                    alt={rel.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="uppercase tracking-[0.35em] text-[10px] text-stone-400 mb-3">
                  {rel.category} · {rel.date}
                </p>
                <h3 className="font-serif text-2xl leading-snug mb-4 group-hover:text-stone-600 transition-colors">
                  {rel.title}
                </h3>
                <p className="text-stone-500 text-xs leading-relaxed line-clamp-2 font-light">
                  {rel.excerpt}
                </p>
              </div>

              <span className="inline-flex items-center gap-2 uppercase tracking-[0.35em] text-[11px] border-b border-black pb-1 w-fit mt-8 group-hover:gap-4 transition-all">
                Read Article <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* NEWSLETTER SUBSCRIPTION */}
      <section className="max-w-3xl mx-auto px-6 py-28 text-center">
        <p className="uppercase tracking-[0.45em] text-xs text-stone-400 mb-4">
          AVERNUS GAZETTE
        </p>
        <h2 className="font-serif text-3xl md:text-4xl tracking-[0.08em] mb-6 font-normal">
          Subscribe To Our Journal
        </h2>
        <p className="text-stone-500 text-sm leading-relaxed max-w-md mx-auto mb-10 font-light">
          Receive monthly essays on perfumery, ingredient harvests, and private olfactive releases.
        </p>

        {subscribed ? (
          <p className="uppercase tracking-[0.35em] text-xs text-black border border-stone-200 py-4 px-6 inline-block">
            Thank you for subscribing.
          </p>
        ) : (
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              placeholder="ENTER YOUR EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-transparent border-b border-stone-300 text-xs tracking-[0.25em] focus:outline-none focus:border-black placeholder:text-stone-400 uppercase"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-black text-white text-xs uppercase tracking-[0.35em] hover:bg-stone-800 transition-colors whitespace-nowrap"
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