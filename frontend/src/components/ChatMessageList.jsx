import React from "react";
import ChatMessage from "./ChatMessage";
import PropTypes from "prop-types";

const ChatMessageList = ({ messages, onThreadClick, hasThreads, showThreadIcon, variant = "main" }) => {
  return (
    <div className="space-y-4">
      {messages.map((msg, index) => (
        <ChatMessage
          key={msg._id || msg.id || index}
          message={msg}
          onThreadClick={onThreadClick}
          hasThreads={hasThreads ? hasThreads(msg._id || msg.id) : false}
          showThreadIcon={showThreadIcon}
          variant={variant}
        />
      ))}
    </div>
  );
};

ChatMessageList.propTypes = {
  messages: PropTypes.array.isRequired,
  onThreadClick: PropTypes.func,
  hasThreads: PropTypes.func,
  showThreadIcon: PropTypes.bool,
  variant: PropTypes.oneOf(["main", "panel"]),
};

export default ChatMessageList;
