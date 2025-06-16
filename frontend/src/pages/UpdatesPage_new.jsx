// src/pages/UpdatesPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UpdatesPage() {
  const [loading, setLoading] = useState(true);
  const [checkingUpdates, setCheckingUpdates] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [currentVersion, setCurrentVersion] = useState("2.1.0");
  const [latestVersion, setLatestVersion] = useState("2.1.2");
  const [lastCheck, setLastCheck] = useState("2025-06-14 10:30");
  const [autoUpdate, setAutoUpdate] = useState(true);
  
  const [updateHistory, setUpdateHistory] = useState([
    {
      id: 1,
      version: "2.1.0",
      date: "2025-06-10",
      type: "major",
      status: "installed",
      description: "Yeni güvenlik özellikleri ve performans iyileştirmeleri",
      changes: [
        "Gelişmiş DPI (Deep Packet Inspection) desteği",
        "Yeni anti-malware motoru",
        "VPN bağlantı kararlılığı iyileştirmeleri",
        "Arayüz performans optimizasyonları"
      ]
    },
    {
      id: 2,
      version: "2.0.5",
      date: "2025-05-28",
      type: "patch",
      status: "installed",
      description: "Kritik güvenlik yaması ve hata düzeltmeleri",
      changes: [
        "CVE-2025-1234 güvenlik açığı kapatıldı",
        "DNS çözümleme hataları düzeltildi",
        "Log rotasyon sorunu çözüldü"
      ]
    },
    {
      id: 3,
      version: "2.0.4",
      date: "2025-05-15",
      type: "minor",
      status: "installed",
      description: "Özellik güncellemeleri ve stabilite iyileştirmeleri",
      changes: [
        "Yeni raporlama modülü eklendi",
        "IPv6 desteği geliştirildi",
        "Kullanıcı arayüzü iyileştirmeleri"
      ]
    }
  ]);

  const [availableUpdates, setAvailableUpdates] = useState([
    {
      id: 1,
      version: "2.1.2",
      type: "patch",
      size: "45 MB",
      priority: "yüksek",
      description: "Kritik güvenlik güncellemesi",
      releaseDate: "2025-06-13",
      changes: [
        "Yeni keşfedilen güvenlik açığı kapatıldı",
        "Firewall kuralları işleme hızı artırıldı",
        "Bellek kullanımı optimize edildi"
      ]
    },
    {
      id: 2,
      version: "2.1.1",
      type: "patch",
      size: "23 MB",
      priority: "orta",
      description: "Hata düzeltmeleri ve iyileştirmeler",
      releaseDate: "2025-06-12",
      changes: [
        "VPN bağlantı kesinti sorunu düzeltildi",
        "Log görüntüleme performansı iyileştirildi",
        "Küçük arayüz hataları giderildi"
      ]
    }
  ]);

  useEffect(() => {
    // Güncelleme verilerini yükle
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleCheckUpdates = async () => {
    setCheckingUpdates(true);
    try {
      // API çağrısı simülasyonu
      await new Promise(resolve => setTimeout(resolve, 3000));
      setLastCheck(new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" }));
      alert("Güncelleme kontrolü tamamlandı!");
    } catch (error) {
      alert("Güncelleme kontrolü sırasında hata: " + error.message);
    } finally {
      setCheckingUpdates(false);
    }
  };

  const handleInstallUpdate = async (update) => {
    if (!window.confirm(`${update.version} sürümünü yüklemek istediğinize emin misiniz? Bu işlem sistem yeniden başlatması gerektirebilir.`)) {
      return;
    }

    setInstalling(true);
    try {
      // Güncelleme yükleme simülasyonu
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      // Başarılı güncelleme sonrası
      setCurrentVersion(update.version);
      setAvailableUpdates(prev => prev.filter(u => u.id !== update.id));
      setUpdateHistory(prev => [
        {
          ...update,
          status: "installed",
          date: new Date().toLocaleDateString("tr-TR")
        },
        ...prev
      ]);
      
      alert("Güncelleme başarıyla yüklendi! Sistem yeniden başlatılacak.");
    } catch (error) {
      alert("Güncelleme yüklenirken hata: " + error.message);
    } finally {
      setInstalling(false);
    }
  };

  const getUpdateTypeColor = (type) => {
    switch (type) {
      case 'major': return 'blue';
      case 'minor': return 'green';
      case 'patch': return 'yellow';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'yüksek': return 'red';
      case 'orta': return 'yellow';
      case 'düşük': return 'green';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-lg">Güncelleme bilgileri yükleniyor...</span>
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
            <div className="p-2 bg-blue-600 rounded-lg">
              <span className="material-icons text-2xl">system_update</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Sistem Güncellemeleri</h1>
              <p className="text-gray-400 mt-1">Firewall ve sistem güncellemelerini yönetin</p>
            </div>
          </div>
          
          <button
            onClick={handleCheckUpdates}
            disabled={checkingUpdates}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {checkingUpdates ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Kontrol Ediliyor...</span>
              </>
            ) : (
              <>
                <span className="material-icons">refresh</span>
                <span>Güncelleme Kontrol Et</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sistem Durumu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Mevcut Sürüm</p>
              <p className="text-2xl font-bold text-white">{currentVersion}</p>
              <p className="text-green-400 text-sm">Güncell</p>
            </div>
            <div className="p-3 bg-green-600 rounded-lg">
              <span className="material-icons text-white">verified</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Son Kontrol</p>
              <p className="text-lg font-bold text-white">{lastCheck}</p>
              <p className="text-blue-400 text-sm">Otomatik</p>
            </div>
            <div className="p-3 bg-blue-600 rounded-lg">
              <span className="material-icons text-white">schedule</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Bekleyen Güncellemeler</p>
              <p className="text-2xl font-bold text-white">{availableUpdates.length}</p>
              <p className="text-yellow-400 text-sm">Yükleme bekleniyor</p>
            </div>
            <div className="p-3 bg-yellow-600 rounded-lg">
              <span className="material-icons text-white">pending</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Otomatik Güncelleme</p>
              <p className="text-lg font-bold text-white">{autoUpdate ? "Açık" : "Kapalı"}</p>
              <p className={`text-sm ${autoUpdate ? "text-green-400" : "text-red-400"}`}>
                {autoUpdate ? "Etkin" : "Pasif"}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${autoUpdate ? "bg-green-600" : "bg-red-600"}`}>
              <span className="material-icons text-white">
                {autoUpdate ? "auto_mode" : "do_not_disturb"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sol Kolon - Mevcut Güncellemeler */}
        <div className="xl:col-span-2 space-y-6">
          {/* Mevcut Güncellemeler */}
          {availableUpdates.length > 0 && (
            <div className="bg-gray-800 rounded-xl shadow-lg">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <span className="material-icons text-yellow-400">new_releases</span>
                  <h2 className="text-xl font-semibold">Mevcut Güncellemeler</h2>
                  <span className="bg-yellow-600 text-white px-2 py-1 rounded-full text-sm">
                    {availableUpdates.length} adet
                  </span>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {availableUpdates.map(update => (
                  <div key={update.id} className="bg-gray-750 rounded-lg p-6 border border-gray-600">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            NetGate Firewall {update.version}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getUpdateTypeColor(update.type)}-100 text-${getUpdateTypeColor(update.type)}-800`}>
                            {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getPriorityColor(update.priority)}-100 text-${getPriorityColor(update.priority)}-800`}>
                            <span className="material-icons mr-1 text-xs">priority_high</span>
                            {update.priority.charAt(0).toUpperCase() + update.priority.slice(1)} Öncelik
                          </span>
                        </div>
                        <p className="text-gray-300 mb-3">{update.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <span className="material-icons text-sm">calendar_today</span>
                            <span>{update.releaseDate}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="material-icons text-sm">file_download</span>
                            <span>{update.size}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleInstallUpdate(update)}
                        disabled={installing}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-lg font-medium transition-colors ml-4"
                      >
                        {installing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Yükleniyor...</span>
                          </>
                        ) : (
                          <>
                            <span className="material-icons">download</span>
                            <span>Yükle</span>
                          </>
                        )}
                      </button>
                    </div>
                    
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-200 mb-2">Değişiklikler:</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {update.changes.map((change, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="material-icons text-green-400 text-sm mt-0.5">check</span>
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Güncelleme Geçmişi */}
          <div className="bg-gray-800 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <span className="material-icons text-green-400">history</span>
                <h2 className="text-xl font-semibold">Güncelleme Geçmişi</h2>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {updateHistory.map(update => (
                  <div key={update.id} className="flex items-start space-x-4 p-4 bg-gray-750 rounded-lg">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <span className="material-icons text-white">check_circle</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className="font-medium text-white">NetGate Firewall {update.version}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getUpdateTypeColor(update.type)}-100 text-${getUpdateTypeColor(update.type)}-800`}>
                          {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{update.description}</p>
                      <div className="text-gray-400 text-xs">
                        <span className="material-icons text-xs align-middle mr-1">schedule</span>
                        {update.date} tarihinde yüklendi
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Kolon - Ayarlar ve Bilgiler */}
        <div className="space-y-6">
          {/* Güncelleme Ayarları */}
          <div className="bg-gray-800 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <span className="material-icons text-purple-400">settings</span>
                <h2 className="text-xl font-semibold">Güncelleme Ayarları</h2>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Otomatik Güncelleme */}
              <div className="flex items-center justify-between p-4 bg-gray-750 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="material-icons text-blue-400">auto_mode</span>
                  <div>
                    <h3 className="font-medium">Otomatik Güncelleme</h3>
                    <p className="text-gray-400 text-sm">Güncellemeleri otomatik yükle</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={autoUpdate}
                    onChange={(e) => setAutoUpdate(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Güncelleme Kontrol Sıklığı */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Kontrol Sıklığı
                </label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors">
                  <option>Günlük</option>
                  <option>Haftalık</option>
                  <option>Aylık</option>
                  <option>Manuel</option>
                </select>
              </div>

              {/* Yükleme Zamanı */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Otomatik Yükleme Saati
                </label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors">
                  <option>02:00 (Gece)</option>
                  <option>06:00 (Sabah)</option>
                  <option>12:00 (Öğle)</option>
                  <option>18:00 (Akşam)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sistem Bilgileri */}
          <div className="bg-gray-800 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <span className="material-icons text-cyan-400">info</span>
                <h2 className="text-xl font-semibold">Sistem Bilgileri</h2>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Ürün</span>
                <span className="font-medium">NetGate Firewall</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Mevcut Sürüm</span>
                <span className="font-medium">{currentVersion}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Son Sürüm</span>
                <span className="font-medium text-green-400">{latestVersion}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Derleme Tarihi</span>
                <span className="font-medium">2025-06-10</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Lisans</span>
                <span className="font-medium text-green-400">Pro</span>
              </div>
            </div>
          </div>

          {/* Güncelleme Bilgilendirmesi */}
          <div className="bg-gray-800 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <span className="material-icons text-yellow-400">lightbulb</span>
                <h2 className="text-xl font-semibold">Önemli Notlar</h2>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex items-start space-x-2">
                  <span className="material-icons text-blue-400 text-sm mt-0.5">info</span>
                  <span>Güncellemeler sistem yeniden başlatması gerektirebilir</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="material-icons text-green-400 text-sm mt-0.5">backup</span>
                  <span>Güncelleme öncesi otomatik yedekleme yapılır</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="material-icons text-yellow-400 text-sm mt-0.5">schedule</span>
                  <span>Kritik güncellemeler hemen yüklenir</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="material-icons text-red-400 text-sm mt-0.5">warning</span>
                  <span>Güncelleme sırasında internet bağlantısı kesilmesin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Güncelleme Durumu Modal Simülasyonu */}
      {installing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="p-4 bg-blue-600 rounded-full w-16 h-16 mx-auto mb-4">
                <span className="material-icons text-white text-2xl">system_update</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Güncelleme Yükleniyor</h3>
              <p className="text-gray-400 mb-6">Lütfen bekleyin, güncelleme yükleniyor...</p>
              
              <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span>Dosyalar indiriliyor ve kuruluyor...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdatesPage;
