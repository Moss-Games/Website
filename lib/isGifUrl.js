// Next.js's built-in image optimizer (like Sanity's own resize pipeline)
// re-encodes to a static image, which drops a GIF's animation — so any
// <Image> rendering one of these URLs needs `unoptimized` to serve the
// original file as-is instead.
export function isGifUrl(src) {
  return typeof src === "string" && /\.gif(\?|$)/i.test(src);
}
