import PropTypes from "prop-types";

const TypingIndicator = ({ variant = "main" }) => {
  return (
    <div className="flex justify-start mb-4 last:mb-0">
      <div className="rounded-xl py-2 px-3 relative min-w-0 break-words transition-all duration-300 ease-out border rounded-bl-[2px] bg-white">        <div className="flex items-center gap-2">
          <div className="flex gap-1 items-center">
            <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

TypingIndicator.propTypes = {
  variant: PropTypes.oneOf(["main", "panel"]),
};

export default TypingIndicator;
