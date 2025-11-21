import BrokerConnectionForm from "../components/BrokerConnectionForm";

export default function Dashboard() {
  const token = localStorage.getItem("token");

  // Dummy stats
  const stats = {
    totalMessages: 2,
    messageTypes: ["Text", "JSON", "XML"],
    totalUsers: 4,
    isConnected: true, // change to false to test disconnected state
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-6">
      
      {/* Dashboard Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Total Messages */}
        <div className="bg-white shadow-lg rounded-xl p-5 border border-gray-100">
          <p className="text-gray-500 text-sm">Total Messages</p>
          <h2 className="text-3xl font-bold text-indigo-600">
            {stats.totalMessages}
          </h2>
        </div>

        {/* Message Types */}
        <div className="bg-white shadow-lg rounded-xl p-5 border border-gray-100">
          <p className="text-gray-500 text-sm">Message Types</p>
          <h2 className="text-lg font-semibold text-purple-600 mt-1">
            {stats.messageTypes.join(", ")}
          </h2>
        </div>

        {/* Total Users */}
        <div className="bg-white shadow-lg rounded-xl p-5 border border-gray-100">
          <p className="text-gray-500 text-sm">Active Users</p>
          <h2 className="text-3xl font-bold text-green-600">
            {stats.totalUsers}
          </h2>
        </div>

        {/* Solace Status */}
        <div className="bg-white shadow-lg rounded-xl p-5 border border-gray-100">
          <p className="text-gray-500 text-sm">Solace Status</p>
          <div className="flex items-center space-x-2 mt-1">
            <span
              className={`w-3 h-3 rounded-full ${
                stats.isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            <span
              className={`font-semibold ${
                stats.isConnected ? "text-green-600" : "text-red-600"
              }`}
            >
              {stats.isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>

      </div>

    

    </div>
  );
}
