import { Fragment } from "react";

// Turns "some **bold** and *italic* text" into the same [text, <strong>,
// text, <em>, ...] shape Portable Text's default block renderer produces
// (deliberately not supporting nested/overlapping marks, since
// lib/i18n/content.js's hand-written translations never need them).
function renderInline(text) {
  const nodes = [];
  const pattern = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    if (match[1] !== undefined) nodes.push(<strong key={key++}>{match[1]}</strong>);
    else nodes.push(<em key={key++}>{match[2]}</em>);
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

// Renders a hand-written French translation of a Sanity Portable Text field
// (see lib/i18n/content.js's header comment for the authoring format: plain
// strings, "## "/"> " prefixes, **bold**/*italic*, and `{ media: true }`
// placeholders). Each placeholder consumes the next entry of `mediaBlocks`
// (the ENGLISH original's non-text blocks: image/carousel/mosaic, in the
// order they appear there) via `renderMedia`, so the translation never
// needs to duplicate images/captions, only mark where one goes.
export default function TranslatedRichText({ entries, mediaBlocks = [], renderMedia }) {
  // How many `{ media: true }` placeholders precede each entry (computed
  // up front, rather than an incrementing counter inside the map() below,
  // so the render pass itself never mutates anything).
  const mediaOffsets = [];
  let mediaCount = 0;
  for (const entry of entries) {
    mediaOffsets.push(mediaCount);
    if (entry && typeof entry === "object" && entry.media) mediaCount += 1;
  }

  return (
    <>
      {entries.map((entry, index) => {
        if (entry && typeof entry === "object" && entry.media) {
          const block = mediaBlocks[mediaOffsets[index]];
          return block ? <Fragment key={block._key || index}>{renderMedia(block)}</Fragment> : null;
        }

        const text = String(entry);
        if (!text.trim()) return null;
        if (text.startsWith("## ")) return <h2 key={index}>{renderInline(text.slice(3))}</h2>;
        if (text.startsWith("> ")) return <blockquote key={index}>{renderInline(text.slice(2))}</blockquote>;
        return <p key={index}>{renderInline(text)}</p>;
      })}
    </>
  );
}
