import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { ChatContext } from '../context/chatContext';
import api from '../utils/api';

const Admin = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const { currentSessionId, startNewSession } = useContext(ChatContext);
  const navigate = useNavigate();
  
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if user is authenticated and admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchAdminData();
    }
  }, [isAuthenticated, navigate]);
  
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsRes = await api.get('/api/admin/stats');
      setStats(statsRes.data);
      
      // Fetch users
      const usersRes = await api.get('/api/admin/users');
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Admin data fetch error:', err);
      setError('Failed to load admin data. You may not have admin privileges.');
        // If not authorized, redirect to chat
      if (err.response?.status === 403) {
        setTimeout(() => {
          if (currentSessionId) {
            navigate(`/chat/${currentSessionId}`);
          } else {
            const newSessionId = startNewSession();
            if (newSessionId) {
              navigate(`/chat/${newSessionId}`);
            } else {
              navigate('/chat');
            }
          }
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      await api.delete(`/api/admin/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      console.error('Delete user error:', err);
      setError('Failed to delete user');
    }
  };
  
  const handleClearUserMessages = async (userId) => {
    if (!window.confirm('Are you sure you want to clear all messages for this user?')) {
      return;
    }
    
    try {
      await api.delete(`/api/admin/messages/${userId}`);
      alert('Messages cleared successfully');
    } catch (err) {
      console.error('Clear messages error:', err);
      setError('Failed to clear user messages');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-indigo-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>          <button
            onClick={() => {
              if (currentSessionId) {
                navigate(`/chat/${currentSessionId}`);
              } else {
                const newSessionId = startNewSession();
                if (newSessionId) {
                  navigate(`/chat/${newSessionId}`);
                } else {
                  navigate('/chat');
                }
              }
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Back to Chat
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Section */}
        {stats && (
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">System Statistics</h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.userCount}</dd>
                  </div>
                </div>
                <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Messages</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.messageCount}</dd>
                  </div>
                </div>
                <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">User Messages</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.userMessages}</dd>
                  </div>
                </div>
                <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">AI Responses</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.assistantMessages}</dd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Users Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Users</h2>
            <div className="mt-4 flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created At
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleClearUserMessages(user._id)}
                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                              >
                                Clear Chats
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="text-red-600 hover:text-red-900"
                                disabled={user._id === user?._id}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
