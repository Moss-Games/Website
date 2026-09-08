import NotFoundContent from "./components/NotFoundContent";

export const metadata = {
  title: "Page Not Found",
};

// Renders inside the (site) layout — MascotFrame included — whenever a
// route segment throws notFound(), e.g. a broken /projects/<slug> or
// /news/<slug> link. See app/global-not-found.js for genuinely unmatched
// URLs, which this file does not catch (see its own comment for why).
export default function NotFound() {
  return <NotFoundContent />;
}
