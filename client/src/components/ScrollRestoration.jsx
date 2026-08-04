import { useEffect, useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Scroll positions are kept in memory, keyed by the router's unique
// location.key, so each visited entry in the browser history remembers
// exactly where you left off.
const scrollPositions = new Map();

/**
 * Drop this once near the top of your router (inside <BrowserRouter>,
 * as a sibling to <Routes>). It doesn't render anything — it just
 * watches navigation and restores/saves scroll position automatically
 * for every route in the app.
 *
 * Example:
 *   <BrowserRouter>
 *     <ScrollRestoration />
 *     <Routes>...</Routes>
 *   </BrowserRouter>
 */
export default function ScrollRestoration() {
  const location = useLocation();
  const navigationType = useNavigationType(); // "POP" | "PUSH" | "REPLACE"

  // Let us control scroll ourselves instead of the browser doing its own
  // (sometimes conflicting) automatic restoration.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Runs before the browser paints the new page, so there's no visible
  // flash at the old scroll position.
  useLayoutEffect(() => {
    if (navigationType === "POP") {
      // Back/forward button — restore where the user was, if we saved it.
      const saved = scrollPositions.get(location.key);
      window.scrollTo(0, saved ?? 0);
    } else {
      // A fresh navigation (clicking a link, navigate()) — start at top.
      window.scrollTo(0, 0);
    }
  }, [location, navigationType]);

  // Save scroll position for this history entry right before we leave it.
  useEffect(() => {
    return () => {
      scrollPositions.set(location.key, window.scrollY);
    };
  }, [location]);

  return null;
}