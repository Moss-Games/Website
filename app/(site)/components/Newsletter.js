"use client";

import { useState } from "react";
import { useLocale } from "./LocaleProvider";
import ButtonDrift from "./ButtonDrift";
import styles from "./Newsletter.module.css";

export default function Newsletter() {
  const { t } = useLocale();
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
      <h2 className={styles.title}>{t("newsletter.title")}</h2>
      <p className={styles.subtitle}>{t("newsletter.subtitle")}</p>

      {status === "done" ? (
        <p className={styles.thanks}>{t("newsletter.thanks")}</p>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t("newsletter.placeholder")}
            aria-label={t("newsletter.emailAriaLabel")}
            className={styles.input}
          />
          <ButtonDrift>
            <button
              type="submit"
              className={styles.button}
              disabled={status === "loading"}
            >
              {status === "loading" ? t("newsletter.subscribing") : t("newsletter.subscribe")}
            </button>
          </ButtonDrift>
        </form>
      )}
      {status === "error" && <p className={styles.error}>{t("newsletter.error")}</p>}
    </section>
  );
}
