"use client";

import { useEffect, useRef } from "react";
import styles from "./ButtonDrift.module.css";

/**
 * Wraps one of the site's black CTA buttons (see page.module.css's
 * .seeAllButton, NotFoundContent's .primary, Newsletter's .button,
 * projects/[slug]'s .storeButton) so page scrolling gives it a small
 * physical "yank" — the button lags/springs relative to its own resting
 * (floating) position instead of just riding along with the page, with a
 * few motion-streak lines trailing behind it while it's actually moving.
 * Purely additive: doesn't touch the button's own markup, hover, or its
 * separate idle-float CSS animation — this only ever nudges the wrapper.
 *
 * Physics constants were tuned in isolation (small node script) before
 * wiring in: ~9px peak displacement on a hard scroll fling, settling with a
 * light overshoot in ~500ms.
 *
 * The wind streaks are deliberately driven off the *raw* scroll delta, not
 * off the spring's own velocity: the spring legitimately overshoots/
 * oscillates as it settles (that's what makes the position feel physical),
 * but that means its velocity sign flips mid-settle even during sustained
 * one-direction scrolling — using it for the streak side made the wind
 * flicker between above/below instead of tracking which way the page was
 * actually moving. windDir/windSpeed track the real scroll input directly
 * and just decay on their own once scrolling stops.
 */
export default function ButtonDrift({ children, className = "" }) {
  const wrapRef = useRef(null);
  const tiltRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const tilt = tiltRef.current;
    if (!wrap || !tilt) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scrollRoot = wrap.closest("[data-scroll-root]");
    if (!scrollRoot) return;

    const STIFFNESS = 0.15; // pulls the button back to its resting float position
    const DAMPING = 0.45;
    const KICK = 0.12; // how much of each scroll delta becomes velocity
    const MAX_VELOCITY = 10;
    const SETTLE_EPSILON = 0.05;

    const WIND_NORM = 6; // px/frame of scroll delta that reads as "full speed" wind
    const WIND_ATTACK = 0.6; // how fast windSpeed rises toward a new (higher) target
    const WIND_DECAY = 0.85; // per-frame falloff once scrolling stops/slows

    let offset = 0;
    let velocity = 0;
    let windSpeed = 0;
    let windDir = 1;
    let lastScrollTop = scrollRoot.scrollTop;

    const tick = () => {
      const scrollTop = scrollRoot.scrollTop;
      const delta = scrollTop - lastScrollTop;
      lastScrollTop = scrollTop;

      velocity += delta * KICK;
      velocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocity));
      velocity += -offset * STIFFNESS - velocity * DAMPING;
      offset += velocity;

      const windTarget = Math.min(1, Math.abs(delta) / WIND_NORM);
      if (delta !== 0) {
        // Scrolling down (delta > 0) trails the streak above the button;
        // scrolling up trails it below.
        windDir = delta > 0 ? 1 : -1;
        windSpeed += (windTarget - windSpeed) * WIND_ATTACK;
      } else {
        windSpeed *= WIND_DECAY;
      }
      if (windSpeed < SETTLE_EPSILON) windSpeed = 0;

      const settled =
        Math.abs(offset) < SETTLE_EPSILON && Math.abs(velocity) < SETTLE_EPSILON && windSpeed === 0;
      if (settled) {
        wrap.style.transform = "";
        tilt.style.transform = "";
        wrap.style.removeProperty("--wind-opacity");
        wrap.style.removeProperty("--wind-scale");
        delete wrap.dataset.windDir;
        rafRef.current = null;
        return;
      }

      // Position lag lives on the outer wrap (so the wind streaks, also
      // children of wrap, translate along with the button); the tilt lives
      // on the inner span only, so the streaks never rotate with it and
      // stay strictly vertical/horizontal regardless of how much the
      // button itself leans into the drag.
      const rotation = Math.max(-5, Math.min(5, offset * 0.4));
      wrap.style.transform = `translateY(${offset.toFixed(2)}px)`;
      tilt.style.transform = `rotate(${rotation.toFixed(2)}deg)`;

      // sqrt curve: even a modest scroll speed already shows a clear streak
      // instead of needing to approach full speed before becoming visible.
      const displayed = Math.sqrt(windSpeed);
      wrap.style.setProperty("--wind-opacity", displayed.toFixed(2));
      wrap.style.setProperty("--wind-scale", displayed.toFixed(2));
      // data-wind-dir (not a CSS var) — the CSS needs to swap which edge
      // (top vs bottom) the streaks anchor to, not just flip a signed
      // offset, so this drives an attribute selector instead of a calc().
      wrap.dataset.windDir = String(windDir);

      rafRef.current = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(tick);
    };

    scrollRoot.addEventListener("scroll", kick, { passive: true });
    return () => {
      scrollRoot.removeEventListener("scroll", kick);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <span ref={wrapRef} className={`${styles.drift} ${className}`}>
      <span className={styles.streaks} aria-hidden="true">
        <span className={styles.streak} />
        <span className={styles.streak} />
        <span className={styles.streak} />
      </span>
      <span ref={tiltRef} className={styles.tilt}>
        {children}
      </span>
    </span>
  );
}
