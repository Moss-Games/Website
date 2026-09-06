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
      { threshold: 0.15 }
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
