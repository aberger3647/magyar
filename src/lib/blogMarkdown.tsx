import type { Components } from "react-markdown";

const headingBase = "scroll-m-20 leading-tight first:mt-0";

export const blogMarkdownComponents: Components = {
  p: ({ children }) => (
    <p className="mb-4 text-base leading-relaxed last:mb-0">{children}</p>
  ),
  h1: ({ children }) => (
    <h2 className={`mt-8 mb-4 text-3xl sm:text-4xl ${headingBase}`}>
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h3 className={`mt-8 mb-3 text-2xl ${headingBase}`}>{children}</h3>
  ),
  h3: ({ children }) => (
    <h4 className={`mt-6 mb-2 text-xl ${headingBase}`}>{children}</h4>
  ),
  h4: ({ children }) => (
    <h5 className={`mt-6 mb-2 text-lg ${headingBase}`}>{children}</h5>
  ),
  h5: ({ children }) => (
    <h6 className={`mt-5 mb-2 text-base font-semibold ${headingBase}`}>
      {children}
    </h6>
  ),
  h6: ({ children }) => (
    <p className="mt-5 mb-2 text-sm uppercase tracking-wider">{children}</p>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-4 border-l-2 border-black pl-4 text-base leading-relaxed">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children }) => (
    <code className="border border-black bg-[#facc15] px-1.5 py-0.5 font-mono text-[0.9em]">
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
        className="underline underline-offset-4"
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
  ol: ({ children }) => (
    <ol className="mb-4 list-decimal space-y-1 pl-6">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  table: ({ children }) => (
    <div className="mb-4 overflow-x-auto border border-black">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b border-black">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="border-r border-black px-3 py-2 text-left last:border-r-0">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-t border-r border-black px-3 py-2 align-top last:border-r-0">
      {children}
    </td>
  ),
  hr: () => <hr className="my-8 border-t border-black" />,
};
