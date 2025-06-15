import React from "react";
import PropTypes from "prop-types";

const ChatInput = ({ value, onChange, onSubmit, loading, placeholder = "Type your message...", disabled }) => {
  return (
    <form onSubmit={onSubmit} className="flex-1 flex min-w-0">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-1 bg-white rounded-l-lg px-3 py-2 shadow-sm transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent border border-gray-200 min-w-0
        sm:px-4 sm:py-3 sm:text-base text-sm"
        disabled={loading || disabled}
      />
      <button
        type="submit"
        disabled={loading || !value.trim() || disabled}
        className="bg-indigo-600 text-white px-3 py-2 rounded-r-lg flex items-center justify-center disabled:opacity-50 transition-all duration-200 hover:bg-indigo-700 hover:scale-105 disabled:hover:scale-100 flex-shrink-0 border border-l-0 border-indigo-600
        sm:px-4 sm:py-3"
      >
        {loading ? (
          <div className="w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-white rounded-full animate-spin" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        )}
      </button>
    </form>
  );
};

ChatInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

export default ChatInput;
