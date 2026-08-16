import React, { useState } from "react";
import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  /* =====================================================
     SUBSCRIBE → OPEN GMAIL
  ===================================================== */

  const handleSubscribe = (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    // Empty email
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      setSubscribed(false);
      return;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      setSubscribed(false);
      return;
    }

    const subject = encodeURIComponent(
      "AVERNUS Journal Subscription"
    );

    const body = encodeURIComponent(
      `Hello AVERNUS,

I would like to subscribe to the AVERNUS Journal.

My email address: ${trimmedEmail}

Thank you.`
    );

    // Open Gmail compose window
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=avernusparfums@gmail.com&su=${subject}&body=${body}`,
      "_blank"
    );

    setError("");
    setSubscribed(true);
  };

  return (
    <footer className="bg-[#11100f] text-stone-100 overflow-hidden">

      {/* =====================================================
          TOP BRAND STATEMENT
      ===================================================== */}

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-28 pb-16">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* =================================================
              BRAND
          ================================================= */}

          <div className="lg:col-span-7">

            <BrandLogo variant="splash" />

            <p
              className="
                mt-8
                max-w-xl
                font-serif
                text-2xl
                sm:text-3xl
                md:text-4xl
                leading-[1.25]
                text-stone-200
                font-light
              "
            >
              Fragrance crafted as an
              <span className="italic"> expression </span>
              of memory, character and timeless elegance.
            </p>

            <p
              className="
                mt-7
                max-w-md
                text-xs
                md:text-sm
                leading-7
                text-stone-500
              "
            >
              AVERNUS creates refined fragrances for those
              who appreciate the quiet details. Each composition
              is designed to leave a lasting impression.
            </p>

          </div>


          {/* =================================================
              NEWSLETTER
          ================================================= */}

          <div className="lg:col-span-5 lg:pt-2">

            <p
              className="
                uppercase
                tracking-[0.35em]
                text-[9px]
                text-stone-500
              "
            >
              The Avernus Journal
            </p>

            <h3
              className="
                mt-4
                font-serif
                text-2xl
                md:text-3xl
                font-normal
              "
            >
              Stay in the world of AVERNUS.
            </h3>

            <p
              className="
                mt-4
                text-xs
                leading-6
                text-stone-500
                max-w-sm
              "
            >
              Receive new fragrance discoveries,
              collection announcements and stories
              from the house of AVERNUS.
            </p>


            {/* =================================================
                SUBSCRIPTION FORM
            ================================================= */}

            <form
              onSubmit={handleSubscribe}
              className="mt-8 max-w-md"
            >

              <div
                className="
                  flex
                  border-b
                  border-stone-700
                  pb-3
                  transition
                  focus-within:border-stone-300
                "
              >

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                    setSubscribed(false);
                  }}
                  placeholder="YOUR EMAIL ADDRESS"
                  aria-label="Email address"
                  className="
                    flex-1
                    min-w-0
                    bg-transparent
                    outline-none
                    text-[10px]
                    tracking-[0.2em]
                    text-white
                    placeholder:text-stone-600
                  "
                />

                <button
                  type="submit"
                  className="
                    uppercase
                    tracking-[0.25em]
                    text-[9px]
                    text-stone-300
                    hover:text-white
                    transition
                    cursor-pointer
                    whitespace-nowrap
                  "
                >
                  Subscribe
                </button>

              </div>


              {/* =================================================
                  ERROR MESSAGE
              ================================================= */}

              {error && (
                <p
                  className="
                    mt-3
                    text-[9px]
                    tracking-[0.08em]
                    text-red-400
                  "
                >
                  {error}
                </p>
              )}


              {/* =================================================
                  SUCCESS MESSAGE
              ================================================= */}

              {subscribed && !error && (
                <div
                  className="
                    mt-4
                    flex
                    items-center
                    gap-2
                    text-stone-300
                  "
                >

                  <span
                    className="
                      w-1.5
                      h-1.5
                      rounded-full
                      bg-stone-300
                    "
                  />

                  <p
                    className="
                      text-[9px]
                      uppercase
                      tracking-[0.15em]
                    "
                  >
                    Gmail opened — complete your subscription.
                  </p>

                </div>
              )}

            </form>

          </div>

        </div>
      </div>


      {/* =====================================================
          LARGE EDITORIAL BRAND
      ===================================================== */}

      <div
        className="
          border-y
          border-stone-800
          py-8
          md:py-12
          overflow-hidden
        "
      >

        <p
          className="
            text-center
            font-serif
            text-[15vw]
            md:text-[11vw]
            leading-none
            tracking-[-0.06em]
            text-stone-800
            select-none
            whitespace-nowrap
          "
        >
          AVERNUS
        </p>

      </div>


      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">

        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            lg:grid-cols-4
            gap-10
            md:gap-12
          "
        >

          {/* =================================================
              BOUTIQUE
          ================================================= */}

          <div>

            <h3
              className="
                uppercase
                tracking-[0.3em]
                text-[9px]
                text-stone-300
                mb-6
              "
            >
              Boutique
            </h3>

            <ul className="space-y-4">

              <li>
                <Link
                  to="/new-arrivals"
                  className="
                    text-xs
                    text-stone-500
                    hover:text-white
                    transition
                  "
                >
                  New In
                </Link>
              </li>

              <li>
                <Link
                  to="/men"
                  className="
                    text-xs
                    text-stone-500
                    hover:text-white
                    transition
                  "
                >
                  Men
                </Link>
              </li>

              <li>
                <Link
                  to="/women"
                  className="
                    text-xs
                    text-stone-500
                    hover:text-white
                    transition
                  "
                >
                  Women
                </Link>
              </li>

              <li>
                <Link
                  to="/collection"
                  className="
                    text-xs
                    text-stone-500
                    hover:text-white
                    transition
                  "
                >
                  Collections
                </Link>
              </li>

              <li>
                <Link
                  to="/best-sellers"
                  className="
                    text-xs
                    text-stone-500
                    hover:text-white
                    transition
                  "
                >
                  Best Sellers
                </Link>
              </li>

            </ul>

          </div>


          {/* =================================================
              ACCOUNT
          ================================================= */}

          <div>

            <h3
              className="
                uppercase
                tracking-[0.3em]
                text-[9px]
                text-stone-300
                mb-6
              "
            >
              Account
            </h3>

            <ul className="space-y-4">

              <li>
                <Link
                  to="/cart"
                  className="
                    text-xs
                    text-stone-500
                    hover:text-white
                    transition
                  "
                >
                  Cart
                </Link>
              </li>

              <li>
                <Link
                  to="/wishlist"
                  className="
                    text-xs
                    text-stone-500
                    hover:text-white
                    transition
                  "
                >
                  Wishlist
                </Link>
              </li>

              <li>
                <Link
                  to="/orders"
                  className="
                    text-xs
                    text-stone-500
                    hover:text-white
                    transition
                  "
                >
                  My Orders
                </Link>
              </li>

              <li>
                <Link
                  to="/signin"
                  className="
                    text-xs
                    text-stone-500
                    hover:text-white
                    transition
                  "
                >
                  Sign In
                </Link>
              </li>

            </ul>

          </div>


          {/* =================================================
              HOUSE
          ================================================= */}

          <div>

            <h3
              className="
                uppercase
                tracking-[0.3em]
                text-[9px]
                text-stone-300
                mb-6
              "
            >
              The House
            </h3>

            <ul className="space-y-4">

              <li>
                <Link
                  to="/about"
                  className="
                    text-xs
                    text-stone-500
                    hover:text-white
                    transition
                  "
                >
                  About AVERNUS
                </Link>
              </li>

              <li>
                <Link
                  to="/journal"
                  className="
                    text-xs
                    text-stone-500
                    hover:text-white
                    transition
                  "
                >
                  Journal
                </Link>
              </li>

              <li>
                <Link
                  to="/privacy-policy"
                  className="
                    text-xs
                    text-stone-500
                    hover:text-white
                    transition
                  "
                >
                  Privacy Policy
                </Link>
              </li>

            </ul>

          </div>


          {/* =================================================
              MAISON CORRESPONDENCE
          ================================================= */}

          <div className="col-span-2 sm:col-span-1">

            <h3
              className="
                uppercase
                tracking-[0.3em]
                text-[9px]
                text-stone-300
                mb-6
              "
            >
              Maison Correspondence
            </h3>

            <p
              className="
                text-xs
                leading-6
                text-stone-500
                max-w-[220px]
              "
            >
              For questions regarding your
              order, fragrance or the house,
              our team is here to assist.
            </p>

            <a
              href="mailto:avernusparfums@gmail.com"
              className="
                inline-block
                mt-5
                text-[10px]
                tracking-[0.15em]
                text-stone-300
                hover:text-white
                transition
                break-all
              "
            >
              avernusparfums@gmail.com
            </a>

          </div>

        </div>

      </div>


      {/* =====================================================
          COPYRIGHT
      ===================================================== */}

      <div
        className="
          border-t
          border-stone-800
          px-6
          md:px-12
          py-7
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            flex
            flex-col
            md:flex-row
            justify-between
            items-center
            gap-3
            text-center
            md:text-left
          "
        >

          <span
            className="
              text-[9px]
              tracking-[0.2em]
              uppercase
              text-stone-600
            "
          >
            © 2026 MAISON AVERNUS. All Rights Reserved.
          </span>

          <span
            className="
              text-[9px]
              tracking-[0.2em]
              uppercase
              text-stone-600
            "
          >
            Crafted with Precision
          </span>

        </div>

      </div>

    </footer>
  );
}