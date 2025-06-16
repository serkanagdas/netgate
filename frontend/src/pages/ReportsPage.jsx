// src/pages/ReportsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    trafficStats: {
      totalTraffic: "2.4 TB",
      blockedRequests: "1,247",
      allowedRequests: "8,653",
      topBlockedDomains: ["ads.example.com", "tracker.malware.net", "suspicious.site"]
    },
    securityStats: {
      attackAttempts: "34",
      blockedIPs: "12",
      malwareDetections: "7",
      suspiciousActivities: "89"
    },
    systemStats: {
      uptime: "15 gün 6 saat",
      memoryUsage: "68%",
      diskUsage: "42%",
      activeConnections: "1,453"
    }
  });

  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  const [reportType, setReportType] = useState("security");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    // Rapor verilerini yükle
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  const handleGenerateReport = async (format) => {
    setGenerating(true);
    try {
      // Gerçek uygulamada API çağrısı yapılacak
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Dosya indirme simülasyonu
      const filename = `firewall-report-${selectedPeriod}.${format}`;
      alert(`${format.toUpperCase()} raporu başarıyla oluşturuldu: ${filename}`);
    } catch (error) {
      alert("Rapor oluşturulurken hata: " + error.message);
    } finally {
      setGenerating(false);
    }
  };

  const periodOptions = [
    { value: "7days", label: "Son 7 Gün" },
    { value: "30days", label: "Son 30 Gün" },
    { value: "90days", label: "Son 3 Ay" },
    { value: "1year", label: "Son 1 Yıl" }
  ];

  const reportTypes = [
    { value: "security", label: "Güvenlik Raporu", icon: "security", color: "red" },
    { value: "traffic", label: "Trafik Raporu", icon: "trending_up", color: "blue" },
    { value: "system", label: "Sistem Raporu", icon: "computer", color: "green" },
    { value: "blocked", label: "Engellemeler", icon: "block", color: "orange" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-lg">Rapor verileri yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <span className="material-icons text-2xl">assessment</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Sistem Raporları</h1>
              <p className="text-gray-400 mt-1">Firewall etkinliği, güvenlik istatistikleri ve sistem performansı</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              {periodOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Toplam Trafik */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Toplam Trafik</p>
              <p className="text-2xl font-bold text-white">{reportData.trafficStats.totalTraffic}</p>
              <p className="text-green-400 text-sm">+12% bu ay</p>
            </div>
            <div className="p-3 bg-blue-600 rounded-lg">
              <span className="material-icons text-white">cloud_download</span>
            </div>
          </div>
        </div>

        {/* Saldırı Denemeleri */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Saldırı Denemeleri</p>
              <p className="text-2xl font-bold text-white">{reportData.securityStats.attackAttempts}</p>
              <p className="text-red-400 text-sm">-8% bu ay</p>
            </div>
            <div className="p-3 bg-red-600 rounded-lg">
              <span className="material-icons text-white">security</span>
            </div>
          </div>
        </div>

        {/* Engellenen İstekler */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Engellenen İstekler</p>
              <p className="text-2xl font-bold text-white">{reportData.trafficStats.blockedRequests}</p>
              <p className="text-yellow-400 text-sm">+3% bu ay</p>
            </div>
            <div className="p-3 bg-orange-600 rounded-lg">
              <span className="material-icons text-white">block</span>
            </div>
          </div>
        </div>

        {/* Sistem Çalışma Süresi */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Sistem Çalışma Süresi</p>
              <p className="text-2xl font-bold text-white">{reportData.systemStats.uptime}</p>
              <p className="text-green-400 text-sm">99.8% uptime</p>
            </div>
            <div className="p-3 bg-green-600 rounded-lg">
              <span className="material-icons text-white">timer</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sol Kolon - Rapor Türleri */}
        <div className="xl:col-span-2 space-y-6">
          {/* Rapor Türü Seçimi */}
          <div className="bg-gray-800 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <span className="material-icons text-indigo-400">folder_special</span>
                <h2 className="text-xl font-semibold">Rapor Türleri</h2>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTypes.map(type => (
                  <div
                    key={type.value}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      reportType === type.value
                        ? `border-${type.color}-500 bg-${type.color}-900 bg-opacity-20`
                        : "border-gray-600 bg-gray-750 hover:border-gray-500"
                    }`}
                    onClick={() => setReportType(type.value)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 bg-${type.color}-600 rounded-lg`}>
                        <span className="material-icons text-white">{type.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{type.label}</h3>
                        <p className="text-gray-400 text-sm">
                          {type.value === 'security' && 'Güvenlik olayları ve saldırı denemeleri'}
                          {type.value === 'traffic' && 'Ağ trafiği ve bant genişliği kullanımı'}
                          {type.value === 'system' && 'Sistem performansı ve kaynak kullanımı'}
                          {type.value === 'blocked' && 'Engellenen domainler ve IP adresleri'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detaylı Rapor İçeriği */}
          <div className="bg-gray-800 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <span className="material-icons text-blue-400">analytics</span>
                <h2 className="text-xl font-semibold">
                  {reportTypes.find(t => t.value === reportType)?.label || 'Rapor Detayları'}
                </h2>
              </div>
            </div>
            
            <div className="p-6">
              {reportType === 'security' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-red-900 bg-opacity-20 border border-red-600 rounded-lg p-4">
                      <h4 className="font-medium text-red-200 mb-2">Saldırı Denemeleri</h4>
                      <p className="text-2xl font-bold text-red-400">{reportData.securityStats.attackAttempts}</p>
                      <p className="text-red-300 text-sm">SQL injection, XSS, brute force</p>
                    </div>
                    <div className="bg-orange-900 bg-opacity-20 border border-orange-600 rounded-lg p-4">
                      <h4 className="font-medium text-orange-200 mb-2">Engellenen IP'ler</h4>
                      <p className="text-2xl font-bold text-orange-400">{reportData.securityStats.blockedIPs}</p>
                      <p className="text-orange-300 text-sm">Otomatik engelleme sistemi</p>
                    </div>
                  </div>
                  <div className="bg-gray-750 rounded-lg p-4">
                    <h4 className="font-medium mb-3">En Çok Saldırı Alan Portlar</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>22 (SSH)</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-600 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{width: '80%'}}></div>
                          </div>
                          <span className="text-sm text-gray-400">156 deneme</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>80 (HTTP)</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-600 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{width: '60%'}}></div>
                          </div>
                          <span className="text-sm text-gray-400">89 deneme</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>443 (HTTPS)</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-600 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{width: '40%'}}></div>
                          </div>
                          <span className="text-sm text-gray-400">34 deneme</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {reportType === 'traffic' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-900 bg-opacity-20 border border-blue-600 rounded-lg p-4">
                      <h4 className="font-medium text-blue-200 mb-2">Gelen Trafik</h4>
                      <p className="text-2xl font-bold text-blue-400">1.8 TB</p>
                    </div>
                    <div className="bg-green-900 bg-opacity-20 border border-green-600 rounded-lg p-4">
                      <h4 className="font-medium text-green-200 mb-2">Giden Trafik</h4>
                      <p className="text-2xl font-bold text-green-400">0.6 TB</p>
                    </div>
                    <div className="bg-purple-900 bg-opacity-20 border border-purple-600 rounded-lg p-4">
                      <h4 className="font-medium text-purple-200 mb-2">Pik Kullanım</h4>
                      <p className="text-2xl font-bold text-purple-400">45 Mbps</p>
                    </div>
                  </div>
                  <div className="bg-gray-750 rounded-lg p-4">
                    <h4 className="font-medium mb-3">En Çok Trafik Oluşturan Protokoller</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>HTTPS</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-600 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{width: '75%'}}></div>
                          </div>
                          <span className="text-sm text-gray-400">75%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>HTTP</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-600 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{width: '15%'}}></div>
                          </div>
                          <span className="text-sm text-gray-400">15%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Other</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-600 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{width: '10%'}}></div>
                          </div>
                          <span className="text-sm text-gray-400">10%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {reportType === 'system' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-900 bg-opacity-20 border border-green-600 rounded-lg p-4">
                      <h4 className="font-medium text-green-200 mb-2">Bellek Kullanımı</h4>
                      <p className="text-2xl font-bold text-green-400">{reportData.systemStats.memoryUsage}</p>
                      <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '68%'}}></div>
                      </div>
                    </div>
                    <div className="bg-blue-900 bg-opacity-20 border border-blue-600 rounded-lg p-4">
                      <h4 className="font-medium text-blue-200 mb-2">Disk Kullanımı</h4>
                      <p className="text-2xl font-bold text-blue-400">{reportData.systemStats.diskUsage}</p>
                      <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '42%'}}></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-750 rounded-lg p-4">
                    <h4 className="font-medium mb-3">Sistem Performansı</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>CPU Kullanımı</span>
                        <span className="text-green-400 font-medium">23%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Aktif Bağlantılar</span>
                        <span className="text-blue-400 font-medium">{reportData.systemStats.activeConnections}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Ortalama Yanıt Süresi</span>
                        <span className="text-purple-400 font-medium">12ms</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {reportType === 'blocked' && (
                <div className="space-y-6">
                  <div className="bg-gray-750 rounded-lg p-4">
                    <h4 className="font-medium mb-3">En Çok Engellenen Domainler</h4>
                    <div className="space-y-2">
                      {reportData.trafficStats.topBlockedDomains.map((domain, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                          <span className="font-mono text-sm">{domain}</span>
                          <span className="text-red-400 text-sm">{Math.floor(Math.random() * 500) + 100} engelleme</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-red-900 bg-opacity-20 border border-red-600 rounded-lg p-4">
                      <h4 className="font-medium text-red-200 mb-2">DNS Engellemeleri</h4>
                      <p className="text-2xl font-bold text-red-400">1,247</p>
                      <p className="text-red-300 text-sm">Zararlı domainler</p>
                    </div>
                    <div className="bg-orange-900 bg-opacity-20 border border-orange-600 rounded-lg p-4">
                      <h4 className="font-medium text-orange-200 mb-2">IP Engellemeleri</h4>
                      <p className="text-2xl font-bold text-orange-400">89</p>
                      <p className="text-orange-300 text-sm">Kara liste IP'leri</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sağ Kolon - Rapor Dışa Aktarımı */}
        <div className="space-y-6">
          {/* Dışa Aktarım */}
          <div className="bg-gray-800 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <span className="material-icons text-green-400">file_download</span>
                <h2 className="text-xl font-semibold">Rapor Dışa Aktarımı</h2>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Rapor Formatı</label>
                <div className="space-y-2">
                  <button
                    onClick={() => handleGenerateReport('pdf')}
                    disabled={generating}
                    className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-4 py-3 rounded-lg font-medium transition-colors"
                  >
                    <span className="material-icons">picture_as_pdf</span>
                    <span>PDF Raporu</span>
                  </button>
                  
                  <button
                    onClick={() => handleGenerateReport('csv')}
                    disabled={generating}
                    className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-3 rounded-lg font-medium transition-colors"
                  >
                    <span className="material-icons">table_view</span>
                    <span>CSV Verileri</span>
                  </button>
                  
                  <button
                    onClick={() => handleGenerateReport('json')}
                    disabled={generating}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-3 rounded-lg font-medium transition-colors"
                  >
                    <span className="material-icons">data_object</span>
                    <span>JSON Verileri</span>
                  </button>
                </div>
              </div>
              
              {generating && (
                <div className="p-3 bg-blue-900 border border-blue-600 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                    <span className="text-blue-200 text-sm">Rapor oluşturuluyor...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Hızlı İstatistikler */}
          <div className="bg-gray-800 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <span className="material-icons text-purple-400">speed</span>
                <h2 className="text-xl font-semibold">Hızlı İstatistikler</h2>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Günlük Ortalama Trafik</span>
                <span className="font-medium">80 GB</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">En Yoğun Saat</span>
                <span className="font-medium">14:00-15:00</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Ortalama Yanıt Süresi</span>
                <span className="font-medium">12ms</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Başarı Oranı</span>
                <span className="font-medium text-green-400">99.2%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Güvenlik Skoru</span>
                <span className="font-medium text-blue-400">8.7/10</span>
              </div>
            </div>
          </div>

          {/* Son Güncelleme */}
          <div className="bg-gray-800 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <span className="material-icons text-yellow-400">update</span>
                <h2 className="text-xl font-semibold">Veri Güncellemesi</h2>
              </div>
            </div>
            
            <div className="p-6">
              <div className="text-center space-y-3">
                <div className="text-gray-400 text-sm">Son güncelleme</div>
                <div className="text-white font-medium">
                  {new Date().toLocaleString("tr-TR", { 
                    timeZone: "Europe/Istanbul",
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </div>
                <button
                  className="w-full flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium transition-colors"
                  onClick={() => window.location.reload()}
                >
                  <span className="material-icons text-sm">refresh</span>
                  <span>Verileri Yenile</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;
