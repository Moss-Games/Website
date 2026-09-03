import styles from "./MascotFrame.module.css";

/**
 * Wraps the site content in the MossGames mascot's arms.
 *
 * Concept: the mascot stands *behind* the content box, hugging it. The box
 * hides most of its body — only the snout (top), paws (sides) and feet
 * (bottom) are drawn, poking out past the box's edges. Nothing here tries
 * to render the whole animal.
 *
 * Full writeup + the original sketch: docs/DESIGN.md
 * All shape/position tuning lives in MascotFrame.module.css as CSS custom
 * properties — change those before touching this markup.
 */
export default function MascotFrame({ children }) {
  return (
    <div className={styles.box}>
      <span className={`${styles.limb} ${styles.snout}`} aria-hidden="true" />
      <span className={`${styles.limb} ${styles.pawLeft}`} aria-hidden="true" />
      <span className={`${styles.limb} ${styles.pawRight}`} aria-hidden="true" />
      <span className={`${styles.limb} ${styles.footLeft}`} aria-hidden="true" />
      <span className={`${styles.limb} ${styles.footRight}`} aria-hidden="true" />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
