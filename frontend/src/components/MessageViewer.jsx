import React, { useState } from "react";

const MessageViewer = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // 🟢 Pagination: current page
  const messagesPerPage = 4; // 🟢 Show 4 messages per page

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
      setMessages(data);
      setCurrentPage(1); // 🟢 Reset to first page after refresh
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to parse and format message content
  const formatMessage = (content) => {
    if (content && typeof content === "object") {
      return JSON.stringify(content, null, 2);
    }
    if (typeof content === "string") {
      try {
        const parsed = JSON.parse(content);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return content;
      }
    }
    return String(content ?? "");
  };

  // 🟢 Pagination Calculations
  const indexOfLast = currentPage * messagesPerPage;
  const indexOfFirst = indexOfLast - messagesPerPage;
  const currentMessages = messages.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(messages.length / messagesPerPage);

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
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && (
        <p className="text-red-600 bg-red-100 p-3 rounded-lg text-center">
          {error}
        </p>
      )}

      {/* 🟢 Messages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {currentMessages.length === 0 && !loading && (
          <p className="col-span-full text-center text-gray-500">
            No messages found
          </p>
        )}

        {currentMessages.map((msg) => (
          <div
            key={msg.id}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-200 flex flex-col justify-between"
          >
            <div className="overflow-x-auto">
              <pre className="text-gray-800 text-sm bg-gray-50 p-3 rounded border border-gray-200">
                {formatMessage(msg.content)}
              </pre>
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
              <span className="text-gray-500 text-xs">
                {new Date(msg.receivedAt).toLocaleString()}
              </span>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(formatMessage(msg.content))
                }
                className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🟢 Pagination Controls */}
      {messages.length > 0 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageViewer;
