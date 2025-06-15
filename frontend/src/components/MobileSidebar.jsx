import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { ChatContext } from '../context/chatContext';
import { FiX, FiUser, FiMessageSquare, FiSettings, FiLogOut, FiPlusCircle, FiTrash2, FiFileText } from 'react-icons/fi';

const MobileSidebar = ({ isOpen, onClose }) => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { 
    currentSessionId, 
    startNewSession,
    chatSessions,
    deleteSession
  } = useContext(ChatContext);
  const navigate = useNavigate();

  const handleChatClick = (e) => {
    e.preventDefault();
    if (currentSessionId) {
      navigate(`/chat/${currentSessionId}`);
    } else {
      const newSessionId = startNewSession();
      if (newSessionId) {
        navigate(`/chat/${newSessionId}`);
      }
    }
    onClose();
  };

  const handleNewChat = () => {
    const newSessionId = startNewSession();
    if (newSessionId) {
      navigate(`/chat/${newSessionId}`);
    }
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleSessionClick = (sessionId) => {
    navigate(`/chat/${sessionId}`);
    onClose();
  };

  const handleSummaryClick = (sessionId, e) => {
    e.stopPropagation();
    navigate(`/summary/${sessionId}`);
    onClose();
  };

  const handleDeleteSession = (sessionId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      deleteSession(sessionId);
    }
  };

  // Format timestamp for display
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get preview of the first message (truncate if too long)
  const getMessagePreview = (content) => {
    if (!content) return 'New Conversation';
    return content.length > 30 ? content.substring(0, 30) + '...' : content;
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-indigo-600 text-white">
          <Link to="/" className="text-xl font-bold" onClick={onClose}>
            StudyGenie
          </Link>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-indigo-700 rounded-md transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Navigation</h3>
          {isAuthenticated ? (
            <div className="space-y-2">
              {/* User info */}
              <div className="flex items-center gap-3 p-2 text-gray-700">
                <FiUser size={16} />
                <span className="text-sm">{user?.name}</span>
              </div>
              
              {/* Chat */}
              <button 
                onClick={handleChatClick}
                className="w-full flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <FiMessageSquare size={16} />
                <span className="text-sm">Chat</span>
              </button>
              
              {/* Admin */}
              <Link 
                to="/admin" 
                onClick={onClose}
                className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <FiSettings size={16} />
                <span className="text-sm">Admin</span>
              </Link>
              
              {/* Logout */}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <FiLogOut size={16} />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link 
                to="/login" 
                onClick={onClose}
                className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <span className="text-sm">Login</span>
              </Link>
              <Link 
                to="/register" 
                onClick={onClose}
                className="flex items-center gap-3 p-2 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors font-medium"
              >
                <span className="text-sm">Register</span>
              </Link>
            </div>
          )}
        </div>

        {/* Chat History Section */}
        {isAuthenticated && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="p-4 pb-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase">Chat History</h3>
                <button
                  onClick={handleNewChat}
                  className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                  title="New Chat"
                >
                  <FiPlusCircle size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {chatSessions.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No chat history yet.</p>
              ) : (
                <div className="space-y-2">
                  {chatSessions.map((session) => (
                    <div 
                      key={session._id}
                      className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors border ${
                        currentSessionId === session._id ? 'bg-indigo-50 border-indigo-200' : 'border-gray-200'
                      }`}
                      onClick={() => handleSessionClick(session._id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {getMessagePreview(session.firstMessage)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(session.lastMessageTime)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={(e) => handleSummaryClick(session._id, e)}
                            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                            title="View summary"
                          >
                            <FiFileText size={12} />
                          </button>
                          <button
                            onClick={(e) => handleDeleteSession(session._id, e)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete conversation"
                          >
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MobileSidebar;
