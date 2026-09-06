"use client";

import { useState } from "react";
import styles from "./Newsletter.module.css";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Join the newsletter</h2>
      <p className={styles.subtitle}>
        Get updates on new games and devlogs. No spam, unsubscribe anytime.
      </p>

      {status === "done" ? (
        <p className={styles.thanks}>Thanks for signing up!</p>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            aria-label="Email address"
            className={styles.input}
          />
          <button
            type="submit"
            className={styles.button}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
      )}
      {status === "error" && (
        <p className={styles.error}>
          Something went wrong — please try again.
        </p>
      )}
    </section>
  );
}
