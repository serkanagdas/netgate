// src/pages/StaticRoutesPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

function StaticRoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form inputlar
  const [destination, setDestination] = useState("");
  const [mask, setMask] = useState("");
  const [gateway, setGateway] = useState("");
  const [selectedInterface, setSelectedInterface] = useState("");
  const [metric, setMetric] = useState("1");
  const [enabled, setEnabled] = useState(true);

  // Arayüz dropdown için
  const [interfaces, setInterfaces] = useState([]);

  useEffect(() => {
    fetchRoutes();
    fetchInterfaces();
  }, []);

  // 1) Mevcut rotaları çek
  const fetchRoutes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:8000/routes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoutes(res.data);
    } catch (err) {
      alert("Rota listesi alınamadı: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  // 2) Arayüz listesi
  const fetchInterfaces = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:8000/network/interfaces", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInterfaces(res.data.map((inf) => inf.interface_name));
    } catch (err) {
      alert("Arayüz listesi alınamadı: " + (err.response?.data?.detail || err.message));
    }
  };

  // 3) Yeni rota ekle
  const handleAddRoute = async (e) => {
    e.preventDefault();
    if (!destination || !mask || !gateway || !selectedInterface) {
      alert("Tüm alanları doldurmalısınız!");
      return;
    }
    
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const body = {
        destination,
        mask,
        gateway,
        interface_name: selectedInterface,
        metric: Number(metric),
        enabled
      };
      const res = await axios.post("http://127.0.0.1:8000/routes", body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(res.data.message || "Rota eklendi.");
      
      // Form temizle
      setDestination("");
      setMask("");
      setGateway("");
      setSelectedInterface("");
      setMetric("1");
      setEnabled(true);
      setShowForm(false);
      
      fetchRoutes(); // tabloyu güncelle
    } catch (err) {
      alert("Rota ekleme hatası: " + (err.response?.data?.detail || err.message));
    } finally {
      setSaving(false);
    }
  };

  // 4) Rota sil
  const handleDeleteRoute = async (routeId) => {
    if (!window.confirm("Bu rotayı silmek istediğinize emin misiniz?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/routes/${routeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Rota silindi.");
      fetchRoutes();
    } catch (err) {
      alert("Rota silme hatası: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleNewRoute = () => {
    setDestination("");
    setMask("");
    setGateway("");
    setSelectedInterface("");
    setMetric("1");
    setEnabled(true);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setDestination("");
    setMask("");
    setGateway("");
    setSelectedInterface("");
    setMetric("1");
    setEnabled(true);
  };

  // IP validation
  const isValidIP = (ip) => {
    const ipRegex = /^((25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(25[0-5]|2[0-4]\d|[01]?\d?\d)$/;
    return ipRegex.test(ip);
  };

  const isValidMask = (mask) => {
    const maskRegex = /^((255|254|252|248|240|224|192|128|0)\.){3}(255|254|252|248|240|224|192|128|0)$/;
    return maskRegex.test(mask);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-lg">Statik rotalar yükleniyor...</span>
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
            <div className="p-2 bg-purple-600 rounded-lg">
              <span className="material-icons text-2xl">alt_route</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Statik Rotalar</h1>
              <p className="text-gray-400 mt-1">Ağ yönlendirme tablosu yönetimi ve statik rota yapılandırması</p>
            </div>
          </div>
          <button
            onClick={handleNewRoute}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <span className="material-icons">add</span>
            <span>Yeni Rota</span>
          </button>
        </div>
      </div>

      {/* Rotalar Listesi */}
      <div className="bg-gray-800 rounded-xl shadow-lg mb-6">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="material-icons text-purple-400">route</span>
            <h2 className="text-xl font-semibold">Mevcut Statik Rotalar</h2>
            <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-sm">
              {routes.length} adet
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {routes.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-icons text-6xl text-gray-600 mb-4 block">route</span>
              <h3 className="text-xl font-medium text-gray-400 mb-2">Henüz statik rota yok</h3>
              <p className="text-gray-500 mb-6">İlk statik rotanızı oluşturmak için yukarıdaki butonu kullanın</p>
              <button
                onClick={handleNewRoute}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                İlk Rotayı Oluştur
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 font-medium text-gray-300">Hedef Ağ</th>
                  <th className="text-left p-4 font-medium text-gray-300">Alt Ağ Maskesi</th>
                  <th className="text-left p-4 font-medium text-gray-300">Ağ Geçidi</th>
                  <th className="text-left p-4 font-medium text-gray-300">Arayüz</th>
                  <th className="text-left p-4 font-medium text-gray-300">Metrik</th>
                  <th className="text-left p-4 font-medium text-gray-300">Durum</th>
                  <th className="text-left p-4 font-medium text-gray-300">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((rt) => (
                  <tr key={rt._id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-700 rounded-lg">
                          <span className="material-icons text-purple-400">my_location</span>
                        </div>
                        <div>
                          <div className="font-medium text-white font-mono">{rt.destination}</div>
                          <div className="text-sm text-gray-400">Hedef ağ adresi</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300 font-mono text-sm">
                      {rt.mask}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <span className="material-icons text-blue-400 text-sm">router</span>
                        <span className="text-gray-300 font-mono text-sm">{rt.gateway}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <span className="material-icons mr-1 text-xs">ethernet</span>
                        {rt.interface_name}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <span className="material-icons mr-1 text-xs">speed</span>
                        {rt.metric}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        rt.enabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        <span className="material-icons mr-1 text-xs">
                          {rt.enabled ? "check_circle" : "cancel"}
                        </span>
                        {rt.enabled ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDeleteRoute(rt._id)}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                        title="Rotayı Sil"
                      >
                        <span className="material-icons text-sm">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <span className="material-icons">add</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Yeni Statik Rota Ekle</h2>
                    <p className="text-gray-400 text-sm">
                      Yeni ağ yönlendirme kuralı oluşturun
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCancelForm}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <span className="material-icons">close</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleAddRoute} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hedef Ağ */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <span className="material-icons mr-2 text-sm align-middle">my_location</span>
                    Hedef Ağ Adresi
                  </label>
                  <input
                    type="text"
                    className={`w-full bg-gray-700 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-1 transition-colors ${
                      destination && !isValidIP(destination) 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                        : "border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="192.168.50.0"
                    required
                  />
                  {destination && !isValidIP(destination) && (
                    <p className="text-red-400 text-sm mt-1">Geçersiz IP adresi formatı</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">Ulaşmak istediğiniz ağın IP adresi</p>
                </div>

                {/* Alt Ağ Maskesi */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <span className="material-icons mr-2 text-sm align-middle">crop_free</span>
                    Alt Ağ Maskesi
                  </label>
                  <input
                    type="text"
                    className={`w-full bg-gray-700 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-1 transition-colors ${
                      mask && !isValidMask(mask) 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                        : "border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    value={mask}
                    onChange={(e) => setMask(e.target.value)}
                    placeholder="255.255.255.0"
                    required
                  />
                  {mask && !isValidMask(mask) && (
                    <p className="text-red-400 text-sm mt-1">Geçersiz subnet mask formatı</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">Hedef ağın alt ağ maskesi</p>
                </div>

                {/* Ağ Geçidi */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <span className="material-icons mr-2 text-sm align-middle">router</span>
                    Ağ Geçidi
                  </label>
                  <input
                    type="text"
                    className={`w-full bg-gray-700 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-1 transition-colors ${
                      gateway && !isValidIP(gateway) 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                        : "border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    value={gateway}
                    onChange={(e) => setGateway(e.target.value)}
                    placeholder="192.168.1.1"
                    required
                  />
                  {gateway && !isValidIP(gateway) && (
                    <p className="text-red-400 text-sm mt-1">Geçersiz gateway IP adresi</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">Trafiği yönlendirecek ağ geçidi</p>
                </div>

                {/* Arayüz */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <span className="material-icons mr-2 text-sm align-middle">ethernet</span>
                    Ağ Arayüzü
                  </label>
                  <select
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    value={selectedInterface}
                    onChange={(e) => setSelectedInterface(e.target.value)}
                    required
                  >
                    <option value="">Arayüz seçiniz</option>
                    {interfaces.map((inf) => (
                      <option key={inf} value={inf}>
                        {inf}
                      </option>
                    ))}
                  </select>
                  <p className="text-gray-500 text-xs mt-1">Trafiğin çıkacağı ağ arayüzü</p>
                </div>

                {/* Metrik */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <span className="material-icons mr-2 text-sm align-middle">speed</span>
                    Metrik (Öncelik)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    value={metric}
                    onChange={(e) => setMetric(e.target.value)}
                    min="1"
                    max="9999"
                    placeholder="1"
                  />
                  <p className="text-gray-500 text-xs mt-1">Düşük değer = Yüksek öncelik (1-9999)</p>
                </div>

                {/* Durum */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="routeEnabled"
                    className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                  />
                  <label htmlFor="routeEnabled" className="text-sm font-medium text-gray-300 flex items-center">
                    <span className="material-icons mr-2 text-sm">power_settings_new</span>
                    Rota Etkinleştir
                  </label>
                </div>
              </div>

              {/* Uyarı */}
              <div className="mt-6 bg-yellow-900 border border-yellow-600 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <span className="material-icons text-yellow-400 mt-0.5">info</span>
                  <div>
                    <h4 className="font-medium text-yellow-200 mb-2">Statik Rota Bilgilendirmesi</h4>
                    <ul className="text-yellow-100 text-sm space-y-1">
                      <li>• Statik rotalar sistem yeniden başlatıldığında kalıcıdır</li>
                      <li>• Metrik değeri ne kadar düşükse o rota o kadar önceliklidir</li>
                      <li>• Ağ geçidi ile aynı ağda olan bir arayüz seçin</li>
                      <li>• Mevcut rotalarla çakışmadığından emin olun</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Butonlar */}
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={saving || !destination || !mask || !gateway || !selectedInterface}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Ekleniyor...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-icons text-sm">save</span>
                      <span>Rota Ekle</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Yardım Kartı */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <span className="material-icons text-purple-400">help_outline</span>
          <h3 className="text-lg font-semibold">Statik Rotalar Hakkında</h3>
        </div>
        <div className="text-gray-400 text-sm space-y-2">
          <p>
            <strong>Statik rotalar</strong>, belirli ağ trafiğinin hangi yol üzerinden gönderileceğini manuel olarak belirlemek için kullanılır.
          </p>
          <p>
            <strong>Kullanım Alanları:</strong> Farklı ağ segmentleri arasında bağlantı kurmak, VPN trafiğini yönlendirmek, 
            belirli servislere özel yollar tanımlamak için kullanılır.
          </p>
          <p>
            <strong>Metrik:</strong> Aynı hedefe birden fazla rota varsa, düşük metrik değerine sahip rota tercih edilir.
          </p>
          <p>
            <strong>Dikkat:</strong> Yanlış yapılandırılmış statik rotalar ağ bağlantısını kesebilir. Değişiklik yapmadan önce 
            mevcut ağ yapınızı iyi analiz edin.
          </p>
        </div>
      </div>
    </div>
  );
}

export default StaticRoutesPage;
