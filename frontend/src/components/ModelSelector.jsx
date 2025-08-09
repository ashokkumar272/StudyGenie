import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";

const ModelSelector = ({ selectedModel, onModelChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");
  const containerRef = useRef(null);

  const models = [
    {
      id: 'gemini',
      name: 'Gemini 2.5 Flash',
      description: 'Google\'s Gemini AI model',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
        </svg>
      )
    },
    {
      id: 'azure-openai',
      name: 'GPT-4.1',
      description: 'Azure OpenAI\'s GPT-4.1 model',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
        </svg>
      )
    }
  ];

  const selectedModelData = models.find(model => model.id === selectedModel);

  const handleModelSelect = (modelId) => {
    onModelChange(modelId);
    setIsOpen(false);
  };

  const calculateDropdownPosition = () => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const dropdownHeight = 200; // Approximate height of dropdown
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // If there's not enough space below but enough space above, position upward
    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      setDropdownPosition("top");
    } else {
      setDropdownPosition("bottom");
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      calculateDropdownPosition();
    }
    setIsOpen(!isOpen);
  };

  // Recalculate position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        calculateDropdownPosition();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 px-3 py-2 bg-white/95 hover:bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm min-w-[140px]"
      >
        <div className="text-indigo-600">
          {selectedModelData?.icon}
        </div>
        <span className="text-gray-700 font-medium truncate flex-1 text-left">
          {selectedModelData?.name}
        </span>
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className={`absolute ${
            dropdownPosition === "top" 
              ? "bottom-full mb-1" 
              : "top-full mt-1"
          } left-0 w-full min-w-[280px] bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden max-h-64 overflow-y-auto`}>
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => handleModelSelect(model.id)}
                className={`w-full px-3 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-start gap-3 ${
                  selectedModel === model.id ? 'bg-indigo-50 border-r-2 border-indigo-500' : ''
                }`}
              >
                <div className={`mt-0.5 ${selectedModel === model.id ? 'text-indigo-600' : 'text-gray-400'}`}>
                  {model.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-medium text-sm ${selectedModel === model.id ? 'text-indigo-900' : 'text-gray-900'}`}>
                    {model.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {model.description}
                  </div>
                </div>
                {selectedModel === model.id && (
                  <svg className="w-4 h-4 text-indigo-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

ModelSelector.propTypes = {
  selectedModel: PropTypes.string.isRequired,
  onModelChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default ModelSelector;
