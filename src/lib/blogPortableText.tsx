import type { PortableTextComponents } from "@portabletext/react";

const headingTight =
  "scroll-m-20 font-bold tracking-tight text-foreground first:mt-0";

export const blogPortableTextComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 text-base leading-relaxed text-foreground last:mb-0">
        {children}
      </p>
    ),
    h1: ({ children }) => (
      <h1
        className={`mt-8 mb-4 text-3xl sm:text-4xl ${headingTight}`}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className={`mt-8 mb-3 text-2xl ${headingTight}`}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className={`mt-6 mb-2 text-xl font-semibold ${headingTight}`}>
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className={`mt-6 mb-2 text-lg font-semibold ${headingTight}`}>
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className={`mt-5 mb-2 text-base font-semibold ${headingTight}`}>
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6
        className={`mt-5 mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground ${headingTight}`}
      >
        {children}
      </h6>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mb-4 border-l-4 border-primary/30 pl-4 text-base italic leading-relaxed text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
        {children}
      </code>
    ),
    underline: ({ children }) => (
      <span className="underline underline-offset-2">{children}</span>
    ),
    "strike-through": ({ children }) => (
      <del className="line-through opacity-80">{children}</del>
    ),
    link: ({ value, children }) => {
      const href = value?.href ?? "#";
      const external = href.startsWith("http");
      return (
        <a
          href={href}
          className="text-primary underline underline-offset-4"
          rel={external ? "noopener noreferrer" : undefined}
          target={external ? "_blank" : undefined}
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 list-disc space-y-1 pl-6">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 list-decimal space-y-1 pl-6">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
};
