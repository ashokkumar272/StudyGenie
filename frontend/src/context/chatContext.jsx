import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './authContext';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { isAuthenticated, token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  // Fetch chat history when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchChatSessions();
    } else {
      setMessages([]);
      setChatSessions([]);
      setCurrentSessionId(null);
    }
  }, [isAuthenticated]);
  // Fetch chat sessions
  const fetchChatSessions = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/chat/sessions');
      
      if (!res.data) {
        throw new Error('Invalid response from server');
      }
      
      setChatSessions(res.data);
      
      // If there are sessions and no current session is selected,
      // select the most recent one
      if (res.data.length > 0 && !currentSessionId) {
        setCurrentSessionId(res.data[0]._id);
        await fetchSessionMessages(res.data[0]._id);
      } else if (currentSessionId) {
        const sessionExists = res.data.some(session => session._id === currentSessionId);
        if (sessionExists) {
          await fetchSessionMessages(currentSessionId);
        } else if (res.data.length > 0) {
          // If current session doesn't exist anymore, select the most recent one
          setCurrentSessionId(res.data[0]._id);
          await fetchSessionMessages(res.data[0]._id);
        } else {
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error('Fetch chat sessions error:', err);
      setError('Failed to load chat sessions');
    } finally {
      setLoading(false);
    }
  };
  // Fetch messages for a specific session
  const fetchSessionMessages = async (sessionId) => {
    if (!sessionId) {
      console.error('No session ID provided');
      return;
    }
    
    try {
      setLoading(true);
      const res = await axios.get(`/api/chat/session/${sessionId}`);
      
      if (!res.data) {
        throw new Error('Invalid response from server');
      }
      
      setMessages(res.data);
      setCurrentSessionId(sessionId);
    } catch (err) {
      console.error('Fetch session messages error:', err);
      setError('Failed to load chat messages');
      // If fetching specific session fails, set empty messages
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all chat history
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
  };  // Send message to AI
  const sendMessage = async (content) => {
    try {
      // Validate content
      if (!content || content.trim() === '') {
        setError('Message content cannot be empty');
        return false;
      }
      
      setLoading(true);
      
      // If no session exists, create a new one
      const sessionId = currentSessionId || Date.now().toString();
      
      if (!currentSessionId) {
        setCurrentSessionId(sessionId);
      }
      
      // Optimistically update UI with user message
      const userMessage = {
        _id: Date.now().toString(),
        role: 'user',
        content,
        chatSessionId: sessionId,
        timestamp: new Date().toISOString()
      };
      
      setMessages((prev) => [...prev, userMessage]);
        // Send to API
      const res = await axios.post('/api/chat', { 
        content, 
        chatSessionId: sessionId 
      });
      
      if (!res.data || !res.data.message) {
        throw new Error('Invalid response from server');
      }
      
      // Add AI response to messages
      const aiMessage = {
        _id: res.data.messageId || Date.now().toString() + '-ai',
        role: 'assistant',
        content: res.data.message,
        chatSessionId: sessionId,
        timestamp: new Date().toISOString()
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      
      // Refresh chat sessions list
      fetchChatSessions();
      
      return true;
    } catch (err) {
      console.error('Send message error:', err);
      setError('Failed to send message');
      return false;
    } finally {
      setLoading(false);
    }
  };
  // Clear all chat history
  const clearChatHistory = async () => {
    try {
      setLoading(true);
      await axios.delete('/api/chat/history');
      setMessages([]);
      setChatSessions([]);
      setCurrentSessionId(null);
      return true;
    } catch (err) {
      console.error('Clear chat history error:', err);
      setError('Failed to clear chat history');
      return false;
    } finally {
      setLoading(false);
    }
  };
  // Delete a specific chat session
  const deleteSession = async (sessionId) => {
    if (!sessionId) {
      console.error('No session ID provided for deletion');
      return false;
    }
    
    try {
      setLoading(true);
      await axios.delete(`/api/chat/session/${sessionId}`);
      
      // Update sessions list
      setChatSessions(prev => prev.filter(session => session._id !== sessionId));
      
      // If the current session was deleted, set to null or select a different one
      if (currentSessionId === sessionId) {
        // Select the most recent session if available
        const remainingSessions = chatSessions.filter(session => session._id !== sessionId);
        if (remainingSessions.length > 0) {
          setCurrentSessionId(remainingSessions[0]._id);
          await fetchSessionMessages(remainingSessions[0]._id);
        } else {
          setCurrentSessionId(null);
          setMessages([]);
        }
      }
      
      return true;
    } catch (err) {
      console.error('Delete session error:', err);
      setError('Failed to delete chat session');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Start a new chat session
  const startNewSession = () => {
    try {
      const newSessionId = Date.now().toString();
      setCurrentSessionId(newSessionId);
      setMessages([]);
      
      // Add the new session to the chatSessions list
      const newSession = {
        _id: newSessionId,
        firstMessage: "New conversation",
        lastMessageTime: new Date().toISOString(),
        messageCount: 0
      };
      
      setChatSessions(prev => [newSession, ...prev]);
      
      return newSessionId;
    } catch (err) {
      console.error('Start new session error:', err);
      setError('Failed to start new chat session');
      return null;
    }
  };  // Send follow-up question based on selected text
  const sendFollowupQuestion = async ({ selectedText, originalAssistantMessage, userFollowupQuestion }) => {
    try {
      // Validate content
      if (!selectedText || !originalAssistantMessage || !userFollowupQuestion.trim()) {
        setError('Missing information for follow-up question');
        return {
          messageId: Date.now().toString() + '-error',
          message: 'Please provide both selected text and a follow-up question.',
          isError: true
        };
      }
      
      setLoading(true);
      
      // Use current session or create a new one
      const sessionId = currentSessionId || Date.now().toString();
      
      if (!currentSessionId) {
        setCurrentSessionId(sessionId);
      }
      
      // Optimistically update UI with user follow-up message
      const formattedQuestion = `Regarding: "${selectedText}" - ${userFollowupQuestion}`;
      const userMessageId = Date.now().toString();
      const userMessage = {
        _id: userMessageId,
        role: 'user',
        content: formattedQuestion,
        chatSessionId: sessionId,
        timestamp: new Date().toISOString(),
        selectedText,
        fullAssistantMessage: originalAssistantMessage
      };
      
      setMessages((prev) => [...prev, userMessage]);
      
      try {
        // Send to API
        const res = await axios.post('/api/chat/followup', { 
          selectedText, 
          originalAssistantMessage, 
          userFollowupQuestion,
          chatSessionId: sessionId 
        });
        
        if (!res.data || !res.data.message) {
          throw new Error('Invalid response from server');
        }
        
        // Add AI response to messages
        const aiMessage = {
          _id: res.data.messageId || Date.now().toString() + '-ai',
          role: 'assistant',
          content: res.data.message,
          chatSessionId: sessionId,
          timestamp: new Date().toISOString(),
          replyToMessageId: userMessageId
        };
        
        setMessages((prev) => [...prev, aiMessage]);
        
        // Refresh chat sessions list
        fetchChatSessions();
        
        // Return the response data for the side panel
        return {
          messageId: res.data.messageId,
          message: res.data.message
        };
      } catch (apiError) {
        // If API call fails, add error message
        const errorMessage = {
          _id: Date.now().toString() + '-error',
          role: 'assistant',
          content: 'Sorry, I encountered an error processing your question. Please try again.',
          chatSessionId: sessionId,
          timestamp: new Date().toISOString(),
          replyToMessageId: userMessageId
        };
        
        setMessages((prev) => [...prev, errorMessage]);
        
        // Also return the error message for the side panel
        return {
          messageId: errorMessage._id,
          message: errorMessage.content,
          isError: true
        };
      }
    } catch (err) {
      console.error('Send follow-up message error:', err);
      setError('Failed to send follow-up message');
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
        chatSessions,
        currentSessionId,
        sendMessage,
        sendFollowupQuestion,
        clearChatHistory,
        clearError,
        fetchSessionMessages,
        deleteSession,
        startNewSession
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;