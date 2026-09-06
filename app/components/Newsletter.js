"use client";

import { useState } from "react";
import styles from "./Newsletter.module.css";

// No email collection wired up yet — submitting just swaps in a placeholder
// message. Comes later once there's somewhere to actually send addresses.
export default function Newsletter() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Join the newsletter</h2>
      <p className={styles.subtitle}>
        Get updates on new games and devlogs. No spam, unsubscribe anytime.
      </p>

      {submitted ? (
        <p className={styles.thanks}>
          Thanks! Newsletter signup is coming soon — stay tuned.
        </p>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            required
            placeholder="you@example.com"
            aria-label="Email address"
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Subscribe
          </button>
        </form>
      )}
    </section>
  );
}
