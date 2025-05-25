import React, { useState, useRef, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import { ChatContext } from "../context/chatContext";
import "../assets/askAboutThis.css";

const AskAboutThis = React.forwardRef(
  ({ onSubmit, isPanel = false, onPanelStateChange }, ref) => {
    const {
      currentSessionId,
      sendSideThreadMessage,
      fetchSideThreadMessages,
      fetchSideThreadSelections,
    } = useContext(ChatContext);    const [selection, setSelection] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [showButton, setShowButton] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [followupQuestion, setFollowupQuestion] = useState("");
    const [panelMessages, setPanelMessages] = useState([]);
    const [sideThreadId, setSideThreadId] = useState(null);
    const [sideThreadSelections, setSideThreadSelections] = useState([]); // All selections for current parent
    const [currentSelectionHash, setCurrentSelectionHash] = useState(null);
    const modalRef = useRef(null);
    const buttonRef = useRef(null);
    const savedSelection = useRef(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Simple hash function to match backend
    const simpleHash = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash).toString(16).substring(0, 8);
    };

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
        if (
          node.nodeType === 1 &&
          node.hasAttribute &&
          node.hasAttribute("data-role") &&
          node.getAttribute("data-role") === "assistant"
        ) {
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
        y: yPos,
      });

      setSelection({
        text: selection.toString(),
        assistantMessage: assistantMessage.getAttribute("data-content"),
        messageId: assistantMessage.getAttribute("data-message-id"),
      });

      // Always show the button first, regardless of mode
      setShowButton(true);
    }; // Handle clicking the "Ask about this" button
    const handleAskClick = async () => {
      setShowButton(false);

      if (isPanel) {
        // Open the side panel and load existing selections/messages
        setIsPanelOpen(true);

        if (selection && currentSessionId) {
          try {
            // Fetch all existing selections for this parent message
            const allSelections = await fetchSideThreadSelections(
              currentSessionId,
              selection.messageId
            );
            setSideThreadSelections(allSelections);

            // Check if current selection already has a thread
            const currentHash = simpleHash(selection.text);
            const existingSelection = allSelections.find(
              (s) => s.selectedTextHash === currentHash
            );            if (existingSelection) {
              // Load existing thread for this specific selection
              const existingMessages = await fetchSideThreadMessages(
                currentSessionId,
                selection.messageId,
                selection.text
              );
              const formattedMessages = existingMessages.map((msg) => ({
                id: msg._id,
                role: msg.role,
                content: msg.content,
                timestamp: new Date(msg.timestamp),
                isError: false,
              }));
              setPanelMessages(formattedMessages);
              setSideThreadId(existingSelection.sideThreadId);
              setCurrentSelectionHash(currentHash);
            } else {
              // New selection
              setPanelMessages([]);
              setSideThreadId(null);
              setCurrentSelectionHash(currentHash);
            }          } catch (error) {
            console.error("Error loading side thread data:", error);
            setPanelMessages([]);
            setSideThreadId(null);
            setSideThreadSelections([]);
          }
        }
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
    }; // Format timestamp
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    };
    // Scroll to bottom when panel messages change
    useEffect(() => {
      if (messagesEndRef.current && isPanelOpen) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [panelMessages, isPanelOpen]);

    // Notify parent of panel state changes
    useEffect(() => {
      if (onPanelStateChange) {
        onPanelStateChange(isPanelOpen);
      }
    }, [isPanelOpen, onPanelStateChange]);
    // Handle submitting the form
    const handleModalSubmit = async (event) => {
      event.preventDefault();
      if (!selection || !followupQuestion.trim()) return;

      if (isPanel && currentSessionId) {
        // Create a user message for the panel
        const userMessage = {
          id: Date.now().toString(),
          role: "user",
          content: followupQuestion,
          timestamp: new Date(),
        };

        // Add it to panel messages
        setPanelMessages((prev) => [...prev, userMessage]);

        // Create a loading placeholder
        const loadingMessage = {
          id: Date.now().toString() + "-loading",
          role: "assistant",
          content: "Thinking...",
          isLoading: true,
          timestamp: new Date(),
        };

        setPanelMessages((prev) => [...prev, loadingMessage]);

        try {
          // Send to side thread API
          const response = await sendSideThreadMessage({
            mainThreadId: currentSessionId,
            linkedToMessageId: selection.messageId,
            selectedText: selection.text,
            userQuery: followupQuestion,
          });

          // Remove loading message and add real response
          setPanelMessages((prev) => prev.filter((msg) => !msg.isLoading));

          const assistantMessage = {
            id: response.messageId,
            role: "assistant",
            content: response.message,
            timestamp: new Date(),
            isError: false,
          };

          setPanelMessages((prev) => [...prev, assistantMessage]);
          setSideThreadId(response.sideThreadId);
        } catch (error) {
          console.error("Error sending side thread message:", error);

          // Remove loading message and add error
          setPanelMessages((prev) => prev.filter((msg) => !msg.isLoading));

          const errorMessage = {
            id: Date.now().toString() + "-error",
            role: "assistant",
            content:
              "Sorry, there was an error processing your question. Please try again.",
            timestamp: new Date(),
            isError: true,
          };

          setPanelMessages((prev) => [...prev, errorMessage]);
        }

        // Clear the input
        setFollowupQuestion("");
      } else {
        // Legacy modal mode - use old API
        const followupData = {
          selectedText: selection.text,
          originalMessage: selection.assistantMessage,
          messageId: selection.messageId,
          followupQuestion,
        };

        onSubmit(followupData);
        setShowModal(false);
        setFollowupQuestion("");
      }
    }; // Switch to a different text selection thread
    const switchToSelection = async (selectionData) => {
      try {
        // Update current selection
        setSelection({
          text: selectionData.selectedText,
          assistantMessage: selection.assistantMessage,
          messageId: selection.messageId,
        });
        setCurrentSelectionHash(selectionData.selectedTextHash);

        // Load messages for this specific selection
        const existingMessages = await fetchSideThreadMessages(
          currentSessionId,
          selection.messageId,
          selectionData.selectedText
        );
        const formattedMessages = existingMessages.map((msg) => ({
          id: msg._id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          isError: false,
        }));

        setPanelMessages(formattedMessages);
        setSideThreadId(selectionData.sideThreadId);
      } catch (error) {
        console.error("Error switching to selection:", error);
      }
    };    // Close the panel
    const closePanel = () => {
      setIsPanelOpen(false);
      setSelection(null);
      setFollowupQuestion("");
      setSideThreadId(null);
      setSideThreadSelections([]);
      setCurrentSelectionHash(null);
      // Keep panel messages so conversation is preserved if reopened
    };

    // Start a new conversation in the panel
    const startNewConversation = () => {
      setPanelMessages([]);
      setFollowupQuestion("");
      setSideThreadId(null);
      setCurrentSelectionHash(null);
      // Keep the panel open and preserve selections list
    };
    // Handle input key events (Enter to submit)
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (followupQuestion.trim() && selection) {
          handleModalSubmit(e);
        }
      }
    };

    // Handle input change
    const handleInputChange = (e) => {
      setFollowupQuestion(e.target.value);
    };
    // Method to open panel with existing thread (called from parent)
    const openWithExistingThread = async ({
      messageId,
      content,
      selectedText,
      existingMessages,
      sideThreadId,
    }) => {
      setSelection({
        text: selectedText || "View conversation thread",
        assistantMessage: content,
        messageId: messageId,
      });      // Load all selections for this parent message
      try {
        const allSelections = await fetchSideThreadSelections(
          currentSessionId,
          messageId
        );
        setSideThreadSelections(allSelections);

        if (selectedText) {
          setCurrentSelectionHash(simpleHash(selectedText));
        }
      } catch (error) {
        console.error("Error loading selections:", error);
        setSideThreadSelections([]);
      }

      setPanelMessages(existingMessages || []);
      setSideThreadId(sideThreadId);
      setIsPanelOpen(true);
    };
    // Expose the method to parent component
    React.useImperativeHandle(ref, () => ({
      openWithExistingThread,
      isPanelOpen,
    }));

    // Add event listeners
    useEffect(() => {
      document.addEventListener("selectionchange", handleTextSelection);
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("selectionchange", handleTextSelection);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    // Close a specific text selection tab
    const closeSelectionTab = async (selectionHash, event) => {
      event.stopPropagation();
      
      // Remove from local state
      const updatedSelections = sideThreadSelections.filter(
        sel => sel.selectedTextHash !== selectionHash
      );
      setSideThreadSelections(updatedSelections);
      
      // If we're closing the current active tab, switch to another tab or clear
      if (currentSelectionHash === selectionHash) {
        if (updatedSelections.length > 0) {
          // Switch to the first remaining tab
          await switchToSelection(updatedSelections[0]);
        } else {
          // No tabs left, clear everything
          setPanelMessages([]);
          setSideThreadId(null);
          setCurrentSelectionHash(null);
          setSelection(null);
        }
      }
    };

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
              transform: "translate(0, -50%)",
            }}
            onClick={handleAskClick}
          >
            Ask about this
          </div>
        )}        {/* Side panel - only show when button is clicked in panel mode */}
        {isPanel && isPanelOpen && (
          <div className="ask-about-this-panel">            {/* Header with Chrome-like tabs */}
            <div className="ask-about-this-header p-0">
              {/* Tab bar - show all text selections as tabs */}
              <div className="selection-tabs">
                {/* Tabs container */}
                <div className="flex flex-1 min-w-0">
                  {sideThreadSelections.length > 0 ? (
                    sideThreadSelections.map((selectionData, index) => (
                      <div
                        key={selectionData.selectedTextHash}
                        className={`selection-tab ${
                          currentSelectionHash === selectionData.selectedTextHash ? "active" : ""
                        }`}
                      >                        <button
                          onClick={() => switchToSelection(selectionData)}
                          className="selection-tab-content"
                          data-tooltip={selectionData.selectedText.length > 30 ? `"${selectionData.selectedText}"` : undefined}
                          title={selectionData.selectedText.length > 30 ? selectionData.selectedText : undefined}
                        >
                          <div className="selection-tab-text">
                            "{selectionData.selectedText.substring(0, 30)}
                            {selectionData.selectedText.length > 30 ? "..." : ""}"
                          </div>
                          <div className="selection-tab-time">
                            {new Date(
                              selectionData.firstMessageTime
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </button>                        {/* Tab close button */}
                        {sideThreadSelections.length > 1 && (
                          <button
                            onClick={(e) => closeSelectionTab(selectionData.selectedTextHash, e)}
                            className="selection-tab-close"
                          >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                              <path d="M6 4.586L9.293 1.293a1 1 0 111.414 1.414L7.414 6l3.293 3.293a1 1 0 01-1.414 1.414L6 7.414l-3.293 3.293a1 1 0 01-1.414-1.414L4.586 6 1.293 2.707a1 1 0 011.414-1.414L6 4.586z"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="new-selection-tab">
                      New Selection
                    </div>
                  )}
                </div>
                
                {/* Close panel button */}
                <button
                  onClick={closePanel}
                  className="panel-close-button"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 6.586L12.293 2.293a1 1 0 111.414 1.414L9.414 8l3.293 3.293a1 1 0 01-1.414 1.414L8 9.414l-3.293 3.293a1 1 0 01-1.414-1.414L6.586 8 2.293 3.707a1 1 0 011.414-1.414L8 6.586z"/>
                  </svg>
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
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {" "}
                      <div
                        className={`max-w-[85%] rounded-lg p-3 ${
                          msg.role === "user"
                            ? "bg-indigo-600 text-white"
                            : msg.isError
                            ? "bg-red-50 border border-red-200"
                            : "bg-white shadow-sm border"
                        } ${msg.isLoading ? "opacity-60" : ""}`}
                      >
                        {msg.isLoading ? (
                          <div className="flex items-center">
                            <div className="w-5 h-5 border-t-2 border-indigo-500 rounded-full animate-spin mr-2"></div>
                            <p>Thinking...</p>
                          </div>
                        ) : msg.role === "assistant" ? (
                          <div className="prose prose-sm selectable-text">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p>{msg.content}</p>
                        )}
                        <div
                          className={`text-xs mt-1 ${
                            msg.role === "user"
                              ? "text-indigo-200"
                              : "text-gray-500"
                          }`}
                        >
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 flex flex-col items-center">
                    <div className="bg-gray-100 rounded-full p-4 mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-indigo-500"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                      </svg>
                    </div>
                    <p className="text-gray-700 font-medium mb-1">
                      Start a conversation
                    </p>
                    <p className="text-gray-500 text-sm text-center max-w-[200px]">
                      Ask a follow-up question about the selected text
                    </p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              {/* Input form */}
              <form onSubmit={handleModalSubmit} className="mt-auto flex">
                {" "}
                <input
                  ref={inputRef}
                  type="text"
                  value={followupQuestion}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask for clarification or follow-up questions..."
                  className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg flex items-center justify-center disabled:opacity-50"
                  disabled={!selection || !followupQuestion.trim()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
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
                {" "}
                <textarea
                  ref={inputRef}
                  className="w-full border border-gray-300 rounded-md p-2 mb-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={followupQuestion}
                  onChange={handleInputChange}
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
  }
);

AskAboutThis.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isPanel: PropTypes.bool,
  onPanelStateChange: PropTypes.func,
};

export default AskAboutThis;
