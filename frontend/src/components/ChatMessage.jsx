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
  variant = "main", // 'main' or 'panel'
}) => {
  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center">
          <div className="w-5 h-5 border-t-2 border-indigo-500 rounded-full animate-spin mr-2"></div>
          <p>Thinking...</p>
        </div>
      );
    }    if (message.role === "assistant") {
      return (
        <div className="selectable-text">
          <MarkdownRenderer content={message.content} />
        </div>
      );
    }

    return <p>{message.content}</p>;
  };

  const getMessageClasses = () => {
    const baseClasses = `max-w-[${maxWidth}] rounded-lg p-3 relative`;

    if (variant === "main") {
      return `${baseClasses} p-4 message-with-thread ${
        message.role === "user"
          ? "bg-indigo-600 text-white"
          : "bg-white shadow-sm border"
      } ${isLoading ? "opacity-60" : ""}`;
    }

    // Panel variant
    return `${baseClasses} ${
      message.role === "user"
        ? "bg-indigo-600 text-white"
        : isError
        ? "bg-red-50 border border-red-200"
        : "bg-white shadow-sm border"
    } ${isLoading ? "opacity-60" : ""}`;
  };

  const getTimestampClasses = () => {
    if (variant === "main") {
      return `text-xs mt-1 ${
        message.role === "user" ? "text-indigo-200" : "text-gray-500"
      }`;
    }

    // Panel variant
    return `text-xs mt-1 ${
      message.role === "user" ? "text-indigo-200" : "text-gray-500"
    }`;
  };

  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={getMessageClasses()}
        data-role={message.role}
        data-message-id={message._id || message.id}
        data-content={message.content}
      >
        {/* Thread icon for assistant messages that have side threads (main variant only) */}
        {variant === "main" &&
          message.role === "assistant" &&
          showThreadIcon &&
          hasThreads && (
            <button
              onClick={() => onThreadClick && onThreadClick(message)}
              className="thread-icon"
              title="View side thread"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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
          {formatTime(message.timestamp)}
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
