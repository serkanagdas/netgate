// src/pages/LogsPage.jsx
import React, { useState } from 'react';

function LogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [level, setLevel] = useState("");
  const [date, setDate] = useState("");

  // Tüm log verileri
  const allLogs = [
    { id: 1, time: "2025-02-11 09:15", ip: "192.168.1.15", level: "INFO", message: "Bağlantı Sağlandı" },
    { id: 2, time: "2025-02-11 09:17", ip: "10.0.0.25", level: "ERROR", message: "Erişim Reddedildi" },
    { id: 3, time: "2025-02-11 09:20", ip: "192.168.1.45", level: "WARN", message: "Şüpheli Aktivite Tespit Edildi" },
    { id: 4, time: "2025-02-11 09:25", ip: "172.16.0.10", level: "INFO", message: "Güvenlik Duvarı Kuralı Uygulandı" },
    { id: 5, time: "2025-02-11 09:30", ip: "10.0.0.50", level: "ERROR", message: "Port Tarama Girişimi Engellendi" },
    { id: 6, time: "2025-02-11 09:35", ip: "192.168.1.20", level: "INFO", message: "Kullanıcı Giriş Yaptu" },
    { id: 7, time: "2025-02-11 09:40", ip: "203.0.113.15", level: "ERROR", message: "DDoS Saldırısı Tespit Edildi" },
    { id: 8, time: "2025-02-11 09:45", ip: "10.0.0.100", level: "WARN", message: "Yüksek Trafik Hacmi" },
    { id: 9, time: "2025-02-11 09:50", ip: "192.168.1.30", level: "INFO", message: "Backup İşlemi Tamamlandı" },
    { id: 10, time: "2025-02-11 09:55", ip: "172.16.0.25", level: "ERROR", message: "Yetkisiz Erişim Girişimi" }
  ];

  // Filtrelenmiş logları hesapla
  const filteredLogs = allLogs.filter(log => {
    // Anahtar kelime filtresi
    const matchesSearchTerm = searchTerm === "" || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip.includes(searchTerm) ||
      log.time.includes(searchTerm);

    // Log seviyesi filtresi
    const matchesLevel = level === "" || log.level === level;

    // Tarih filtresi
    const matchesDate = date === "" || log.time.startsWith(date);

    return matchesSearchTerm && matchesLevel && matchesDate;
  });

  const handleFilter = () => {
    // Artık gerçek zamanlı filtreleme yapıldığı için bu fonksiyon isteğe bağlı
    console.log("Filtre Uygula", { searchTerm, level, date });
    console.log("Filtrelenmiş Sonuçlar:", filteredLogs.length, "adet");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setLevel("");
    setDate("");
  };
  const exportCSV = () => {
    console.log("CSV çıktı...");
  };
  const exportPDF = () => {
    console.log("PDF çıktı...");
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'INFO':
        return 'bg-blue-100 text-blue-800';
      case 'WARN':
        return 'bg-yellow-100 text-yellow-800';
      case 'ERROR':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'INFO':
        return 'info';
      case 'WARN':
        return 'warning';
      case 'ERROR':
        return 'error';
      default:
        return 'help';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Başlık */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <span className="material-icons text-3xl text-blue-400">assignment</span>
            <h1 className="text-3xl font-bold text-white">Sistem Günlükleri</h1>
          </div>
          <p className="text-gray-400">Güvenlik duvarı etkinliklerini izleyin ve analiz edin</p>
        </div>

        {/* Filtre Kartı */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <span className="material-icons mr-2">filter_list</span>
              Filtreler ve Dışa Aktarım
            </h2>
            {/* CSV ve PDF butonları sağ üst köşede */}
            <div className="flex space-x-2">
              <button 
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md transition-colors duration-200 flex items-center text-sm"
                onClick={exportCSV}
              >
                <span className="material-icons mr-1 text-sm">file_download</span>
                CSV
              </button>
              <button 
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md transition-colors duration-200 flex items-center text-sm"
                onClick={exportPDF}
              >
                <span className="material-icons mr-1 text-sm">picture_as_pdf</span>
                PDF
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">Anahtar Kelime</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="IP"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">Log Seviyesi</label>
              <select
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="">Tümü</option>
                <option value="INFO">INFO</option>
                <option value="WARN">WARN</option>
                <option value="ERROR">ERROR</option>
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">Tarih</label>
              <input
                type="date"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            
            <div className="flex items-end">
              <button 
                className="w-full bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center"
                onClick={clearFilters}
              >
                <span className="material-icons mr-2 text-sm">clear</span>
                Temizle
              </button>
            </div>
          </div>
        </div>

        {/* Log Tablosu */}
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <span className="material-icons mr-2">list</span>
              Son Etkinlikler ({filteredLogs.length} sonuç)
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Tarih/Saat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Kaynak IP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Seviye
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Mesaj
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    İşlem
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-gray-700 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div className="flex items-center">
                          <span className="material-icons mr-2 text-gray-400">schedule</span>
                          {log.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div className="flex items-center">
                          <span className="material-icons mr-2 text-gray-400">computer</span>
                          {log.ip}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                          <span className="material-icons mr-1 text-xs">{getLevelIcon(log.level)}</span>
                          {log.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                        {log.message}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors duration-200 flex items-center">
                          <span className="material-icons mr-1 text-sm">visibility</span>
                          İncele
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center">
                        <span className="material-icons text-4xl text-gray-500 mb-2">search_off</span>
                        <p className="text-gray-400 text-lg">Aramanızla eşleşen log bulunamadı</p>
                        <p className="text-gray-500 text-sm mt-1">Filtre kriterlerinizi değiştirmeyi deneyin</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sayfalama */}
        <div className="flex items-center justify-center space-x-4 mt-6">
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center">
            <span className="material-icons mr-2">chevron_left</span>
            Önceki
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-gray-300">Sayfa</span>
            <span className="bg-blue-500 text-white px-3 py-1 rounded-md">1</span>
            <span className="text-gray-300">/ 5</span>
          </div>
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center">
            Sonraki
            <span className="material-icons ml-2">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogsPage;
