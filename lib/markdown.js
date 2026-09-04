// Deliberately minimal: our game descriptions only ever use paragraphs and
// **bold**, so a full Markdown library would be overkill. Not meant to
// handle arbitrary Markdown input.

export function splitParagraphs(markdown) {
  if (!markdown) return [];
  return markdown
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function parseInlineBold(text) {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part, index) =>
      part.startsWith("**") && part.endsWith("**")
        ? { key: index, bold: true, text: part.slice(2, -2) }
        : { key: index, bold: false, text: part }
    );
}
