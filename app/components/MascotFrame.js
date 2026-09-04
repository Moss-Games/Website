import styles from "./MascotFrame.module.css";

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
 * Full writeup + the original sketch: docs/DESIGN.md
 * All shape/position tuning lives in MascotFrame.module.css as CSS custom
 * properties — change those before touching this markup.
 */
export default function MascotFrame({ children }) {
  return (
    <div className={styles.box}>
      <span className={styles.brandLeft}>MOSS</span>
      <span className={styles.brandRight}>GAMES</span>
      <span className={`${styles.limb} ${styles.head}`} aria-hidden="true" />
      <span className={`${styles.limb} ${styles.handLeft}`} aria-hidden="true" />
      <span className={`${styles.limb} ${styles.handRight}`} aria-hidden="true" />
      <span className={`${styles.limb} ${styles.footLeft}`} aria-hidden="true" />
      <span className={`${styles.limb} ${styles.footRight}`} aria-hidden="true" />
      <div className={styles.content}>{children}</div>
      <span className={styles.frame} aria-hidden="true" />
    </div>
  );
}
