import type { Components } from "react-markdown";

const headingTight =
  "scroll-m-20 font-bold tracking-tight text-foreground first:mt-0";

export const blogMarkdownComponents: Components = {
  p: ({ children }) => (
    <p className="mb-4 text-base leading-relaxed text-foreground last:mb-0">
      {children}
    </p>
  ),
  h1: ({ children }) => (
    <h2 className={`mt-8 mb-4 text-3xl sm:text-4xl ${headingTight}`}>
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h3 className={`mt-8 mb-3 text-2xl ${headingTight}`}>{children}</h3>
  ),
  h3: ({ children }) => (
    <h4 className={`mt-6 mb-2 text-xl font-semibold ${headingTight}`}>
      {children}
    </h4>
  ),
  h4: ({ children }) => (
    <h5 className={`mt-6 mb-2 text-lg font-semibold ${headingTight}`}>
      {children}
    </h5>
  ),
  h5: ({ children }) => (
    <h6 className={`mt-5 mb-2 text-base font-semibold ${headingTight}`}>
      {children}
    </h6>
  ),
  h6: ({ children }) => (
    <p
      className={`mt-5 mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground`}
    >
      {children}
    </p>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-4 border-l-4 border-primary/30 pl-4 text-base italic leading-relaxed text-muted-foreground">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children }) => (
    <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
      {children}
    </code>
  ),
  del: ({ children }) => (
    <del className="line-through opacity-80">{children}</del>
  ),
  a: ({ href, children }) => {
    const external = href?.startsWith("http");
    return (
      <a
        href={href ?? "#"}
        className="text-primary underline underline-offset-4"
        rel={external ? "noopener noreferrer" : undefined}
        target={external ? "_blank" : undefined}
      >
        {children}
      </a>
    );
  },
  ul: ({ children }) => (
    <ul className="mb-4 list-disc space-y-1 pl-6">{children}</ul>
  ),
  ol: ({ children, start }) => (
    <ol start={start} className="mb-4 list-decimal space-y-1 pl-6">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  table: ({ children }) => (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b border-border">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 text-left font-semibold">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border-b border-border/50 px-3 py-2 align-top">
      {children}
    </td>
  ),
  hr: () => <hr className="my-8 border-border" />,
};
