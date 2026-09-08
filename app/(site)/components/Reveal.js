"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Reveal.module.css";

// Fades/slides a section in the first time it scrolls into view. Note:
// `.content` in MascotFrame is the actual scrolling element, not the window —
// IntersectionObserver's default root (the viewport) still works here because
// intersection is clipped by all scrollable ancestors, not just the root.
export default function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      // threshold: 0 — fire as soon as any part of the target enters view.
      // A higher threshold requires that fraction of the *target's own*
      // height to be visible, which breaks down for a target taller than
      // the viewport (e.g. a multi-row card grid on mobile): even scrolled
      // to show it edge-to-edge, the visible fraction can stay under a
      // 0.15 threshold indefinitely, so the content never reveals until
      // the user scrolls far enough by luck — this is what made /projects
      // and other grids look blank on load on mobile.
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${visible ? styles.visible : ""} ${className}`}
    >
      {children}
    </div>
  );
}
