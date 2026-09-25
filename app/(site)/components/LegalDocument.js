// Shared layout for the long-form legal pages (/legal, /privacy): a title,
// a "last updated" line, then headed sections of paragraphs.
export default function LegalDocument({ title, updated, sections }) {
  return (
    <article className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16 font-sans sm:px-5 sm:py-12">
      <header className="flex flex-col items-center gap-3 text-center">
        <h1 className="font-display text-4xl tracking-tight text-zinc-900">{title}</h1>
        <p className="text-sm text-zinc-500">{updated}</p>
      </header>

      {sections.map((section) => (
        <section key={section.heading} className="flex flex-col gap-3">
          <h2 className="font-display text-xl text-zinc-900">{section.heading}</h2>
          {section.paragraphs.map((paragraph, index) => (
            <p key={index} className="text-sm leading-relaxed text-zinc-600">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </article>
  );
}

// Inline mailto link styled like the About page's contact link.
export function MailLink({ email }) {
  return (
    <a
      href={`mailto:${email}`}
      className="font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-600"
    >
      {email}
    </a>
  );
}
