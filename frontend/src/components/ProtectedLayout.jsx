// ProtectedLayout.jsx
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const ProtectedLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="flex flex-1 p-6 bg-gray-100 lg:ml-64">
        {children}
      </main>
    </div>
  );
};

export default ProtectedLayout;
