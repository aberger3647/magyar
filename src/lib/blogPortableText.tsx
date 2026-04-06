import type { PortableTextComponents } from "@portabletext/react";

export const blogPortableTextComponents: Partial<PortableTextComponents> = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 text-base leading-relaxed text-foreground last:mb-0">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-8 mb-3 scroll-m-20 text-2xl font-bold tracking-tight first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 mb-2 text-xl font-semibold tracking-tight first:mt-0">
        {children}
      </h3>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
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
