import { getLocale, getTranslator } from "@/lib/i18n/server";
import NotFoundContent from "./components/NotFoundContent";

export async function generateMetadata() {
  const t = getTranslator(await getLocale());
  return { title: t("meta.notFoundTitle"), robots: { index: false } };
}

// Renders inside the (site) layout (MascotFrame included) whenever a
// route segment throws notFound(), e.g. a broken /projects/<slug> or
// /news/<slug> link. See app/global-not-found.js for genuinely unmatched
// URLs, which this file does not catch (see its own comment for why).
export default function NotFound() {
  return <NotFoundContent />;
}
