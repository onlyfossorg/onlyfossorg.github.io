import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  a: ({ href, children }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="text-foss-green underline underline-offset-2 hover:text-foss-green/80"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-5 space-y-2 text-gray-300 font-mono text-sm leading-relaxed">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-5 space-y-2 text-gray-300 font-mono text-sm leading-relaxed">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="marker:text-foss-green/60">{children}</li>,
  p: ({ children }) => (
    <p className="text-gray-300 font-mono text-sm leading-relaxed mb-4 last:mb-0">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="text-white font-semibold">{children}</strong>
  ),
  em: ({ children }) => <em className="text-gray-200 italic">{children}</em>,
  h3: ({ children }) => (
    <h3
      className="jersey-25-regular text-white mb-3 mt-6 first:mt-0"
      style={{ fontSize: "1.25rem", letterSpacing: "0.04em" }}
    >
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="font-mono text-foss-green text-sm tracking-wider uppercase mb-2 mt-4">
      {children}
    </h4>
  ),
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt ?? ""}
      className="block w-full max-w-full h-auto object-cover my-6 border border-white/10"
    />
  ),
  blockquote: ({ children }) => (
    <blockquote
      className="border-l-2 border-foss-green/40 pl-4 my-4 text-gray-400 font-mono text-sm"
    >
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <code className="block bg-white/5 border border-white/10 p-4 overflow-x-auto font-mono text-xs text-foss-green/90 my-4">
          {children}
        </code>
      );
    }
    return (
      <code className="px-1.5 py-0.5 bg-white/5 border border-white/10 font-mono text-xs text-foss-green/80">
        {children}
      </code>
    );
  },
  hr: () => <hr className="border-white/10 my-6" />,
};

interface MarkdownBodyProps {
  content: string;
  className?: string;
}

function MarkdownBody({ content, className = "" }: MarkdownBodyProps) {
  return (
    <div className={`event-md ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownBody;
