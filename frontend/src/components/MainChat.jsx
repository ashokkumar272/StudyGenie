import React, { useState, useRef, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { ChatContext } from "../context/chatContext";
import { FiTrash2, FiFileText } from "react-icons/fi";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";

const MainChat = React.forwardRef(
  ({ 
    onThreadClick, 
    hasThreads, 
    onClearChat, 
    onSummaryOpen,
    isPanelOpen = false 
  }, ref) => {
    const {
      messages,
      loading,
      sendMessage,
      currentSessionId,
    } = useContext(ChatContext);

    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    // Scroll to bottom when messages change
    useEffect(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages]);

    // Handle message submission
    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!newMessage.trim()) return;

      await sendMessage(newMessage);
      setNewMessage("");
    };

    // Handle clear chat
    const handleClearChat = async () => {
      if (
        window.confirm("Are you sure you want to clear the conversation history?")
      ) {
        await onClearChat();
      }
    };

    // Handle summary open
    const handleSummaryOpen = () => {
      if (onSummaryOpen) {
        onSummaryOpen();
      }
    };

    // Expose methods to parent component
    React.useImperativeHandle(ref, () => ({
      clearInput: () => setNewMessage(""),
      focusInput: () => {
        // Focus logic can be implemented if needed
      },
    }));    return (
      <div
        className={`flex flex-col relative min-w-0 overflow-hidden ${
          isPanelOpen 
            ? "w-full sm:w-1/2 md:w-1/2 lg:w-1/2 max-w-full sm:max-w-1/2 md:max-w-1/2 lg:max-w-1/2 flex-none sm:flex-none md:flex-none lg:flex-none" 
            : "flex-1 items-center w-full max-w-full lg:w-full lg:max-w-full lg:flex-1"
        }`}
      >
        {/* Chat container - scrollable */}
        <div
          className={`flex-1 overflow-auto chat-content-area bg-white rounded-lg shadow-sm transition-all duration-200 hover:shadow-md w-full max-w-full ${
            isPanelOpen 
              ? "sm:mx-1 lg:mx-1" 
              : "sm:mx-2 lg:mx-2 lg:w-[70%] lg:max-w-[70%]"
          }`}
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <h2 className="text-2xl font-bold mb-2">
                Welcome to AI Chatbot
              </h2>
              <p className="mb-6">
                Ask me anything and I'll do my best to help!
              </p>
            </div>
          ) : (
            <ChatMessageList
              messages={messages}
              onThreadClick={onThreadClick}
              hasThreads={hasThreads}
              showThreadIcon={true}
              variant="main"
            />
          )}
          <div ref={messagesEndRef} />
        </div>        {/* Input area - fixed at bottom */}
        <div className={`p-3 lg:p-4 sticky bottom-0 z-10 mt-auto w-full max-w-full ${
          isPanelOpen 
            ? "" 
            : "lg:w-[70%] lg:max-w-[70%]"
        }`}>
          <div className="flex items-center gap-1 w-full max-w-full">
            <button
              onClick={handleClearChat}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-105 flex-shrink-0"
              title="Clear conversation"
            >
              <FiTrash2 size={20} />
            </button>

            <button
              onClick={handleSummaryOpen}
              className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-transparent flex-shrink-0"
              title="Chat summary"
              disabled={!currentSessionId || messages.length === 0}
            >
              <FiFileText size={20} />
            </button>

            <ChatInput
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onSubmit={handleSubmit}
              loading={loading}
              disabled={false}
              placeholder="Type your message..."
              className="flex-1 min-w-0"
            />
          </div>
        </div>
      </div>
    );
  }
);

MainChat.propTypes = {
  onThreadClick: PropTypes.func,
  hasThreads: PropTypes.func,
  onClearChat: PropTypes.func.isRequired,
  onSummaryOpen: PropTypes.func,
  isPanelOpen: PropTypes.bool,
};

MainChat.displayName = "MainChat";

export default MainChat;
