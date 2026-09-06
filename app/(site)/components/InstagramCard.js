import styles from "./InstagramCard.module.css";

export default function InstagramCard() {
  return (
    <a
      className={styles.card}
      href="https://www.instagram.com/mossgamesfr/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className={styles.icon}>
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="#fff" strokeWidth="2" />
          <path d="M16 11.37a4 4 0 1 1-3.37-3.37 4 4 0 0 1 3.37 3.37z" fill="none" stroke="#fff" strokeWidth="2" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <span className={styles.text}>
        <p className={styles.platform}>Instagram</p>
        <p className={styles.name}>@mossgamesfr</p>
        <p className={styles.handle}>Follow us</p>
      </span>
    </a>
  );
}
