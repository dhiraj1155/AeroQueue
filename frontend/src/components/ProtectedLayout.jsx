// ProtectedLayout.jsx
import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const ProtectedLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      {/* Pass collapse state to Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main content adjusts dynamically */}
      <main
        className={`flex flex-1 p-6 bg-gray-100 transition-all duration-300 
          ${isCollapsed ? "lg:ml-20" : "lg:ml-64"}`}
      >
        {children}
      </main>
    </div>
  );
};

export default ProtectedLayout;
