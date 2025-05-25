import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChatContext } from '../context/chatContext';
import { AuthContext } from '../context/authContext';
import ReactMarkdown from 'react-markdown';
import { FiFileText, FiDownload, FiArrowLeft, FiLoader, FiMessageSquare } from 'react-icons/fi';

const SummaryPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const { getChatSummary } = useContext(ChatContext);
  
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load summary on component mount
  useEffect(() => {
    if (isAuthenticated && sessionId) {
      handleGenerateSummary();
    }
  }, [isAuthenticated, sessionId]);

  const handleGenerateSummary = async () => {
    if (!sessionId) {
      setError('No session ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getChatSummary(sessionId);
      setSummaryData(data);
    } catch (err) {
      setError('Failed to generate summary');
      console.error('Summary error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSummary = () => {
    if (!summaryData) return;

    const content = `
Chat Summary
============
Session ID: ${summaryData.sessionId}
Generated: ${new Date(summaryData.generatedAt).toLocaleString()}

Summary:
--------
${summaryData.summary}

Statistics:
-----------
- Total Main Messages: ${summaryData.totalMainMessages}
- Total Side Messages: ${summaryData.totalSideMessages}
- Main Threads with Side Threads: ${summaryData.mainThreadsWithSideThreads}

${summaryData.rawConversation ? `
Raw Conversation:
-----------------
${summaryData.rawConversation}
` : ''}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-summary-${summaryData.sessionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to={`/chat/${sessionId}`}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <FiArrowLeft size={20} />
                <span>Back to Chat</span>
              </Link>
              <div className="flex items-center gap-2">
                <FiFileText className="text-indigo-600" size={24} />
                <h1 className="text-2xl font-bold text-gray-900">Chat Summary</h1>
              </div>
            </div>
            {sessionId && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiMessageSquare size={16} />
                <span>Session: {sessionId.substring(0, 8)}...</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          {loading && (
            <div className="text-center py-12">
              <FiLoader size={32} className="mx-auto text-indigo-600 animate-spin mb-4" />
              <p className="text-gray-600 text-lg">Generating comprehensive summary...</p>
              <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6 max-w-md mx-auto">
                <p className="text-red-600 font-medium">Error</p>
                <p className="text-red-500">{error}</p>
              </div>
              <button
                onClick={handleGenerateSummary}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {summaryData && (
            <div className="p-6">
              {/* Summary Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">Main Messages</h3>
                  <p className="text-3xl font-bold text-blue-600">{summaryData.totalMainMessages}</p>
                  <p className="text-blue-700 text-sm">Primary conversation</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-2">Side Messages</h3>
                  <p className="text-3xl font-bold text-green-600">{summaryData.totalSideMessages}</p>
                  <p className="text-green-700 text-sm">Follow-up discussions</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-900 mb-2">Discussion Threads</h3>
                  <p className="text-3xl font-bold text-purple-600">{summaryData.mainThreadsWithSideThreads}</p>
                  <p className="text-purple-700 text-sm">Messages with side discussions</p>
                </div>
              </div>

              {/* AI Generated Summary */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">AI Generated Summary</h2>
                  <button
                    onClick={handleDownloadSummary}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
                  >
                    <FiDownload size={16} />
                    Download Summary
                  </button>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <div className="prose max-w-none">
                    <ReactMarkdown>{summaryData.summary}</ReactMarkdown>
                  </div>
                </div>
              </div>

              {/* Error fallback message */}
              {summaryData.error && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-yellow-800 font-medium">Note:</p>
                      <p className="text-yellow-700">{summaryData.error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Raw Conversation (collapsible) */}
              {summaryData.rawConversation && (
                <div className="border border-gray-200 rounded-lg mb-8">
                  <details className="group">
                    <summary className="p-4 cursor-pointer hover:bg-gray-50 font-medium text-gray-900 transition-colors">
                      <span className="group-open:hidden">Show</span>
                      <span className="hidden group-open:inline">Hide</span>
                      {' '}Raw Formatted Conversation
                    </summary>
                    <div className="p-4 border-t bg-gray-50">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 max-h-96 overflow-auto bg-white p-4 rounded border font-mono">
                        {summaryData.rawConversation}
                      </pre>
                    </div>
                  </details>
                </div>
              )}

              {/* Metadata */}
              <div className="text-sm text-gray-500 border-t pt-4">
                <p>Summary generated on {new Date(summaryData.generatedAt).toLocaleString()}</p>
                <p className="mt-1">
                  Direct link: 
                  <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">
                    {window.location.origin}/summary/{sessionId}
                  </code>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
