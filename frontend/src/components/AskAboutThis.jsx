import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../assets/askAboutThis.css';

const AskAboutThis = ({ onSubmit, isPanel = false }) => {
  const [selection, setSelection] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showButton, setShowButton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [followupQuestion, setFollowupQuestion] = useState('');
  const modalRef = useRef(null);
  const buttonRef = useRef(null);
  const savedSelection = useRef(null);

  // Helper to save the current selection
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      savedSelection.current = selection.getRangeAt(0).cloneRange();
    }
  };

  // Helper to restore the saved selection
  const restoreSelection = () => {
    if (savedSelection.current) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedSelection.current);
    }
  };

  // Handle text selection in assistant messages
  const handleTextSelection = (event) => {
    const selection = window.getSelection();
    
    // If no selection or empty selection, hide button
    if (!selection || selection.toString().trim().length === 0) {
      setShowButton(false);
      return;
    }
    
    // Find containing assistant message by walking up the DOM tree
    let node = selection.anchorNode;
    let assistantMessage = null;
    
    while (node && node !== document.body) {
      if (node.nodeType === 1 && node.hasAttribute && node.hasAttribute('data-role') && 
          node.getAttribute('data-role') === 'assistant') {
        assistantMessage = node;
        break;
      }
      node = node.parentNode;
    }
    
    // If not within assistant message, cancel
    if (!assistantMessage) {
      setShowButton(false);
      return;
    }
    
    // Save the selection for later use
    saveSelection();
    
    // Get selection bounds
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Position the button near the selection, ensuring it stays within viewport
    let xPos = rect.right + 10;
    let yPos = rect.top + window.scrollY; // Account for scrolling
    
    // If button would go off screen horizontally, position it to the left
    if (xPos + 120 > viewportWidth) {
      xPos = Math.max(10, rect.left - 120);
    }
    
    // If button would go off screen vertically, position it below selection
    if (yPos - 40 < 0) {
      yPos = rect.bottom + window.scrollY + 10;
    }
    
    // Set position and selection data
    setPosition({
      x: xPos,
      y: yPos
    });
    
    setSelection({
      text: selection.toString(),
      assistantMessage: assistantMessage.getAttribute('data-content'),
      messageId: assistantMessage.getAttribute('data-message-id')
    });
    
    // Always show the button first, regardless of mode
    setShowButton(true);
  };

  // Handle clicking the "Ask about this" button
  const handleAskClick = () => {
    setShowButton(false);
    
    if (isPanel) {
      // Open the side panel
      setIsPanelOpen(true);
    } else {
      // Open the modal dialog
      setShowModal(true);
    }
  };

  // Handle click outside of modal
  const handleClickOutside = (event) => {
    if (
      modalRef.current && 
      !modalRef.current.contains(event.target) && 
      buttonRef.current && 
      !buttonRef.current.contains(event.target)
    ) {
      setShowModal(false);
    }
  };

  // Handle submitting the form
  const handleModalSubmit = (event) => {
    event.preventDefault();
    if (!selection || !followupQuestion.trim()) return;
    
    onSubmit({
      selectedText: selection.text,
      originalMessage: selection.assistantMessage,
      messageId: selection.messageId,
      followupQuestion
    });
    
    if (isPanel) {
      // Just clear the form but keep the panel open
      setFollowupQuestion('');
    } else {
      // Close the modal for the traditional flow
      setShowModal(false);
      setFollowupQuestion('');
    }
  };

  // Close the panel
  const closePanel = () => {
    setIsPanelOpen(false);
    setSelection(null);
    setFollowupQuestion('');
  };

  // Add event listeners
  useEffect(() => {
    document.addEventListener('selectionchange', handleTextSelection);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('selectionchange', handleTextSelection);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Floating "Ask about this" button - always show when text is selected */}
      {showButton && (
        <div 
          ref={buttonRef}
          className="ask-button"
          style={{ 
            top: `${position.y}px`, 
            left: `${position.x}px`,
            transform: 'translate(0, -50%)' 
          }}
          onClick={handleAskClick}
        >
          Ask about this
        </div>
      )}
      
      {/* Side panel - only show when button is clicked in panel mode */}
      {isPanel && isPanelOpen && (
        <div className="ask-about-this-panel">
          <div className="ask-about-this-header flex justify-between items-center">
            <span>Ask About This</span>
            <button onClick={closePanel} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          
          <div className="ask-about-this-content">
            {selection && (
              <div className="ask-about-this-selection">
                "{selection.text}"
              </div>
            )}
            
            <form onSubmit={handleModalSubmit}>
              <textarea
                className="ask-about-this-input"
                value={followupQuestion}
                onChange={(e) => setFollowupQuestion(e.target.value)}
                placeholder="Ask for clarification or follow-up questions about the selected text..."
                required
              />
              
              <button 
                type="submit" 
                className="ask-about-this-button"
                disabled={!selection || !followupQuestion.trim()}
              >
                Submit Question
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal dialog - only show when button is clicked in modal mode */}
      {!isPanel && showModal && (
        <div className="ask-modal">
          <div 
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl w-full max-w-md mx-2 p-4"
          >
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Ask about this selection
            </h3>
            
            <div className="mb-4 bg-indigo-50 p-3 rounded-md text-gray-700">
              "{selection && selection.text}"
            </div>
            
            <form onSubmit={handleModalSubmit}>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 mb-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={followupQuestion}
                onChange={(e) => setFollowupQuestion(e.target.value)}
                placeholder="Ask for clarification or follow-up questions about the selected text..."
                required
              />
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

AskAboutThis.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isPanel: PropTypes.bool
};

export default AskAboutThis;
