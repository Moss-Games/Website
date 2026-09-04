"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./MascotFrame.module.css";

// How long (ms) after the last wheel event before the hands settle back down.
const SCROLL_IDLE_DELAY = 150;
// Must match the `--hand-wiggle` transition duration in MascotFrame.module.css.
const SETTLE_DURATION = 200;

/**
 * Wraps the site content in the MossGames mascot's arms.
 *
 * Concept: the mascot stands *behind* the content box, hugging it. The box
 * hides most of its body — only the head (top), hands (sides) and feet
 * (bottom) are drawn, poking out past the box's edges. The head and hands
 * are cropped from the real logo artwork and overlap *on top of* the page
 * content (not just the outside of the border), so they visibly grip and
 * mask part of the page they're holding. Nothing here tries to render the
 * whole animal.
 *
 * "MOSS" / "GAMES" flank the head in the margin, set in the Super Corn display
 * font (app/fonts/SuperCorn.ttf, wired up in app/layout.js).
 *
 * While the page content is being wheel-scrolled, the hands wiggle back and
 * forth (rotating around the wrist, where they meet the border) as if the
 * mascot were the one dragging the page — see .scrolling in the CSS module.
 * Scrolling down leans both hands upward (as if pulling the page down past
 * them); scrolling up leans them downward. --mascot-scroll-dir carries that
 * sign into the CSS; the two hands' rotation formulas are mirrored (one adds
 * the wiggle, the other subtracts it) so they read as moving the same real
 * direction rather than opposite ways.
 *
 * Stopping a running CSS animation snaps its property to its resting value
 * instantly — transitions don't pick up where an animation left off. So on
 * the last wheel event, instead of just dropping .scrolling, we read the
 * hands' current mid-wiggle angle, freeze it as an inline override, stop the
 * animation, then (a frame later) transition that frozen angle down to 0 —
 * handing off from animation to transition smoothly instead of snapping.
 *
 * Full writeup + the original sketch: docs/DESIGN.md
 * All shape/position tuning lives in MascotFrame.module.css as CSS custom
 * properties — change those before touching this markup.
 */
export default function MascotFrame({ children }) {
  const contentRef = useRef(null);
  const handLeftWrapRef = useRef(null);
  const idleTimerRef = useRef(null);
  const settleTimerRef = useRef(null);
  const scrollDirRef = useRef(1);
  const touchYRef = useRef(null);
  const [scrolling, setScrolling] = useState(false);
  const [scrollDir, setScrollDir] = useState(1);
  // Non-null while easing the hands back to rest after a scroll stops; holds
  // the CSS <angle> value currently driving --hand-wiggle on both hands.
  const [freezeWiggle, setFreezeWiggle] = useState(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    // Shared by both the desktop wheel handler and the mobile touch handler
    // below — `deltaY` follows the wheel-event convention (positive = content
    // scrolling down) so both input types drive the same wiggle direction.
    const handleScrollDelta = (deltaY) => {
      const dir = deltaY > 0 ? 1 : -1;
      if (scrollDirRef.current !== dir) {
        scrollDirRef.current = dir;
        setScrollDir(dir);
      }

      clearTimeout(settleTimerRef.current);
      setFreezeWiggle(null); // let the loop animation drive again
      setScrolling(true);

      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        const current = handLeftWrapRef.current
          ? getComputedStyle(handLeftWrapRef.current).getPropertyValue("--hand-wiggle")
          : "";
        setFreezeWiggle(current || "0deg");
        setScrolling(false);

        // Two rAFs: the first lets the browser paint the frozen angle as the
        // animation stops, the second then changes it to 0deg so the CSS
        // transition has a real "from" value to ease away from.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setFreezeWiggle("0deg");
          });
        });

        settleTimerRef.current = setTimeout(() => {
          setFreezeWiggle(null);
        }, SETTLE_DURATION);
      }, SCROLL_IDLE_DELAY);
    };

    const handleWheel = (event) => handleScrollDelta(event.deltaY);

    // Mobile/touch devices never fire `wheel` events, so the hands need their
    // own touch-driven trigger. A finger dragging up scrolls the content down
    // (same real-world direction as a positive wheel deltaY), so the delta is
    // expressed as (previous touch Y - current touch Y).
    const handleTouchStart = (event) => {
      touchYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event) => {
      const y = event.touches[0]?.clientY;
      if (y == null || touchYRef.current == null) return;
      const deltaY = touchYRef.current - y;
      touchYRef.current = y;
      if (deltaY !== 0) handleScrollDelta(deltaY);
    };

    const handleTouchEnd = () => {
      touchYRef.current = null;
    };

    content.addEventListener("wheel", handleWheel, { passive: true });
    content.addEventListener("touchstart", handleTouchStart, { passive: true });
    content.addEventListener("touchmove", handleTouchMove, { passive: true });
    content.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      content.removeEventListener("wheel", handleWheel);
      content.removeEventListener("touchstart", handleTouchStart);
      content.removeEventListener("touchmove", handleTouchMove);
      content.removeEventListener("touchend", handleTouchEnd);
      clearTimeout(idleTimerRef.current);
      clearTimeout(settleTimerRef.current);
    };
  }, []);

  const handStyle = freezeWiggle ? { "--hand-wiggle": freezeWiggle } : undefined;

  return (
    <div
      className={`${styles.box} ${scrolling ? styles.scrolling : ""}`}
      style={{ "--mascot-scroll-dir": scrollDir }}
    >
      <Link href="/" className={styles.logo} aria-label="MossGames home">
        <img src="/images/logo.png" alt="MossGames" />
      </Link>
      <Link href="/" className={styles.brandLeft}>
        MOSS
      </Link>
      <Link href="/" className={styles.brandRight}>
        GAMES
      </Link>
      <Link href="/about" className={styles.aboutUs}>
        About Us
      </Link>
      <Link href="/" className={`${styles.limb} ${styles.head}`} aria-label="MossGames home" />
      <span
        ref={handLeftWrapRef}
        className={styles.handWrap + " " + styles.handLeftWrap}
        style={handStyle}
        aria-hidden="true"
      >
        <span className={styles.handLeftImg} />
      </span>
      <span
        className={styles.handWrap + " " + styles.handRightWrap}
        style={handStyle}
        aria-hidden="true"
      >
        <span className={styles.handRightImg} />
      </span>
      <span className={`${styles.limb} ${styles.footLeft}`} aria-hidden="true" />
      <span className={`${styles.limb} ${styles.footRight}`} aria-hidden="true" />
      <div className={styles.content} ref={contentRef}>
        {children}
      </div>
      <span className={styles.frame} aria-hidden="true" />
    </div>
  );
}
