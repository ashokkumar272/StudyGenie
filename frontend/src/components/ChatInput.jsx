import PropTypes from "prop-types";
import { useRef, useEffect } from "react";

const ChatInput = ({ value, onChange, onSubmit, placeholder = "Type your message...", disabled, className = "" }) => {
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  return (
    <form 
      onSubmit={onSubmit} 
      className={`relative flex min-w-0 shadow-lg rounded-xl overflow-hidden ${className}`}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-1 w-full bg-white/95 text-gray-800 px-5 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 placeholder:text-gray-400 transition-all duration-200
        sm:px-6 sm:py-4 sm:text-base text-sm"
        disabled={disabled}
      />
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
        <button
          type="submit"
          disabled={!value.trim() || disabled}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-full flex items-center justify-center 
          disabled:opacity-40 transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:hover:scale-100 disabled:hover:shadow-none
          focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:outline-none
          w-10 h-10 sm:w-11 sm:h-11"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-5 h-5 sm:w-6 sm:h-6 transform rotate-45" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </form>
  );
};

ChatInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default ChatInput;