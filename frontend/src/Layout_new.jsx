// File: src/Layout.jsx

import React from 'react';
import { Link, Navigate } from 'react-router-dom';

function Layout({ children }) {
  // localStorage'de token var mı?
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <span className="material-icons text-3xl text-blue-500 mr-2">shield</span>
              <h1 className="text-xl font-bold text-white">FirewallOS</h1>
            </div>
            <button className="text-gray-400 hover:text-white transition-colors">
              <span className="material-icons">add</span>
            </button>
          </div>

          <div className="flex items-center mb-6 p-3 rounded-md hover:bg-gray-700 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-blue-500 mr-3 flex items-center justify-center">
              <span className="material-icons text-white text-sm">person</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Admin Profile</p>
            </div>
            <span className="material-icons ml-auto text-gray-400">expand_more</span>
          </div>

          <nav>
            <ul>
              <li>
                <Link 
                  className="flex items-center px-5 py-3 rounded-md transition-colors hover:bg-gray-700 text-gray-300 hover:text-white" 
                  to="/dashboard"
                >
                  <span className="material-icons mr-3 text-xl">dashboard</span>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  className="flex items-center px-5 py-3 rounded-md transition-colors hover:bg-gray-700 text-gray-300 hover:text-white" 
                  to="/logs"
                >
                  <span className="material-icons mr-3 text-xl">bar_chart</span>
                  Logs
                </Link>
              </li>
              <li>
                <Link 
                  className="flex items-center px-5 py-3 rounded-md transition-colors hover:bg-gray-700 text-gray-300 hover:text-white" 
                  to="/rules"
                >
                  <span className="material-icons mr-3 text-xl">security</span>
                  Firewall Rules
                </Link>
              </li>
              <li>
                <Link 
                  className="flex items-center px-5 py-3 rounded-md transition-colors hover:bg-gray-700 text-gray-300 hover:text-white" 
                  to="/groups"
                >
                  <span className="material-icons mr-3 text-xl">group_work</span>
                  Rule Groups
                </Link>
              </li>
              <li>
                <Link 
                  className="flex items-center px-5 py-3 rounded-md transition-colors hover:bg-gray-700 text-gray-300 hover:text-white" 
                  to="/network"
                >
                  <span className="material-icons mr-3 text-xl">network_check</span>
                  Network
                </Link>
              </li>
              <li>
                <Link 
                  className="flex items-center px-5 py-3 rounded-md transition-colors hover:bg-gray-700 text-gray-300 hover:text-white" 
                  to="/nat"
                >
                  <span className="material-icons mr-3 text-xl">router</span>
                  NAT Settings
                </Link>
              </li>
              <li>
                <Link 
                  className="flex items-center px-5 py-3 rounded-md transition-colors hover:bg-gray-700 text-gray-300 hover:text-white" 
                  to="/routes"
                >
                  <span className="material-icons mr-3 text-xl">alt_route</span>
                  Routes
                </Link>
              </li>
              <li>
                <Link 
                  className="flex items-center px-5 py-3 rounded-md transition-colors hover:bg-gray-700 text-gray-300 hover:text-white" 
                  to="/dns-management"
                >
                  <span className="material-icons mr-3 text-xl">dns</span>
                  DNS Management
                </Link>
              </li>
              <li>
                <Link 
                  className="flex items-center px-5 py-3 rounded-md transition-colors hover:bg-gray-700 text-gray-300 hover:text-white" 
                  to="/settings"
                >
                  <span className="material-icons mr-3 text-xl">settings</span>
                  Settings
                </Link>
              </li>
              <li>
                <Link 
                  className="flex items-center px-5 py-3 rounded-md transition-colors hover:bg-gray-700 text-gray-300 hover:text-white" 
                  to="/reports"
                >
                  <span className="material-icons mr-3 text-xl">assessment</span>
                  Reports
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="p-3 bg-gray-900 rounded-md">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-gray-400">System Status</span>
            <span className="text-green-400">Active</span>
          </div>
          <div className="bg-gray-700 rounded-full h-2 mb-1">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
          </div>
          <p className="text-xs text-gray-400">85% Protection Active</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-900 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default Layout;
