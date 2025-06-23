import PropTypes from "prop-types";

const ChatInput = ({ value, onChange, onSubmit, placeholder = "Type your message...", disabled, className = "" }) => {
  return (
    <form onSubmit={onSubmit} className={`flex-1 flex min-w-0 ${className}`}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-1 bg-white rounded-l-lg px-3 py-2 shadow-sm border border-gray-200 min-w-0 sm:px-4 sm:py-3 sm:text-base text-sm"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={!value.trim() || disabled}
        className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-3 py-2 rounded-r-lg flex items-center justify-center flex-shrink-0 border border-l-0 border-[#667eea] sm:px-4 sm:py-3"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
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
