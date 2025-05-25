import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { ChatContext } from '../context/chatContext';
import ReactMarkdown from 'react-markdown';
import { FiSend, FiTrash2, FiPlusCircle, FiFileText } from 'react-icons/fi';
import ChatSidebar from '../components/ChatSidebar';
import AskAboutThis from '../components/AskAboutThis';
import ChatSummary from '../components/ChatSummary';
import ChatMessage from '../components/ChatMessage';

const Chat = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);  const { 
    messages, 
    loading, 
    sendMessage, 
    sendFollowupQuestion,
    clearChatHistory,
    startNewSession,
    currentSessionId,
    sideThreads,
    fetchSideThreadMessages,
    fetchSideThreadSelections,
    fetchSessionMessages
  } = useContext(ChatContext);  const [newMessage, setNewMessage] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const askAboutThisRef = useRef(null);
  const navigate = useNavigate();
  const { sessionId } = useParams();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Handle URL-based session management
  useEffect(() => {
    if (isAuthenticated && sessionId && sessionId !== currentSessionId) {
      // Load the session from URL parameter
      fetchSessionMessages(sessionId);
    } else if (isAuthenticated && !sessionId && currentSessionId) {
      // Redirect to current session URL if we have a session but no URL param
      navigate(`/chat/${currentSessionId}`, { replace: true });
    }
  }, [isAuthenticated, sessionId, currentSessionId, fetchSessionMessages, navigate]);
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle panel state changes
  const handlePanelStateChange = (isOpen) => {
    setIsPanelOpen(isOpen);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    await sendMessage(newMessage);
    setNewMessage('');
  };
  
  const handleClearChat = async () => {
    if (window.confirm('Are you sure you want to clear the conversation history?')) {
      await clearChatHistory();
    }
  };    const handleNewChat = () => {
    const newSessionId = startNewSession();
    if (newSessionId) {
      navigate(`/chat/${newSessionId}`);
    }
    setNewMessage('');
  };

  // Check if a message has side threads
  const hasThreads = (messageId) => {
    return sideThreads.includes(messageId);
  };  // Handle thread icon click
  const handleThreadClick = async (message) => {
    if (!askAboutThisRef.current || !currentSessionId) return;
    
    try {
      // Fetch all existing selections for this parent message
      const allSelections = await fetchSideThreadSelections(currentSessionId, message._id);
      
      if (allSelections.length === 0) {
        console.log('No side threads found for this message');
        return;
      }
      
      // If only one selection, load it directly
      // If multiple selections, load the most recent one and show the selection list
      const latestSelection = allSelections.sort((a, b) => new Date(b.firstMessageTime) - new Date(a.firstMessageTime))[0];
      const existingMessages = await fetchSideThreadMessages(currentSessionId, message._id, latestSelection.selectedText);
      
      // Open the side panel with existing messages
      askAboutThisRef.current.openWithExistingThread({
        messageId: message._id,
        content: message.content,
        selectedText: latestSelection.selectedText,
        existingMessages: existingMessages.map(msg => ({
          id: msg._id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          isError: false
        })),
        sideThreadId: latestSelection.sideThreadId
      });
    } catch (error) {
      console.error('Error loading side thread:', error);
    }
  };
  // Handle follow-up question submission
  const handleFollowupSubmit = async (followupData) => {
    console.log("Follow-up data:", followupData);
    // Create payload for the context
    const payloadForContext = {
      selectedText: followupData.selectedText,
      originalAssistantMessage: followupData.originalMessage,
      userFollowupQuestion: followupData.followupQuestion,
      messageId: followupData.messageId
    };
    
    try {
      // Call the API via context
      const response = await sendFollowupQuestion(payloadForContext);
      
      // Check if response contains error information
      const isError = response?.isError || false;
      
      // Dispatch a custom event to notify the AskAboutThis component
      const event = new CustomEvent('new-followup-response', {
        detail: {
          type: 'new-followup-response',
          messageId: response?.messageId || Date.now().toString(),
          message: response?.message || 'Response received',
          isError: isError
        }
      });
      
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Error handling followup:", error);
      // Dispatch error event
      const errorEvent = new CustomEvent('new-followup-response', {
        detail: {
          type: 'new-followup-response',
          messageId: Date.now().toString() + '-error',
          message: 'Sorry, there was an error processing your question. Please try again.',
          isError: true
        }
      });
      
      window.dispatchEvent(errorEvent);
    }
  };

  return (
    <div className="h-full"> {/* Fill available space without forcing scroll */}
      {/* Main container with fixed height and three sections */}
      <div className="mx-auto h-full flex bg-white shadow-lg">
        {/* Chat history sidebar */}
        <ChatSidebar />
          {/* Chat area with right panel layout */}
        <div className="flex flex-1">
          {/* Main chat area */}
          <div className={`flex flex-col relative main-chat-area ${isPanelOpen ? 'panel-open' : ''}`}>
            {/* Chat container - scrollable */}
            <div className="flex-1 overflow-auto p-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <h2 className="text-2xl font-bold mb-2">Welcome to AI Chatbot</h2>
                  <p className="mb-6">Ask me anything and I'll do my best to help!</p>
                </div>
              ) : (                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <ChatMessage
                      key={msg._id || index}
                      message={msg}
                      onThreadClick={handleThreadClick}
                      hasThreads={hasThreads(msg._id)}
                      showThreadIcon={true}
                      variant="main"
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            {/* Input area - fixed at bottom */}            <div className="border-t p-4">
              <div className="flex">
                <button
                  onClick={handleNewChat}
                  className="mr-2 p-2 text-gray-500 hover:text-indigo-500 rounded-full"
                  title="New chat"
                >
                  <FiPlusCircle size={20} />
                </button>
                
                <button
                  onClick={handleClearChat}
                  className="mr-2 p-2 text-gray-500 hover:text-red-500 rounded-full"
                  title="Clear conversation"
                >
                  <FiTrash2 size={20} />
                </button>

                <button
                  onClick={() => setSummaryOpen(true)}
                  className="mr-2 p-2 text-gray-500 hover:text-blue-500 rounded-full"
                  title="Chat summary"
                  disabled={!currentSessionId || messages.length === 0}
                >
                  <FiFileText size={20} />
                </button>
                
                <form onSubmit={handleSubmit} className="flex-1 flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !newMessage.trim()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg flex items-center justify-center disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                    ) : (
                      <FiSend size={20} />
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>          {/* Empty container for the right panel that becomes visible when needed */}
          <div className={`ask-panel-container ${isPanelOpen ? 'panel-open' : ''}`}>            <AskAboutThis 
              ref={askAboutThisRef}
              onSubmit={handleFollowupSubmit} 
              isPanel={true} 
              onPanelStateChange={handlePanelStateChange}
            />
          </div>        </div>
      </div>

      {/* Chat Summary Modal */}
      <ChatSummary 
        sessionId={currentSessionId}
        isOpen={summaryOpen}
        onClose={() => setSummaryOpen(false)}
      />
    </div>
  );
};

export default Chat;
