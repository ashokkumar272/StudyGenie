import React from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatContext } from '../context/chatContext';
import { FiMessageSquare, FiPlusCircle, FiTrash2 } from 'react-icons/fi';

const ChatSidebar = () => {
  const navigate = useNavigate();
  const { 
    chatSessions, 
    currentSessionId, 
    fetchSessionMessages, 
    deleteSession,
    startNewSession
  } = useContext(ChatContext);

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
    return content.length > 40 ? content.substring(0, 40) + '...' : content;
  };

  return (
    <div className="w-64 h-full bg-gray-100 border-r overflow-auto">      <div className="p-4">
        <button
          onClick={() => {
            const newSessionId = startNewSession();
            if (newSessionId) {
              navigate(`/chat/${newSessionId}`);
            }
          }}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg mb-4 hover:bg-indigo-700 transition"
        >
          <FiPlusCircle />
          <span>New Chat</span>
        </button>
      </div>

      <div className="px-3 pb-3">
        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2 px-2">Chat History</h3>
        <div className="space-y-1">
          {chatSessions.length === 0 ? (
            <p className="text-sm text-gray-500 px-2">No chat history yet.</p>
          ) : (
            chatSessions.map((session) => (
              <div 
                key={session._id}
                className={`flex items-start p-2 rounded-md cursor-pointer hover:bg-gray-200 group ${
                  currentSessionId === session._id ? 'bg-gray-200' : ''
                }`}
                onClick={() => navigate(`/chat/${session._id}`)}
              >
                <div className="text-indigo-600 mr-3 mt-1">
                  <FiMessageSquare size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {getMessagePreview(session.firstMessage)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(session.lastMessageTime)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Are you sure you want to delete this conversation?')) {
                      deleteSession(session._id);
                    }
                  }}
                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
