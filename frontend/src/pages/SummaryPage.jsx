import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChatContext } from '../context/chatContext';
import { AuthContext } from '../context/authContext';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { generateSummaryPDFLazy } from '../utils/pdfLazyLoader';
import { FiFileText, FiDownload, FiArrowLeft, FiLoader, FiMessageSquare } from 'react-icons/fi';

const SummaryPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const { getChatSummary } = useContext(ChatContext);
    const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
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

  const handleForceRegenerate = async () => {
    if (!sessionId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // First invalidate the cached summary
      await fetch(`/api/chat/summary/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      // Then generate a new summary
      const data = await getChatSummary(sessionId);
      setSummaryData(data);
    } catch (err) {
      setError('Failed to regenerate summary');
      console.error('Regenerate summary error:', err);
    } finally {
      setLoading(false);
    }
  };
  const handleDownloadSummary = async () => {
    if (!summaryData) return;
    
    try {
      setDownloading(true);
      await generateSummaryPDFLazy(summaryData);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(false);
    }
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
              {/* AI Generated Summary */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">AI Generated Summary</h2>
                  <button
                    onClick={handleDownloadSummary}
                    disabled={downloading}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-colors"
                    title="Download as PDF"
                  >
                    <FiDownload size={16} className={downloading ? 'animate-bounce' : ''} />
                    {downloading ? 'Generating PDF...' : 'Download PDF'}
                  </button>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <div className="prose max-w-none">
                    <MarkdownRenderer content={summaryData.summary} />
                  </div>
                </div>
              </div>

              {/* Metadata: Only show sessionId */}
              <div className="text-sm text-gray-500 border-t pt-4">
                <p>Session ID: <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">{sessionId}</code></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
