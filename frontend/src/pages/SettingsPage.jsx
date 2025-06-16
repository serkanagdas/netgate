// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SettingsPage() {
  const [timezone, setTimezone] = useState("Europe/Istanbul");
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [backupSchedule, setBackupSchedule] = useState("Haftalık");
  const [notifications, setNotifications] = useState(true);
  const [logLevel, setLogLevel] = useState("INFO");
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState("tr");
  
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);

  // Sistem bilgileri
  const [systemInfo, setSystemInfo] = useState({
    version: "1.0.0",
    uptime: "2 gün 14 saat",
    memory: "2.4 GB / 8 GB",
    disk: "45 GB / 100 GB"
  });

  useEffect(() => {
    // Ayarları yükle (gerçek uygulamada API'den gelecek)
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Gerçek uygulamada API çağrısı yapılacak
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setLastSaved(new Date());
      alert("Ayarlar başarıyla kaydedildi!");
    } catch (error) {
      alert("Ayarlar kaydedilirken hata oluştu: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Tüm ayarları varsayılan değerlere döndürmek istediğinize emin misiniz?")) {
      setTimezone("Europe/Istanbul");
      setAutoUpdate(true);
      setBackupSchedule("Haftalık");
      setNotifications(true);
      setLogLevel("INFO");
      setSessionTimeout(60);
      setDarkMode(true);
      setLanguage("tr");
      alert("Ayarlar varsayılan değerlere döndürüldü");
    }
  };

  const formatDate = (date) => {
    return date.toLocaleString("tr-TR", { 
      timeZone: "Europe/Istanbul",
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-lg">Sistem ayarları yükleniyor...</span>
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
            <div className="p-2 bg-gray-600 rounded-lg">
              <span className="material-icons text-2xl">settings</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Sistem Ayarları</h1>
              <p className="text-gray-400 mt-1">Firewall ve sistem yapılandırma seçenekleri</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 border border-gray-600 text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <span className="material-icons">refresh</span>
              <span>Sıfırla</span>
            </button>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <span className="material-icons">save</span>
                  <span>Kaydet</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        {lastSaved && (
          <div className="mt-4 p-3 bg-green-900 border border-green-600 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="material-icons text-green-400">check_circle</span>
              <span className="text-green-200 text-sm">
                Son kaydedilme: {formatDate(lastSaved)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sol Kolon - Ana Ayarlar */}
        <div className="xl:col-span-2 space-y-6">
          {/* Genel Ayarlar */}
          <div className="bg-gray-800 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <span className="material-icons text-blue-400">tune</span>
                <h2 className="text-xl font-semibold">Genel Ayarlar</h2>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Zaman Dilimi */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <span className="material-icons mr-2 text-sm align-middle">schedule</span>
                    Zaman Dilimi
                  </label>
                  <select
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                  >
                    <option value="Europe/Istanbul">Türkiye (UTC+3)</option>
                    <option value="UTC">UTC (GMT+0)</option>
                    <option value="Europe/Berlin">Berlin (UTC+1)</option>
                    <option value="America/New_York">New York (UTC-5)</option>
                    <option value="Asia/Tokyo">Tokyo (UTC+9)</option>
                  </select>
                </div>

                {/* Dil */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <span className="material-icons mr-2 text-sm align-middle">language</span>
                    Dil
                  </label>
                  <select
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="tr">Türkçe</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>

                {/* Session Timeout */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <span className="material-icons mr-2 text-sm align-middle">timer</span>
                    Oturum Zaman Aşımı (dakika)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="480"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                  />
                  <p className="text-gray-500 text-xs mt-1">15-480 dakika arası</p>
                </div>

                {/* Log Seviyesi */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <span className="material-icons mr-2 text-sm align-middle">bug_report</span>
                    Log Seviyesi
                  </label>
                  <select
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    value={logLevel}
                    onChange={(e) => setLogLevel(e.target.value)}
                  >
                    <option value="DEBUG">Debug (Çok Detaylı)</option>
                    <option value="INFO">Info (Normal)</option>
                    <option value="WARNING">Warning (Uyarılar)</option>
                    <option value="ERROR">Error (Sadece Hatalar)</option>
                  </select>
                </div>
              </div>

              {/* Toggle Ayarları */}
              <div className="space-y-4">
                {/* Otomatik Güncelleme */}
                <div className="flex items-center justify-between p-4 bg-gray-750 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="material-icons text-green-400">system_update</span>
                    <div>
                      <h3 className="font-medium">Otomatik Güncellemeler</h3>
                      <p className="text-gray-400 text-sm">Sistem güncellemelerini otomatik yükle</p>
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

                {/* Bildirimler */}
                <div className="flex items-center justify-between p-4 bg-gray-750 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="material-icons text-yellow-400">notifications</span>
                    <div>
                      <h3 className="font-medium">Sistem Bildirimleri</h3>
                      <p className="text-gray-400 text-sm">Önemli sistem olayları için bildirim gönder</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notifications}
                      onChange={(e) => setNotifications(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Koyu Tema */}
                <div className="flex items-center justify-between p-4 bg-gray-750 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="material-icons text-purple-400">dark_mode</span>
                    <div>
                      <h3 className="font-medium">Koyu Tema</h3>
                      <p className="text-gray-400 text-sm">Arayüz için koyu tema kullan</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={darkMode}
                      onChange={(e) => setDarkMode(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Yedekleme Ayarları */}
          <div className="bg-gray-800 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <span className="material-icons text-green-400">backup</span>
                <h2 className="text-xl font-semibold">Yedekleme Ayarları</h2>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <span className="material-icons mr-2 text-sm align-middle">schedule</span>
                    Yedekleme Sıklığı
                  </label>
                  <select
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    value={backupSchedule}
                    onChange={(e) => setBackupSchedule(e.target.value)}
                  >
                    <option value="Günlük">Günlük</option>
                    <option value="Haftalık">Haftalık</option>
                    <option value="Aylık">Aylık</option>
                    <option value="Manuel">Sadece Manuel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <span className="material-icons mr-2 text-sm align-middle">folder</span>
                    Yedekleme Konumu
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-l-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      value="/opt/firewall/backups"
                      readOnly
                    />
                    <button className="bg-gray-600 hover:bg-gray-500 px-4 py-3 rounded-r-lg border border-l-0 border-gray-600 transition-colors">
                      <span className="material-icons text-sm">folder_open</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-900 border border-blue-600 rounded-lg">
                <div className="flex items-start space-x-3">
                  <span className="material-icons text-blue-400 mt-0.5">info</span>
                  <div>
                    <h4 className="font-medium text-blue-200 mb-1">Yedekleme Bilgileri</h4>
                    <ul className="text-blue-100 text-sm space-y-1">
                      <li>• Firewall kuralları ve yapılandırmaları yedeklenir</li>
                      <li>• Son 10 yedekleme dosyası otomatik olarak saklanır</li>
                      <li>• Yedeklemeler şifrelenmiş olarak depolanır</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Kolon - Sistem Bilgileri */}
        <div className="space-y-6">
          {/* Sistem Bilgileri */}
          <div className="bg-gray-800 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <span className="material-icons text-cyan-400">computer</span>
                <h2 className="text-xl font-semibold">Sistem Bilgileri</h2>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Sürüm</span>
                <span className="font-medium">{systemInfo.version}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Çalışma Süresi</span>
                <span className="font-medium">{systemInfo.uptime}</span>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Bellek Kullanımı</span>
                  <span className="font-medium">{systemInfo.memory}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '30%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Disk Kullanımı</span>
                  <span className="font-medium">{systemInfo.disk}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '45%'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Hızlı İşlemler */}
          <div className="bg-gray-800 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <span className="material-icons text-orange-400">flash_on</span>
                <h2 className="text-xl font-semibold">Hızlı İşlemler</h2>
              </div>
            </div>
            
            <div className="p-6 space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                <span className="material-icons text-blue-400">restart_alt</span>
                <span>Sistemi Yeniden Başlat</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                <span className="material-icons text-green-400">backup</span>
                <span>Manuel Yedekleme</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                <span className="material-icons text-yellow-400">download</span>
                <span>Güncellemeleri Kontrol Et</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                <span className="material-icons text-red-400">clear_all</span>
                <span>Logları Temizle</span>
              </button>
            </div>
          </div>

          {/* Güvenlik Durumu */}
          <div className="bg-gray-800 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <span className="material-icons text-green-400">security</span>
                <h2 className="text-xl font-semibold">Güvenlik Durumu</h2>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Firewall</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <span className="material-icons mr-1 text-xs">check_circle</span>
                  Aktif
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Antivirüs</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <span className="material-icons mr-1 text-xs">check_circle</span>
                  Güncel
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">SSL Sertifikası</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <span className="material-icons mr-1 text-xs">warning</span>
                  30 gün
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Son Tarama</span>
                <span className="text-sm text-gray-300">2 saat önce</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
