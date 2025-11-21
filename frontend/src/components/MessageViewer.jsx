import React, { useState } from "react";

const MessageViewer = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const messagesPerPage = 4;
  const token = localStorage.getItem("token");

  const fetchMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3000/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch");

      // Ensure array format
      const list = Array.isArray(data) ? data : data.messages || [];
      setMessages(list);
      setCurrentPage(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Convert message to readable string
  const formatMessage = (msg) => {
    try {
      return JSON.stringify(msg, null, 2);
    } catch {
      return String(msg);
    }
  };

  // ✅ WORKING SEARCH
  const filteredMessages = messages.filter((msg) => {
    if (!searchQuery.trim()) return true;
    const text = JSON.stringify(msg).toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  // ✅ Pagination logic
  const indexOfLast = currentPage * messagesPerPage;
  const indexOfFirst = indexOfLast - messagesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage) || 1;

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 p-4">
      <h2 className="text-2xl font-bold text-indigo-900 text-center">
        Stored Messages
      </h2>

      <div className="flex justify-center">
        <button
          onClick={fetchMessages}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && (
        <p className="text-red-600 bg-red-100 p-3 rounded-lg text-center">
          {error}
        </p>
      )}

      {/* ✅ Search Bar */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-10 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {/* ✅ Messages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {currentMessages.length === 0 && !loading && (
          <p className="col-span-full text-center text-gray-500">
            No matching messages found
          </p>
        )}

        {currentMessages.map((msg, index) => (
          <div
            key={msg.id || index}
            className="bg-white shadow-md rounded-lg p-4 border"
          >
            <pre className="text-gray-800 text-sm bg-gray-50 p-3 rounded overflow-x-auto">
              {formatMessage(msg)}
            </pre>

            <div className="flex justify-between items-center mt-3 border-t pt-2">
              {msg.receivedAt && (
                <span className="text-xs text-gray-500">
                  {new Date(msg.receivedAt).toLocaleString()}
                </span>
              )}
              <button
                onClick={() =>
                  navigator.clipboard.writeText(formatMessage(msg))
                }
                className="text-xs text-indigo-600 hover:text-indigo-800"
              >
                Copy
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Pagination Controls */}
      {filteredMessages.length > 0 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageViewer;
