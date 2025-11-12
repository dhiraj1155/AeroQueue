import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setDropdownOpen(false);
  };

  return (
    <header className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 flex justify-between items-center sticky top-0 z-50 shadow-md transition-all duration-300">
      {/* Title */}
      <div className="flex items-center">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          AeroQueue
        </h1>
      </div>

      {/* User Actions */}
      <div className="relative flex items-center space-x-3">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 bg-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 top-12 w-56 bg-white rounded-xl shadow-2xl py-2 border border-gray-100/50 z-50 animate-slideIn">

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-gray-800 text-sm font-medium hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 flex items-center space-x-2"
            >
            </button>
          </div>
        )}
      </div>

      {/* Custom Animation for Dropdown */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.2s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;