import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Copy, Check } from 'lucide-react';
import 'highlight.js/styles/github-dark.css';

const MarkdownRenderer = ({ content, variant = "main" }) => {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyCode = async (code, blockIndex) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(blockIndex);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const CodeBlock = ({ children, className, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const isInline = !className;
    
    if (isInline) {
      return (
        <code 
          className="bg-gray-300 text-black px-1.5 py-0.5 rounded-md text-sm font-mono border border-blue-100"
          {...props}
        >
          {children}
        </code>
      );
    }
    
    const codeString = String(children).replace(/\n$/, '');
    const blockIndex = `${Date.now()}-${Math.random()}`;
    
    const containerClasses = variant === "panel" 
      ? "relative group w-full min-w-0 max-w-full overflow-hidden rounded-xl shadow-sm"
      : "relative group w-full min-w-0 rounded-xl shadow-sm";
    const preClasses = variant === "panel"
      ? "bg-gray-900 text-gray-100 text-sm font-mono px-3 py-2 overflow-x-auto w-full min-w-0 max-w-full"
      : "bg-gray-900 text-gray-100 text-sm font-mono px-3 py-2 overflow-x-auto w-full min-w-0";
    
    return (
      <div className={containerClasses}>
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 rounded-t-xl">
          <span className="text-gray-300 text-xs font-medium tracking-wider uppercase">
            {language || 'text'}
          </span>
          <button
            onClick={() => handleCopyCode(codeString, blockIndex)}
            className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors bg-gray-700/50 hover:bg-gray-700 px-3 py-1 rounded-lg text-xs"
            title="Copy code"
          >
            {copiedCode === blockIndex ? (
              <>
                <Check size={14} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <pre className={preClasses}>
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    );
  };

  const PreBlock = ({ children, ...props }) => {
    const codeElement = React.Children.toArray(children).find(
      child => React.isValidElement(child) && child.type === 'code'
    );
    
    if (codeElement) {
      return <CodeBlock {...codeElement.props} />;
    }
    
    // Reduce vertical padding for fallback pre blocks
    return (
      <pre className="bg-gray-800 text-white rounded-md text-sm font-mono my-4 overflow-x-auto shadow-sm" {...props}>
        {children}
      </pre>
    );
  };

  return (
    <div className={`w-full break-words min-w-0 ${variant === "panel" ? "" : "prose max-w-none"}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code: CodeBlock,
          pre: PreBlock,
          // Improved heading styles
          h1: ({ children, ...props }) => (
            <h1 className="text-2xl font-bold text-gray-800 mb-4 mt-6 pb-2 border-b border-gray-200" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-xl font-semibold text-gray-800 mb-3 mt-5 pb-2 border-b border-gray-200" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-4" {...props}>
              {children}
            </h3>
          ),
          // Improved paragraph styling
          p: ({ children, ...props }) => (
            <p className="text-gray-700 mb-4 leading-relaxed" {...props}>
              {children}
            </p>
          ),
          // Enhanced list styling
          ul: ({ children, ...props }) => (
            <ul className="list-disc list-outside ml-6 text-gray-700 mb-4 space-y-2" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal list-outside ml-6 text-gray-700 mb-4 space-y-2" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="text-gray-700 leading-relaxed marker:text-gray-400" {...props}>
              {children}
            </li>
          ),
          // More prominent blockquote
          blockquote: ({ children, ...props }) => (
            <blockquote className="border-l-4 border-blue-400 pl-4 text-gray-700 my-5 bg-blue-50 py-3 rounded-r-lg italic" {...props}>
              {children}
            </blockquote>
          ),
          // Improved text formatting
          strong: ({ children, ...props }) => (
            <strong className="font-bold text-gray-900" {...props}>
              {children}
            </strong>
          ),
          em: ({ children, ...props }) => (
            <em className="italic text-gray-700" {...props}>
              {children}
            </em>
          ),
          // Enhanced link styling
          a: ({ children, href, ...props }) => (
            <a 
              href={href} 
              className="text-blue-600 hover:text-blue-800 underline underline-offset-4 decoration-blue-300 hover:decoration-blue-500 transition-colors" 
              target="_blank" 
              rel="noopener noreferrer" 
              {...props}
            >
              {children}
            </a>
          ),
          // Improved table styling
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-5 shadow-sm rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-gray-50" {...props}>
              {children}
            </thead>
          ),
          tbody: ({ children, ...props }) => (
            <tbody className="bg-white divide-y divide-gray-200" {...props}>
              {children}
            </tbody>
          ),
          tr: ({ children, ...props }) => (
            <tr className="hover:bg-gray-50/80 transition-colors" {...props}>
              {children}
            </tr>
          ),
          th: ({ children, ...props }) => (
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 bg-gray-100" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="px-4 py-3 text-sm text-gray-800" {...props}>
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;