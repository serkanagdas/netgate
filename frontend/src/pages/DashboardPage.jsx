// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

// Chart.js kurarken gerekebilecek register'lar 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function DashboardPage() {
  const [totalQueries, setTotalQueries] = useState(135421);
  const [blockedQueries, setBlockedQueries] = useState(23543);
  const [threats, setThreats] = useState(342);
  const [encrypted, setEncrypted] = useState(98.7);

  // Rastgele değerler simülasyonu
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalQueries(prev => prev + Math.floor(Math.random() * 10));
      setBlockedQueries(prev => prev + Math.floor(Math.random() * 3));
      setThreats(prev => prev + Math.floor(Math.random() * 2));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Line chart verisi
  const chartData = {
    labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
    datasets: [
      {
        label: 'Total Queries',
        data: [200, 180, 150, 160, 250, 500, 700, 750, 680, 600, 500, 400],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        fill: true,
      },
      {
        label: 'Blocked',
        data: [50, 40, 30, 35, 60, 120, 180, 200, 150, 130, 100, 80],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        fill: true,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#9CA3AF',
          stepSize: 250,
        },
        grid: {
          color: '#374151',
          drawBorder: false,
        }
      },
      x: {
        ticks: {
          color: '#9CA3AF'
        },
        grid: {
          display: false,
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#1F2937',
        titleColor: '#FFFFFF',
        bodyColor: '#D1D5DB',
        borderColor: '#374151',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 4,
      }
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-gray-900 text-gray-100">
      <header className="mb-8">
        <h2 className="text-3xl font-semibold text-white">Ana Sayfa</h2>
        <p className="text-gray-400">Güvenlik duvarı yapılandırmanız ve etkinliklerin genel görünümü.</p>
      </header>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-400">Durum</h3>
            <span className="material-icons text-green-500">check_circle</span>
          </div>
          <p className="text-2xl font-semibold text-white">Aktif</p>
          <p className="text-xs text-gray-400">Güvenlik duvarınız düzgün çalışıyor</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-400">Bağlı Cihazlar</h3>
            <span className="material-icons text-blue-500">devices</span>
          </div>
          <p className="text-2xl font-semibold text-white">5</p>
          <p className="text-xs text-gray-400">Güvenlik duvarı koruması kullanan cihazlar</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-400">Aktif Kurallar</h3>
            <span className="material-icons text-yellow-500">security</span>
          </div>
          <p className="text-2xl font-semibold text-white">12</p>
          <p className="text-xs text-gray-400">Aktif güvenlik duvarı kuralları</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-400">Son Güncelleme</h3>
            <span className="material-icons text-gray-400">history</span>
          </div>
          <p className="text-2xl font-semibold text-white">2sa önce</p>
          <p className="text-xs text-gray-400">Son yapılandırma değişikliği</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-1">Toplam Bağlantı</h3>
          <p className="text-3xl font-bold text-white">{totalQueries.toLocaleString()}</p>
          <p className="text-xs text-gray-400">Geçen aydan +%12</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-medium text-gray-400">Engellenen</h3>
            <span className="material-icons text-red-500">block</span>
          </div>
          <p className="text-3xl font-bold text-white">{blockedQueries.toLocaleString()}</p>
          <p className="text-xs text-gray-400">Toplam bağlantıların %{((blockedQueries / totalQueries) * 100).toFixed(1)}'i</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-medium text-gray-400">Tehditler</h3>
            <span className="material-icons text-yellow-500">warning</span>
          </div>
          <p className="text-3xl font-bold text-white">{threats}</p>
          <p className="text-xs text-gray-400">Engellenen bağlantıların %{((threats / blockedQueries) * 100).toFixed(1)}'i</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-medium text-gray-400">Güvenli</h3>
            <span className="material-icons text-green-500">enhanced_encryption</span>
          </div>
          <p className="text-3xl font-bold text-white">%{encrypted}</p>
          <p className="text-xs text-gray-400">Toplam bağlantıların</p>
        </div>
      </div>

      {/* Analytics and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Analitik</h3>
            <div className="flex space-x-1">
              <button className="px-3 py-1 text-xs font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">24sa</button>
              <button className="px-3 py-1 text-xs font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">7g</button>
              <button className="px-3 py-1 text-xs font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">30g</button>
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-4">Zaman içindeki ağ etkinliği</p>
          <div className="h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
          <div className="flex justify-center space-x-6 mt-4 text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
              <span className="text-gray-400">Toplam Bağlantı</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
              <span className="text-gray-400">Engellenen</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Son Etkinlik</h3>
          <p className="text-sm text-gray-400 mb-4">Son ağ olayları</p>
          <ul className="space-y-4">
            <li className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-white">malware.com</p>
                <p className="text-xs text-gray-400">TCP <span className="text-gray-500">192.168.1.1</span></p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 text-xs font-medium bg-red-500 text-white rounded">Engellendi</span>
                <span className="text-xs text-gray-500">2dk önce</span>
              </div>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-white">github.com</p>
                <p className="text-xs text-gray-400">HTTPS <span className="text-gray-500">192.168.1.5</span></p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 text-xs font-medium bg-green-500 text-white rounded">İzin Verildi</span>
                <span className="text-xs text-gray-500">5dk önce</span>
              </div>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-white">suspicious-site.net</p>
                <p className="text-xs text-gray-400">HTTP <span className="text-gray-500">192.168.1.10</span></p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 text-xs font-medium bg-red-500 text-white rounded">Engellendi</span>
                <span className="text-xs text-gray-500">9dk önce</span>
              </div>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-white">vercel.com</p>
                <p className="text-xs text-gray-400">HTTPS <span className="text-gray-500">192.168.1.1</span></p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 text-xs font-medium bg-green-500 text-white rounded">İzin Verildi</span>
                <span className="text-xs text-gray-500">12dk önce</span>
              </div>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-white">api.example.com</p>
                <p className="text-xs text-gray-400">API <span className="text-gray-500">192.168.1.5</span></p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 text-xs font-medium bg-gray-500 text-gray-100 rounded">Önbellekli</span>
                <span className="text-xs text-gray-500">15dk önce</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
