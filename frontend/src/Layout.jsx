// File: src/Layout.jsx

import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom'; // useNavigate import edildi

function Layout({ children }) {
  const navigate = useNavigate(); // useNavigate hook'u kullanıldı
  // localStorage'de token var mı?
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 flex flex-col justify-between p-4">
        {/* Sidebar'ın üst kısmı (Logo ve Navigasyon) */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <span className="material-icons text-5xl text-blue-500 mr-3">shield</span>
              <h1 className="text-3xl font-bold text-white mt-2">NetGate</h1>
            </div>
          </div>

          <nav>
            <ul>              <li>
                <Link 
                  className="flex items-center px-4 py-3 rounded-md transition-colors hover:bg-gray-700 text-gray-300 hover:text-white no-underline" 
                  to="/dashboard"
                >                  <span className="material-icons mr-4 text-xl">dashboard</span>
                  Ana Sayfa
                </Link>
              </li>
              <li>                <Link 
                  className="flex items-center px-4 py-3 rounded-md transition-colors hover:bg-gray-700 text-gray-300 hover:text-white no-underline" 
                  to="/logs"
                >
                  <span className="material-icons mr-4 text-xl">bar_chart</span>
                  Loglar
                </Link>
              </li>
              <li>                <Link 
                  className="flex items-center px-4 py-3 rounded-md transition-colors hover:bg-gray-700 text-gray-300 hover:text-white no-underline" 
                  to="/rules"
                >
                  <span className="material-icons mr-4 text-xl">security</span>
                  Güvenlik Kuralları
                </Link>
              </li>
              <li>                <Link 
                  className="flex items-center px-4 py-3 rounded-md transition-colors hover:bg-gray-700 text-gray-300 hover:text-white no-underline" 
                  to="/groups"
                >
                  <span className="material-icons mr-4 text-xl">group_work</span>
                  Kural Grupları
                </Link>
              </li>              <li>                <Link 
                  className="flex items-center px-4 py-3 rounded-md transition-colors hover:bg-gray-700 text-gray-300 hover:text-white no-underline" 
                  to="/network"
                >
                  <span className="material-icons mr-4 text-xl">network_check</span>
                  Interface Ayarları
                </Link>
              </li>
              <li>                <Link 
                  className="flex items-center px-4 py-3 rounded-md transition-colors hover:bg-gray-700 text-gray-300 hover:text-white no-underline" 
                  to="/nat"
                >
                  <span className="material-icons mr-4 text-xl">router</span>
                  NAT Ayarları
                </Link>
              </li>
              <li>                <Link 
                  className="flex items-center px-4 py-3 rounded-md transition-colors hover:bg-gray-700 text-gray-300 hover:text-white no-underline" 
                  to="/routes"
                >
                  <span className="material-icons mr-4 text-xl">alt_route</span>
                  Rotalar
                </Link>
              </li>
              <li>                <Link 
                  className="flex items-center px-4 py-3 rounded-md transition-colors hover:bg-gray-700 text-gray-300 hover:text-white no-underline" 
                  to="/dns-management"
                >
                  <span className="material-icons mr-4 text-xl">dns</span>
                  DNS Yönetimi
                </Link>
              </li>
              <li>                <Link 
                  className="flex items-center px-4 py-3 rounded-md transition-colors hover:bg-gray-700 text-gray-300 hover:text-white no-underline" 
                  to="/settings"
                >
                  <span className="material-icons mr-4 text-xl">settings</span>
                  Ayarlar
                </Link>
              </li>              <li>                <Link 
                  className="flex items-center px-4 py-3 rounded-md transition-colors hover:bg-gray-700 text-gray-300 hover:text-white no-underline" 
                  to="/reports"
                >
                  <span className="material-icons mr-4 text-xl">assessment</span>
                  Raporlar
                </Link>
              </li>
              <li>                <Link 
                  className="flex items-center px-4 py-3 rounded-md transition-colors hover:bg-gray-700 text-gray-300 hover:text-white no-underline" 
                  to="/updates"
                >
                  <span className="material-icons mr-4 text-xl">system_update</span>
                  Güncellemeler
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Sidebar'ın alt kısmı (Çıkış Butonu) */}
        <div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 rounded-md transition-colors text-red-400 hover:bg-red-600 hover:text-white no-underline"
            type="button"
          >
            <span className="material-icons mr-4 text-xl">logout</span>
            Çıkış Yap
          </button>
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
