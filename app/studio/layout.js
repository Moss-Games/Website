// Separate root layout (Next.js route groups let a subtree opt out of the
// site's own <html>/<body> — see app/(site)/layout.js) so the embedded
// Sanity Studio gets the whole page, with none of the site's chrome or CSS.
export { metadata, viewport } from "next-sanity/studio";

export default function StudioLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
