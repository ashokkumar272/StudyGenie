import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import '../assets/askAboutThis.css';

const AskAboutThis = ({ onSubmit, isPanel = false }) => {
  const [selection, setSelection] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showButton, setShowButton] = useState(false);
  const [showModal, setShowModal] = useState(false);  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [followupQuestion, setFollowupQuestion] = useState('');
  const [panelMessages, setPanelMessages] = useState([]);
  const modalRef = useRef(null);
  const buttonRef = useRef(null);
  const savedSelection = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

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
    // Handle new AI response coming from parent
  useEffect(() => {
    // Listen for new chat messages from parent
    const handleNewMessage = (event) => {
      if (event.detail && event.detail.type === 'new-followup-response' && isPanelOpen) {
        // Remove loading placeholder
        setPanelMessages(prev => 
          prev.filter(msg => !msg.isLoading)
        );
        
        // Add the new assistant message
        const newMessage = {
          id: event.detail.messageId || Date.now().toString(),
          role: 'assistant',
          content: event.detail.message,
          timestamp: new Date(),
          isError: event.detail.isError || false
        };
        
        setPanelMessages(prev => [...prev, newMessage]);
      }
    };
    
    // Add event listener
    window.addEventListener('new-followup-response', handleNewMessage);
    
    // Cleanup
    return () => {
      window.removeEventListener('new-followup-response', handleNewMessage);
    };
  }, [isPanelOpen]);
  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Scroll to bottom when panel messages change
  useEffect(() => {
    if (messagesEndRef.current && isPanelOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [panelMessages, isPanelOpen]);
  
  // Handle submitting the form
  const handleModalSubmit = (event) => {
    event.preventDefault();
    if (!selection || !followupQuestion.trim()) return;
    
    // Create a user message for the panel
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: followupQuestion,
      timestamp: new Date()
    };
    
    // Add it to panel messages
    setPanelMessages(prev => [...prev, userMessage]);
    
    // Send to parent component for processing
    const followupData = {
      selectedText: selection.text,
      originalMessage: selection.assistantMessage,
      messageId: selection.messageId,
      followupQuestion
    };
    
    onSubmit(followupData);
    
    // Create an assistant message placeholder to show loading state
    const assistantMessagePlaceholder = {
      id: Date.now().toString() + '-loading',
      role: 'assistant',
      content: 'Loading...',
      isLoading: true,
      timestamp: new Date()
    };
    
    // Add placeholder to panel messages
    setPanelMessages(prev => [...prev, assistantMessagePlaceholder]);
    
    if (isPanel) {
      // Just clear the input but keep the panel open
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
    // Don't clear panel messages so the conversation is preserved if reopened
  };
  
  // Start a new conversation in the panel
  const startNewConversation = () => {
    setPanelMessages([]);
    setFollowupQuestion('');
    // Keep the panel open
  };

  // Handle textarea auto-resize
  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };
  
  // Handle textarea key events (Ctrl+Enter or Command+Enter to submit)
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (followupQuestion.trim() && selection) {
        handleModalSubmit(e);
      }
    }
  };
  
  // Reset textarea height on new message
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [followupQuestion]);
  
  // Adjust textarea height when input changes
  const handleTextareaChange = (e) => {
    setFollowupQuestion(e.target.value);
    autoResizeTextarea();
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
        <div className="ask-about-this-panel">          <div className="ask-about-this-header flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-4 w-4 bg-indigo-600 rounded-full mr-2"></div>
              <span className="font-medium">Follow-up chat</span>
            </div>
            <div className="flex">
              <button 
                onClick={startNewConversation} 
                className="mr-3 text-indigo-500 hover:text-indigo-700"
                title="New conversation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </button>
              <button 
                onClick={closePanel} 
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className="ask-about-this-content">
            {/* Only show selection on first load */}
            {selection && panelMessages.length === 0 && (
              <div className="ask-about-this-selection">
                "{selection.text}"
              </div>
            )}
            
            {/* Messages container */}
            <div className="flex flex-col space-y-4 mb-4">
              {panelMessages.length > 0 ? (
                panelMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >                    <div 
                      className={`max-w-[85%] rounded-lg p-3 ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : msg.isError
                            ? 'bg-red-50 border border-red-200'
                            : 'bg-white shadow-sm border'
                      } ${msg.isLoading ? 'opacity-60' : ''}`}
                    >
                      {msg.isLoading ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-t-2 border-indigo-500 rounded-full animate-spin mr-2"></div>
                          <p>Thinking...</p>
                        </div>
                      ) : msg.role === 'assistant' ? (
                        <div className="prose prose-sm selectable-text">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p>{msg.content}</p>
                      )}
                      <div 
                        className={`text-xs mt-1 ${
                          msg.role === 'user' ? 'text-indigo-200' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                ))              ) : (
                <div className="text-center py-6 flex flex-col items-center">
                  <div className="bg-gray-100 rounded-full p-4 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="16"></line>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                  </div>
                  <p className="text-gray-700 font-medium mb-1">Start a conversation</p>
                  <p className="text-gray-500 text-sm text-center max-w-[200px]">
                    Ask a follow-up question about the selected text
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input form */}
            <form onSubmit={handleModalSubmit} className="mt-auto">
              <textarea
                ref={textareaRef}
                className="ask-about-this-input"
                value={followupQuestion}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask for clarification or follow-up questions..."
                required
              />
              
              <button 
                type="submit" 
                className="ask-about-this-button flex items-center justify-center gap-2"
                disabled={!selection || !followupQuestion.trim()}
              >
                <span>Send</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
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
                ref={textareaRef}
                className="w-full border border-gray-300 rounded-md p-2 mb-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={followupQuestion}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
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
