import { splitParagraphs, parseInlineBold } from "@/lib/markdown";

export default function MarkdownText({ content, className }) {
  return (
    <>
      {splitParagraphs(content).map((paragraph, index) => (
        <p key={index} className={className}>
          {parseInlineBold(paragraph).map((part) =>
            part.bold ? (
              <strong key={part.key}>{part.text}</strong>
            ) : (
              <span key={part.key}>{part.text}</span>
            )
          )}
        </p>
      ))}
    </>
  );
}
