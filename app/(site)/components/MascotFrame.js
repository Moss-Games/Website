"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./MascotFrame.module.css";

// How long (ms) after the last scroll event before the hands settle back down.
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
 * While the page content is scrolling — wheel, touch drag, or momentum/
 * inertial scroll after a finger lifts — the hands wiggle back and forth
 * (rotating around the wrist, where they meet the border) as if the mascot
 * were the one dragging the page — see .scrolling in the CSS module.
 * Scrolling down leans both hands upward (as if pulling the page down past
 * them); scrolling up leans them downward. --mascot-scroll-dir carries that
 * sign into the CSS; the two hands' rotation formulas are mirrored (one adds
 * the wiggle, the other subtracts it) so they read as moving the same real
 * direction rather than opposite ways.
 *
 * Stopping a running CSS animation snaps its property to its resting value
 * instantly — transitions don't pick up where an animation left off. So on
 * the last scroll event, instead of just dropping .scrolling, we read the
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
  const scrollTopRef = useRef(0);
  const [scrolling, setScrolling] = useState(false);
  const [scrollDir, setScrollDir] = useState(1);
  // Non-null while easing the hands back to rest after a scroll stops; holds
  // the CSS <angle> value currently driving --hand-wiggle on both hands.
  const [freezeWiggle, setFreezeWiggle] = useState(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    scrollTopRef.current = content.scrollTop;

    // `deltaY` follows the wheel-event convention (positive = content
    // scrolling down).
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

    // Driven off the actual `scroll` event rather than `wheel`/`touchmove`:
    // those only fire while an input device is actively moving, so on mobile
    // the hands would freeze the moment a finger lifts even though the page
    // keeps gliding from momentum/inertial scrolling — `scroll` keeps firing
    // for as long as scrollTop is actually changing, covering wheel, touch
    // drag, and momentum scroll alike with one code path.
    const handleScroll = () => {
      const top = content.scrollTop;
      const deltaY = top - scrollTopRef.current;
      scrollTopRef.current = top;
      if (deltaY !== 0) handleScrollDelta(deltaY);
    };

    content.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      content.removeEventListener("scroll", handleScroll);
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
        <Image src="/images/logo.png" alt="MossGames" width={288} height={288} priority />
      </Link>
      <Link href="/" className={styles.brandLeft}>
        MOSS
      </Link>
      <Link href="/" className={styles.brandRight}>
        GAMES
      </Link>
      <Link href="/" className={styles.brandMobile} aria-label="MossGames home">
        MOSS GAMES
      </Link>
      <div className={styles.topNav}>
        <Link href="/projects" className={`${styles.navLink} ${styles.navLinkDesktopOnly}`}>
          All Projects
        </Link>
        <Link href="/news" className={styles.navLink}>
          News
        </Link>
        <Link href="/about" className={styles.navLink}>
          About Us
        </Link>
      </div>
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
