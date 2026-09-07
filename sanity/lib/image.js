import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/env";

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlForImage(source) {
  return builder.image(source);
}

// Sanity's image transform pipeline (width/height/format/etc.) always
// re-encodes the output as a static jpg/png/webp, which drops a GIF's
// animation — the only way to keep it animated is to serve the original
// file untouched, with no transform params at all.
function isAnimatedGif(source) {
  const ref = source?.asset?._ref || source?.asset?._id || source?._ref || "";
  return ref.endsWith("-gif");
}

// Resize helper used everywhere an image needs specific dimensions —
// skips the resize for GIFs so they stay animated (see isAnimatedGif).
export function imageUrl(source, { width, height } = {}) {
  if (!source) return null;
  if (isAnimatedGif(source)) return urlForImage(source).url();
  let img = urlForImage(source);
  if (width) img = img.width(width);
  if (height) img = img.height(height);
  return img.url();
}
