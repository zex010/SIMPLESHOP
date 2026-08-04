import { useEffect, useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Scroll positions are kept in memory, keyed by the router's unique
// location.key, so each visited entry in the browser history remembers
// exactly where you left off.
const scrollPositions = new Map();

/**
 * Drop-in replacement for a plain "always scroll to top" component.
 * Behavior:
 *  - Clicking a link / navigate() to a NEW page  -> scrolls to top (old behavior, preserved)
 *  - Browser back/forward button                  -> restores the scroll
 *    position you were at when you left that page
 */
export default function ScrollToTop() {
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
      // A fresh navigation (clicking a link, navigate()) — start at top,
      // same as the original ScrollToTop behavior.
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