import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Link2, Menu, X } from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');


  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'connection', label: 'Connect', icon: Link2, path: '/connection' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/messages' },
  ];

  const handleNavigation = (item) => {
    setActiveItem(item.id);
    navigate(item.path);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-20 left-4 z-50 md:hidden p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100%-64px)] bg-white z-40 transition-all duration-300 border-r border-gray-200
          ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        <div className="flex flex-col h-full pt-4">
          {/* Menu Items */}
          <nav className="py-4 px-3">
            <ul className="space-y-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavigation(item)}
                      className={`w-f3/5 flex items-center ${
                        isCollapsed ? 'justify-center' : 'justify-start'
                      } px-3 py-2 text-sm rounded transition-all ${
                        isActive ? 'bg-indigo-600 text-white font-semibold' : 'bg-white text-gray-800 hover:bg-gray-100'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${!isCollapsed ? 'mr-4' : ''} ${
                          isActive ? 'text-white' : 'text-gray-600'
                        }`}
                      />
                      {!isCollapsed && <span>{item.label}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Collapse Button at Bottom */}
          <div className="mt-auto pb-4 flex justify-center hidden md:flex">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100 transition"
            >
              {isCollapsed ? (
                <Menu className="w-5 h-5 text-gray-700" />
              ) : (
                <X className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
