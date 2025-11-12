// Sidebar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Link2, Menu, X } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'connection', label: 'Connect', icon: Link2, path: '/connection' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/messages' },
  ];

  const handleNavigation = (item) => {
    setActiveItem(item.id);
    navigate(item.path); // Navigate to the route
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-50 md:hidden p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
<aside
  className={`fixed top-16 left-0 h-[calc(100%-64px)] w-64 bg-white z-40 transition-transform duration-300 ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  } md:translate-x-0`}
>
  <div className="flex flex-col h-full pt-4">
    <nav className="py-4 px-6">
      <ul className="space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center px-3 py-2 text-sm rounded transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-white text-gray-800 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-5 h-5 mr-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  </div>
</aside>




    </>
  );
};

export default Sidebar;
