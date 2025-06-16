// File: src/pages/NatSettingsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

function NatSettingsPage() {
  const [interfaces, setInterfaces] = useState([]);
  const [wanInterface, setWanInterface] = useState("");
  const [lanInterface, setLanInterface] = useState("");
  const [natEnabled, setNatEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInterfaces();
    fetchNatStatus();
  }, []);

  // 1) /network/interfaces -> Arayüz listesini çek
  const fetchInterfaces = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:8000/network/interfaces", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInterfaces(res.data);
    } catch (err) {
      console.error("Arayüzleri çekerken hata:", err);
      alert("Arayüz listesini alırken hata oluştu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2) /nat -> Mevcut NAT durumunu çek
  const fetchNatStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:8000/nat", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) {
        setNatEnabled(res.data.enabled);
        setWanInterface(res.data.wan || "");
        setLanInterface(res.data.lan || "");
      }
    } catch (err) {
      console.log("NAT durumu alınamadı:", err.message);
    }
  };

  // 3) Kaydet (PATCH /nat)
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    // NAT etkinleştiriliyorsa WAN ve LAN farklı olmak zorunda
    if (natEnabled) {
      if (!wanInterface || !lanInterface) {
        alert("NAT açmak için WAN ve LAN arayüzlerini seçmelisiniz!");
        setSaving(false);
        return;
      }
      if (wanInterface === lanInterface) {
        alert("WAN ve LAN aynı arayüz olamaz!");
        setSaving(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const body = {
        enabled: natEnabled,
        wan: wanInterface,
        lan: lanInterface
      };
      const res = await axios.patch("http://127.0.0.1:8000/nat", body, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("NAT ayarı güncellendi. " + (res.data.message || ""));
    } catch (err) {
      console.error("NAT kaydetme hatası:", err);
      const msg = err.response?.data?.detail || err.message;
      alert("NAT ayarı kaydedilemedi: " + msg);
    } finally {
      setSaving(false);
    }
  };

  const getInterfaceDetails = (interfaceName) => {
    const iface = interfaces.find(i => i.interface_name === interfaceName);
    if (!iface) return null;
    return {
      ip: iface.ip_address || "DHCP",
      status: iface.admin_enabled ? "Etkin" : "Pasif",
      link: iface.link_state === "up" ? "Bağlı" : "Kopuk"
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-lg">NAT ayarları yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-600 rounded-lg">
            <span className="material-icons text-2xl">share</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">NAT Ayarları</h1>
            <p className="text-gray-400 mt-1">Ağ Adresi Çevirisi (Network Address Translation) yapılandırması</p>
          </div>
        </div>
      </div>

      {/* Ana Kart */}
      <div className="bg-gray-800 rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="material-icons text-green-400">router</span>
              <h2 className="text-xl font-semibold">Internet Bağlantı Paylaşımı (ICS)</h2>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              natEnabled 
                ? "bg-green-100 text-green-800" 
                : "bg-gray-100 text-gray-800"
            }`}>
              <span className="material-icons mr-1 text-sm align-middle">
                {natEnabled ? "check_circle" : "radio_button_unchecked"}
              </span>
              {natEnabled ? "Etkin" : "Pasif"}
            </div>
          </div>
          <p className="text-gray-400 mt-2">
            NAT sayesinde bir internet bağlantısını birden fazla cihazla paylaşabilirsiniz. 
            WAN arayüzünden gelen internet erişimini LAN arayüzüne bağlı cihazlara dağıtır.
          </p>
        </div>

        <form onSubmit={handleSave} className="p-6">
          <div className="space-y-8">
            {/* NAT Etkinleştirme */}
            <div className="bg-gray-750 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <span className="material-icons">power_settings_new</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">NAT Durumu</h3>
                    <p className="text-gray-400 text-sm">
                      Internet bağlantı paylaşımını etkinleştirin veya devre dışı bırakın
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={natEnabled}
                    onChange={(e) => setNatEnabled(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-300">
                    {natEnabled ? "Etkin" : "Pasif"}
                  </span>
                </label>
              </div>
            </div>

            {/* Arayüz Seçimi */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* WAN Interface */}
              <div className="bg-gray-750 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-red-600 rounded-lg">
                    <span className="material-icons">public</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">WAN Arayüzü</h3>
                    <p className="text-gray-400 text-sm">İnternet erişimi olan arayüz</p>
                  </div>
                </div>
                
                <select
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  value={wanInterface}
                  onChange={(e) => setWanInterface(e.target.value)}
                  disabled={!natEnabled}
                >
                  <option value="">Arayüz seçiniz</option>
                  {interfaces.map((inf) => (
                    <option key={inf.interface_name} value={inf.interface_name}>
                      {inf.interface_name} {inf.ip_address ? `(${inf.ip_address})` : '(DHCP)'}
                    </option>
                  ))}
                </select>

                {wanInterface && (
                  <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <span className="material-icons mr-2 text-sm">info</span>
                      Seçili Arayüz Detayları
                    </h4>
                    {(() => {
                      const details = getInterfaceDetails(wanInterface);
                      return details ? (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">IP Adresi:</span>
                            <span className="font-mono">{details.ip}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Yönetim Durumu:</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              details.status === "Etkin" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {details.status}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Bağlantı Durumu:</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              details.link === "Bağlı" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {details.link}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">Arayüz bilgisi bulunamadı</span>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* LAN Interface */}
              <div className="bg-gray-750 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <span className="material-icons">lan</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">LAN Arayüzü</h3>
                    <p className="text-gray-400 text-sm">İç ağa paylaşılacak arayüz</p>
                  </div>
                </div>
                
                <select
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  value={lanInterface}
                  onChange={(e) => setLanInterface(e.target.value)}
                  disabled={!natEnabled}
                >
                  <option value="">Arayüz seçiniz</option>
                  {interfaces.map((inf) => (
                    <option key={inf.interface_name} value={inf.interface_name}>
                      {inf.interface_name} {inf.ip_address ? `(${inf.ip_address})` : '(DHCP)'}
                    </option>
                  ))}
                </select>

                {lanInterface && (
                  <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <span className="material-icons mr-2 text-sm">info</span>
                      Seçili Arayüz Detayları
                    </h4>
                    {(() => {
                      const details = getInterfaceDetails(lanInterface);
                      return details ? (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">IP Adresi:</span>
                            <span className="font-mono">{details.ip}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Yönetim Durumu:</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              details.status === "Etkin" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {details.status}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Bağlantı Durumu:</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              details.link === "Bağlı" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {details.link}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">Arayüz bilgisi bulunamadı</span>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>

            {/* Uyarı Mesajları */}
            {natEnabled && (
              <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <span className="material-icons text-yellow-400 mt-0.5">warning</span>
                  <div>
                    <h4 className="font-medium text-yellow-200 mb-2">NAT Yapılandırma Notları</h4>
                    <ul className="text-yellow-100 text-sm space-y-1">
                      <li>• WAN ve LAN arayüzleri farklı olmalıdır</li>
                      <li>• WAN arayüzünün internet erişimi olması gerekir</li>
                      <li>• LAN arayüzü statik IP ile yapılandırılmalıdır</li>
                      <li>• NAT etkinleştirildiğinde firewall kuralları otomatik oluşturulur</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Yapılandırma Özeti */}
            {natEnabled && wanInterface && lanInterface && (
              <div className="bg-green-900 border border-green-600 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <span className="material-icons text-green-400 mt-0.5">check_circle</span>
                  <div>
                    <h4 className="font-medium text-green-200 mb-2">NAT Yapılandırma Özeti</h4>
                    <div className="text-green-100 text-sm space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="material-icons text-red-400 text-sm">public</span>
                        <span>WAN: <strong>{wanInterface}</strong> (İnternet bağlantısı)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="material-icons text-blue-400 text-sm">lan</span>
                        <span>LAN: <strong>{lanInterface}</strong> (İç ağ paylaşımı)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="material-icons text-green-400 text-sm">swap_horiz</span>
                        <span>NAT: <strong>Etkin</strong> (Bağlantı paylaşımı aktif)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Kaydet Butonu */}
          <div className="flex justify-end mt-8 pt-6 border-t border-gray-700">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <span className="material-icons">save</span>
                  <span>Ayarları Kaydet</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Yardım Kartı */}
      <div className="mt-6 bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <span className="material-icons text-blue-400">help_outline</span>
          <h3 className="text-lg font-semibold">NAT Hakkında</h3>
        </div>
        <div className="text-gray-400 text-sm space-y-2">
          <p>
            <strong>Network Address Translation (NAT)</strong>, özel IP adreslerini genel IP adreslerine çeviren bir tekniktir.
            Bu sayede tek bir internet bağlantısını birden fazla cihaz kullanabilir.
          </p>
          <p>
            <strong>Tipik Kullanım:</strong> Modem/router'dan gelen internet bağlantısını (WAN) ev/ofisteki diğer cihazlara (LAN) paylaşmak için kullanılır.
          </p>
          <p>
            <strong>Güvenlik:</strong> NAT aynı zamanda bir güvenlik katmanı sağlar çünkü dış ağdan iç ağa doğrudan erişim engellenir.
          </p>
        </div>
      </div>
    </div>
  );
}

export default NatSettingsPage;
