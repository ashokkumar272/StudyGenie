import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { ChatContext } from '../context/chatContext';
import ReactMarkdown from 'react-markdown';
import { FiSend, FiTrash2, FiPlusCircle } from 'react-icons/fi';
import ChatSidebar from '../components/ChatSidebar';
import AskAboutThis from '../components/AskAboutThis';

const Chat = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { 
    messages, 
    loading, 
    sendMessage, 
    sendFollowupQuestion,
    clearChatHistory,
    startNewSession,
    currentSessionId
  } = useContext(ChatContext);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
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
  };
  
  const handleNewChat = () => {
    startNewSession();
    setNewMessage('');
  };
  
  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Handle follow-up question submission
  const handleFollowupSubmit = (followupData) => {
    console.log("Follow-up data:", followupData);
    sendFollowupQuestion(followupData);
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
          <div className="flex-1 flex flex-col relative">
            {/* Chat container - scrollable */}
            <div className="flex-1 overflow-auto p-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <h2 className="text-2xl font-bold mb-2">Welcome to AI Chatbot</h2>
                  <p className="mb-6">Ask me anything and I'll do my best to help!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={msg._id || index}
                      className={`flex ${
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          msg.role === 'user'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white shadow-sm border'
                        }`}
                        data-role={msg.role}
                        data-message-id={msg._id || index}
                        data-content={msg.content}
                      >
                        {msg.role === 'assistant' ? (
                          <div className="prose selectable-text">
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
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            {/* Input area - fixed at bottom */}
            <div className="border-t p-4">
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
          <div className="ask-panel-container">
            <AskAboutThis onSubmit={handleFollowupSubmit} isPanel={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
