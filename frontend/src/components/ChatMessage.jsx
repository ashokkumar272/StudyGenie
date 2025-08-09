import React from "react";
import PropTypes from "prop-types";
import MarkdownRenderer from "./MarkdownRenderer";

const ChatMessage = ({
  message,
  onThreadClick,
  hasThreads = false,
  showThreadIcon = false,
  isLoading = false,
  isError = false,
  maxWidth = "80%",
  variant = "main",
}) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-t-indigo-500 border-r-indigo-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Thinking...</p>
        </div>
      );
    }
    
    if (message.role === "assistant") {
      return (
        <div className={`selectable-text w-full min-w-0 ${variant === 'panel' ? 'overflow-visible' : ''}`}>
          <MarkdownRenderer content={message.content} variant={variant} />
        </div>
      );
    }

    return <p className="break-words overflow-wrap-anywhere">{message.content}</p>;
  };
  const getMessageClasses = () => {
    const baseClasses = "rounded-xl p-3 relative min-w-0 break-words transition-all duration-300 ease-out";
    
    if (variant === "main") {
      if (message.role === "assistant") {
        return `${baseClasses} w-full bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.05)] ${
          isLoading ? "opacity-80" : ""
        }`;
      } else {
        return `${baseClasses} bg-gradient-to-r from-indigo-600 to-purple-600 text-white max-w-[90%] hover:from-indigo-700 hover:to-purple-700 ${
          isLoading ? "opacity-80" : ""
        }`;
      }
    }

    // Panel variant
    if (message.role === "assistant") {
      return `${baseClasses} w-full bg-white border border-gray-100 shadow-sm ${
        isError ? "bg-red-50 border-red-100" : ""
      } ${isLoading ? "animate-pulse" : ""}`;
    } else {
      return `${baseClasses} bg-gradient-to-r from-indigo-500 to-purple-500 text-white max-w-[85%] shadow-sm`;
    }
  };
  const getContainerClasses = () => {
    return `flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4 last:mb-0`;
  };

  const getTimestampClasses = () => {
    return `text-xs mt-2 ${
      message.role === "user" ? "text-indigo-100" : "text-gray-400"
    }`;
  };

  return (
    <div className={getContainerClasses()}>
      <div
        className={getMessageClasses()}
        data-role={message.role}
        data-message-id={message._id || message.id}
        data-content={message.content}
        style={{
          maxWidth: variant === "main" && message.role === "user" ? maxWidth : "none",
        }}
      >
        {/* Thread icon */}
        {variant === "main" &&
          message.role === "assistant" &&
          showThreadIcon &&
          hasThreads && (
            <button
              onClick={() => onThreadClick && onThreadClick(message)}
              className="absolute -top-2 -right-2 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 z-10"
              title="View side thread"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
              </svg>
            </button>
          )}

        {renderContent()}

        <div className={getTimestampClasses()}>
          <div className="flex items-center gap-2">
            <span>{formatTime(message.timestamp)}</span>
            {message.role === "assistant" && message.aiModel && (
              <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${
                message.aiModel === 'azure-openai' 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-purple-100 text-purple-700 border border-purple-200'
              }`}>
                {message.aiModel === 'azure-openai' ? 'GPT-4.1' : 'Gemini'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ChatMessage.propTypes = {
  message: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    role: PropTypes.oneOf(["user", "assistant"]).isRequired,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]).isRequired,
  }).isRequired,
  onThreadClick: PropTypes.func,
  hasThreads: PropTypes.bool,
  showThreadIcon: PropTypes.bool,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  maxWidth: PropTypes.string,
  variant: PropTypes.oneOf(["main", "panel"]),
};

export default ChatMessage;
