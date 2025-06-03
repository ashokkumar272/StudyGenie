import React, { useState, useContext } from 'react';
import { ChatContext } from '../context/chatContext';
import MarkdownRenderer from './MarkdownRenderer';
import { FiFileText, FiDownload, FiX, FiLoader, FiShare2, FiExternalLink } from 'react-icons/fi';

const ChatSummary = ({ sessionId, isOpen, onClose }) => {
  const { getChatSummary } = useContext(ChatContext);  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleGenerateSummary = async () => {
    if (!sessionId) {
      setError('No session selected');
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

  const handleCopyLink = async () => {
    const summaryUrl = `${window.location.origin}/summary/${sessionId}`;
    try {
      await navigator.clipboard.writeText(summaryUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleOpenInNewTab = () => {
    const summaryUrl = `${window.location.origin}/summary/${sessionId}`;
    window.open(summaryUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-50 shadow-sm rounded-t-lg">
          <div className="flex items-center gap-2">
            <FiFileText className="text-indigo-600" size={20} />
            <h2 className="text-lg font-semibold">Chat Summary</h2>
            {sessionId && (
              <span className="text-sm text-gray-500">Session: {sessionId.substring(0, 8)}...</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {!summaryData && !loading && (
            <div className="text-center py-8">
              <FiFileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">Generate a comprehensive summary of this chat session</p>
              <button
                onClick={handleGenerateSummary}
                disabled={!sessionId || loading}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                Generate Summary
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <FiLoader size={24} className="mx-auto text-indigo-600 animate-spin mb-4" />
              <p className="text-gray-600">Generating summary...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-600">{error}</p>
              </div>
              <button
                onClick={handleGenerateSummary}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {summaryData && (
            <div className="space-y-6">
              {/* Summary Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900">Main Messages</h3>
                  <p className="text-2xl font-bold text-blue-600">{summaryData.totalMainMessages}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900">Side Messages</h3>
                  <p className="text-2xl font-bold text-green-600">{summaryData.totalSideMessages}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-900">Threads with Side Discussions</h3>
                  <p className="text-2xl font-bold text-purple-600">{summaryData.mainThreadsWithSideThreads}</p>
                </div>
              </div>              {/* AI Generated Summary */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">AI Generated Summary</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg transition-colors text-sm"
                      title="Copy summary link"
                    >
                      <FiShare2 size={14} />
                      {copySuccess ? 'Copied!' : 'Copy Link'}
                    </button>
                    <button
                      onClick={handleOpenInNewTab}
                      className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-lg transition-colors text-sm"
                      title="Open in new tab"
                    >
                      <FiExternalLink size={14} />
                      Open
                    </button>
                    <button
                      onClick={handleDownloadSummary}
                      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg transition-colors text-sm"
                    >
                      <FiDownload size={14} />
                      Download
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="prose max-w-none">
                    <MarkdownRenderer content={summaryData.summary} />
                  </div>
                </div>
              </div>              {/* Error fallback message */}
              {summaryData.error && (
                <div className="bg-yellow-50 shadow-sm rounded-lg p-4">
                  <p className="text-yellow-800 font-medium">Note:</p>
                  <p className="text-yellow-700">{summaryData.error}</p>
                </div>
              )}              {/* Raw Conversation (collapsible) */}
              {summaryData.rawConversation && (
                <details className="shadow-sm rounded-lg bg-white">
                  <summary className="p-4 cursor-pointer hover:bg-gray-50 font-medium">
                    View Raw Formatted Conversation
                  </summary>
                  <div className="p-4 bg-gray-50 shadow-sm">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 max-h-96 overflow-auto">
                      {summaryData.rawConversation}
                    </pre>
                  </div>
                </details>
              )}

              {/* Metadata */}
              <div className="text-sm text-gray-500 bg-gray-50 shadow-sm rounded-lg pt-4 p-4 mt-4">
                <p>Generated on {new Date(summaryData.generatedAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>        {/* Footer */}
        <div className="bg-gray-50 shadow-sm p-4 flex justify-end rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSummary;
