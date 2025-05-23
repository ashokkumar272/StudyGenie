import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './authContext';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { isAuthenticated, token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch chat history when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchChatHistory();
    } else {
      setMessages([]);
    }
  }, [isAuthenticated]);

  // Fetch chat history
  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/chat/history');
      setMessages(res.data);
    } catch (err) {
      console.error('Fetch chat history error:', err);
      setError('Failed to load chat history');
    } finally {
      setLoading(false);
    }
  };

  // Send message to AI
  const sendMessage = async (content) => {
    try {
      setLoading(true);
      
      // Optimistically update UI with user message
      const userMessage = {
        _id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date().toISOString()
      };
      
      setMessages((prev) => [...prev, userMessage]);
      
      // Send to API
      const res = await axios.post('/api/chat', { content });
      
      // Add AI response to messages
      const aiMessage = {
        _id: res.data.messageId,
        role: 'assistant',
        content: res.data.message,
        timestamp: new Date().toISOString()
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      return true;
    } catch (err) {
      console.error('Send message error:', err);
      setError('Failed to send message');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear chat history
  const clearChatHistory = async () => {
    try {
      setLoading(true);
      await axios.delete('/api/chat/history');
      setMessages([]);
      return true;
    } catch (err) {
      console.error('Clear chat history error:', err);
      setError('Failed to clear chat history');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        loading,
        error,
        sendMessage,
        clearChatHistory,
        clearError
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;