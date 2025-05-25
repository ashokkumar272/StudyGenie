import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Copy, Check } from 'lucide-react';
import 'highlight.js/styles/github-dark.css';

const MarkdownRenderer = ({ content }) => {
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
      // Inline code styling
      return (
        <code 
          className="bg-gray-700 text-white px-1 py-0.5 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    }

    // Block code with copy button
    const codeString = String(children).replace(/\n$/, '');
    const blockIndex = `${Date.now()}-${Math.random()}`;
    
    return (
      <div className="relative group my-4 max-w-full">
        <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-md">
          <span className="text-gray-300 text-sm font-medium">
            {language || 'text'}
          </span>
          <button
            onClick={() => handleCopyCode(codeString, blockIndex)}
            className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm"
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
          </button>        </div>
        <pre className="bg-gray-800 text-white rounded-b-md text-sm font-mono p-4 overflow-x-auto max-w-full">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    );
  };
  const PreBlock = ({ children, ...props }) => {
    // Extract the code element from pre
    const codeElement = React.Children.toArray(children).find(
      child => React.isValidElement(child) && child.type === 'code'
    );
    
    if (codeElement) {
      return <CodeBlock {...codeElement.props} />;
    }
    
    // Fallback for pre without code
    return (
      <pre className="bg-gray-800 text-white p-4 rounded-md text-sm font-mono my-4 overflow-x-auto max-w-full" {...props}>
        {children}
      </pre>
    );
  };  return (
    <div className="w-full break-words prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code: CodeBlock,
          pre: PreBlock,
          // Custom styling for other elements - neutral for light backgrounds
          h1: ({ children, ...props }) => (
            <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-6" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-xl font-bold text-gray-900 mb-3 mt-5" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-lg font-bold text-gray-900 mb-2 mt-4" {...props}>
              {children}
            </h3>
          ),
          p: ({ children, ...props }) => (
            <p className="text-gray-700 mb-3 leading-relaxed" {...props}>
              {children}
            </p>
          ),
          ul: ({ children, ...props }) => (
            <ul className="list-disc list-inside text-gray-700 mb-3 space-y-1" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal list-inside text-gray-700 mb-3 space-y-1" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="text-gray-700" {...props}>
              {children}
            </li>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4" {...props}>
              {children}
            </blockquote>
          ),
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
          a: ({ children, href, ...props }) => (
            <a 
              href={href} 
              className="text-blue-600 hover:text-blue-800 underline" 
              target="_blank" 
              rel="noopener noreferrer" 
              {...props}
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
