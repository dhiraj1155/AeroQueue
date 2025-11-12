import { useState, useEffect } from "react";
import { useConnection } from "../context/ConnectionContext";

const BrokerConnectionForm = ({ token }) => {
  const { connectionState, connectBroker, disconnectBroker } = useConnection();

  // Load initial state from localStorage or default values
  const getInitialFormData = () => {
    const saved = localStorage.getItem("brokerFormData");
    return saved
      ? JSON.parse(saved)
      : { host: "", port: 5671, username: "", password: "", queueName: "" };
  };

  const [formData, setFormData] = useState(getInitialFormData);

  // Save formData to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("brokerFormData", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleConnect = (e) => {
    e.preventDefault();
    connectBroker(formData); // Provided by context
  };

  const handleDisconnect = () => {
    disconnectBroker(); // Provided by context
  };

  const { isConnected, isConnecting, success, error } = connectionState;

  return (
    <section className="bg-white/95 backdrop-blur-md rounded-xl p-6 shadow-lg border border-gray-100/50 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-indigo-900 mb-6 text-center">
        Connect to Solace Broker
      </h2>

      {error && (
        <p className="text-red-600 bg-red-100/50 p-3 rounded-lg mb-6 text-center text-sm animate-fadeIn">
          {error}
        </p>
      )}
      {success && (
        <p className="text-green-600 bg-green-100/50 p-3 rounded-lg mb-6 text-center text-sm animate-fadeIn">
          {success}
        </p>
      )}

      <form onSubmit={handleConnect} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-indigo-900 mb-1">
              Host
            </label>
            <input
              type="text"
              name="host"
              placeholder="Enter hostname"
              className="w-full px-4 py-2 bg-gray-50 text-gray-800 border border-gray-200 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 
                         transition-colors duration-200 placeholder-gray-400"
              value={formData.host}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-indigo-900 mb-1">
              Port
            </label>
            <input
              type="number"
              name="port"
              placeholder="Enter port"
              className="w-full px-4 py-2 bg-gray-50 text-gray-800 border border-gray-200 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 
                         transition-colors duration-200 placeholder-gray-400"
              value={formData.port}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-indigo-900 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              className="w-full px-4 py-2 bg-gray-50 text-gray-800 border border-gray-200 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 
                         transition-colors duration-200 placeholder-gray-400"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-indigo-900 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              className="w-full px-4 py-2 bg-gray-50 text-gray-800 border border-gray-200 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 
                         transition-colors duration-200 placeholder-gray-400"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-indigo-900 mb-1">
              Queue Name
            </label>
            <input
              type="text"
              name="queueName"
              placeholder="Enter queue name"
              className="w-full px-4 py-2 bg-gray-50 text-gray-800 border border-gray-200 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 
                         transition-colors duration-200 placeholder-gray-400"
              value={formData.queueName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleDisconnect}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg 
                       hover:bg-red-700 transition-colors duration-200 
                       disabled:opacity-50 disabled:cursor-not-allowed 
                       focus:outline-none focus:ring-2 focus:ring-red-500"
            disabled={!isConnected}
          >
            Disconnect
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg 
                       hover:bg-indigo-700 transition-colors duration-200 
                       disabled:opacity-50 disabled:cursor-not-allowed 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isConnecting || isConnected}
          >
            {isConnecting ? "Connecting..." : "Connect"}
          </button>
        </div>
      </form>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default BrokerConnectionForm;
