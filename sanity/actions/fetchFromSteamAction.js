import { useCallback, useState } from "react";

// Registered in sanity.config.js's `document.actions`. Only renders for
// "game" documents whose storeUrl currently points at Steam — same field
// as the page's store button, no separate steamUrl field (see
// sanity/schemaTypes/gameType.js for why that split was undone). The actual
// fetch-from-Steam + asset-upload + patch logic lives server-side in
// app/api/sanity/import-steam/route.js (needs the write token, which must
// never reach the Studio's client-side bundle) — this is just the button.
//
// Sanity's document actions API calls this plain, lowercase-named function
// through a valid React tree despite it not looking like a component —
// that's the documented shape for custom async document actions, hooks
// included. eslint's rules-of-hooks can't see that, hence the disable below.
/* eslint-disable react-hooks/rules-of-hooks */
export function fetchFromSteamAction(props) {
  const { draft, published, type, onComplete } = props;
  const doc = draft || published;
  const [state, setState] = useState("idle"); // idle | loading | error

  const handle = useCallback(async () => {
    setState("loading");
    try {
      const response = await fetch("/api/sanity/import-steam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: doc._id, steamUrl: doc.storeUrl }),
      });
      const result = await response.json().catch(() => ({ ok: false }));
      if (!result.ok) throw new Error(result.error || "import_failed");
      setState("idle");
    } catch (error) {
      console.error("Fetch from Steam failed", error);
      setState("error");
    } finally {
      onComplete();
    }
  }, [doc, onComplete]);

  if (type !== "game" || !doc?.storeUrl?.includes("steampowered.com")) return null;

  return {
    label:
      state === "loading"
        ? "Fetching from Steam…"
        : state === "error"
          ? "Fetch from Steam failed — retry?"
          : "Fetch from Steam",
    tone: state === "error" ? "critical" : "primary",
    disabled: state === "loading",
    onHandle: handle,
  };
}
