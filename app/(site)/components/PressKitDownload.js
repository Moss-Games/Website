"use client";

import { useState } from "react";
import { createZip } from "@/lib/zip";
import { useLocale } from "./LocaleProvider";
import ButtonDrift from "./ButtonDrift";
import styles from "../page.module.css";

// "Download everything" button on the press kit (app/(site)/press/page.js).
// The zip is built in the visitor's browser, not by a server route, so
// there's no function cost and no 4.5 MB Vercel response limit (Digitum's
// trailer alone is ~19 MB). Files come through the same-origin
// /press-assets/ rewrite to Sanity's CDN (see next.config.mjs for why).
//
// `files`: [{ url, name }] where `name` is the path inside the zip.
export default function PressKitDownload({ files }) {
  const { t } = useLocale();
  const [progress, setProgress] = useState(null);
  const [failed, setFailed] = useState(false);

  async function download() {
    setFailed(false);
    setProgress(0);
    try {
      const entries = [];
      for (const file of files) {
        const response = await fetch(file.url);
        if (!response.ok) throw new Error(`${file.url}: ${response.status}`);
        entries.push({ name: file.name, data: new Uint8Array(await response.arrayBuffer()) });
        setProgress(entries.length);
      }
      const href = URL.createObjectURL(createZip(entries));
      const link = document.createElement("a");
      link.href = href;
      link.download = "moss-games-press-kit.zip";
      link.click();
      setTimeout(() => URL.revokeObjectURL(href), 10000);
    } catch (error) {
      console.error(error);
      setFailed(true);
    } finally {
      setProgress(null);
    }
  }

  const busy = progress !== null;

  return (
    <div className="flex flex-col items-center gap-2">
      <ButtonDrift>
        <button
          type="button"
          onClick={download}
          disabled={busy}
          className={`${styles.seeAllButton} cursor-pointer disabled:cursor-wait`}
        >
          {busy
            ? t("pressPage.zipProgress", { done: progress, total: files.length })
            : t("pressPage.downloadAll")}{" "}
          <span className={styles.arrow} aria-hidden="true">
            ↓
          </span>
        </button>
      </ButtonDrift>
      <p className="text-xs text-zinc-500" aria-live="polite">
        {failed ? t("pressPage.zipFailed") : t("pressPage.zipHint", { count: files.length })}
      </p>
    </div>
  );
}
