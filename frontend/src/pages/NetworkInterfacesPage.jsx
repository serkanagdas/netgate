// src/pages/NetworkInterfacesPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Basit IP/subnet Regex
const ipRegex = /^((25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(25[0-5]|2[0-4]\d|[01]?\d?\d)$/;
const maskRegex = /^((255|254|252|248|240|224|192|128|0)\.){3}(255|254|252|248|240|224|192|128|0)$/;

function NetworkInterfacesPage() {
  const [interfaces, setInterfaces] = useState([]);

  // Form state
  const [intfName, setIntfName] = useState("Ethernet");
  const [ipMode, setIpMode] = useState("static");
  const [ipAddress, setIpAddress] = useState("");
  const [subnetMask, setSubnetMask] = useState("");
  const [gateway, setGateway] = useState("");
  const [dnsPrimary, setDnsPrimary] = useState("");
  const [dnsSecondary, setDnsSecondary] = useState("");
  const [adminEnabled, setAdminEnabled] = useState(true);
  const [mtu, setMtu] = useState(1500);
  const [vlanId, setVlanId] = useState("");

  // Validation errors
  const [ipErr, setIpErr] = useState("");
  const [maskErr, setMaskErr] = useState("");
  const [mtuErr, setMtuErr] = useState("");
  const [vlanErr, setVlanErr] = useState("");

  // Edit mode flag
  const [isEditMode, setIsEditMode] = useState(false);

  // Form görünür/gizli toggle
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchInterfaces();
  }, []);

  const fetchInterfaces = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:8000/network/interfaces", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInterfaces(res.data);
    } catch (err) {
      console.error(err);
      alert("Arayüzleri çekerken hata: " + err.message);
    }
  };

  // Validation
  const handleIpChange = (e) => {
    const val = e.target.value;
    setIpAddress(val);
    if (val && !ipRegex.test(val)) setIpErr("Geçersiz IP formatı");
    else setIpErr("");
  };

  const handleMaskChange = (e) => {
    const val = e.target.value;
    setSubnetMask(val);
    if (val && !maskRegex.test(val)) setMaskErr("Geçersiz Subnet Mask");
    else setMaskErr("");
  };

  const handleMtuChange = (e) => {
    const val = e.target.value;
    setMtu(val);
    const num = parseInt(val, 10);
    if (num < 576 || num > 9000) setMtuErr("MTU 576-9000 arası olmalı.");
    else setMtuErr("");
  };

  const handleVlanChange = (e) => {
    const val = e.target.value;
    setVlanId(val);
    const num = parseInt(val, 10);
    if (num < 0 || num > 4095) setVlanErr("VLAN ID 0-4095 arası olmalı.");
    else setVlanErr("");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (ipMode === "static") {
      if (!ipAddress || ipErr) {
        alert("IP Address hatalı veya boş!");
        return;
      }
      if (!subnetMask || maskErr) {
        alert("Subnet Mask hatalı veya boş!");
        return;
      }
    }
    if (mtuErr || vlanErr) {
      alert("MTU veya VLAN ID hatalı!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const body = {
        interface_name: intfName,
        ip_mode: ipMode,
        ip_address: ipMode === "static" ? ipAddress : null,
        subnet_mask: ipMode === "static" ? subnetMask : null,
        gateway: ipMode === "static" ? gateway : null,
        dns_primary: ipMode === "static" ? (dnsPrimary || null) : null,
        dns_secondary: ipMode === "static" ? (dnsSecondary || null) : null,
        admin_enabled: adminEnabled,
        mtu: mtu ? Number(mtu) : null,
        vlan_id: vlanId ? Number(vlanId) : null
      };

      const tokenHeader = { headers: { Authorization: `Bearer ${token}` } };
      let res;
      if (!isEditMode) {
        // POST => yeni interface ekle
        res = await axios.post("http://127.0.0.1:8000/network/interfaces", body, tokenHeader);
        alert(res.data.message || "Arayüz oluşturuldu");
      } else {
        // PUT => varolanı güncelle
        const url = `http://127.0.0.1:8000/network/interfaces/${intfName}`;
        res = await axios.put(url, body, tokenHeader);
        alert(res.data.message || "Arayüz güncellendi");
      }

      clearForm();
      setShowForm(false);
      fetchInterfaces();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || err.message;
      alert("Hata oluştu: " + msg);
    }
  };

  const clearForm = () => {
    setIntfName("Ethernet");
    setIpMode("static");
    setIpAddress("");
    setSubnetMask("");
    setGateway("");
    setDnsPrimary("");
    setDnsSecondary("");
    setAdminEnabled(true);
    setMtu(1500);
    setVlanId("");
    setIsEditMode(false);

    setIpErr("");
    setMaskErr("");
    setMtuErr("");
    setVlanErr("");
  };

  const handleEditClick = (inf) => {
    setShowForm(true);
    setIsEditMode(true);
    setIntfName(inf.interface_name);
    setIpMode(inf.ip_mode || "static");
    setIpAddress(inf.ip_address || "");
    setSubnetMask(inf.subnet_mask || "");
    setGateway(inf.gateway || "");
    setDnsPrimary(inf.dns_primary || "");
    setDnsSecondary(inf.dns_secondary || "");
    setAdminEnabled(inf.admin_enabled !== false);
    setMtu(inf.mtu || 1500);
    setVlanId(inf.vlan_id ? String(inf.vlan_id) : "");
  };

  const handleCancelEdit = () => {
    clearForm();
    setShowForm(false);
  };

  const handleNewInterface = () => {
    clearForm();
    setShowForm(true);
  };

  // Interface Silme
  const handleDelete = async (ifaceName) => {
    if (!window.confirm(`${ifaceName} arayüzünü silmek istediğinize emin misiniz?`)) return;
    try {
      const token = localStorage.getItem("token");
      const url = `http://127.0.0.1:8000/network/interfaces/${ifaceName}`;
      const res = await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message || "Silindi");
      fetchInterfaces();
    } catch (err) {
      alert("Silme hatası: " + (err.response?.data?.detail || err.message));
    }
  };

  const formatDateIstanbul = (isoString) => {
    if (!isoString) return "-";
    const dt = new Date(isoString);
    return dt.toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <span className="material-icons text-2xl">settings_ethernet</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Ağ Arayüzleri</h1>
              <p className="text-gray-400 mt-1">Network interface yapılandırması ve yönetimi</p>
            </div>
          </div>
          <button
            onClick={handleNewInterface}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <span className="material-icons">add</span>
            <span>Yeni Arayüz</span>
          </button>
        </div>
      </div>

      {/* Interface Listesi */}
      <div className="bg-gray-800 rounded-xl shadow-lg mb-6">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="material-icons text-blue-400">network_check</span>
            <h2 className="text-xl font-semibold">Mevcut Ağ Arayüzleri</h2>
            <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-sm">
              {interfaces.length} adet
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {interfaces.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-icons text-6xl text-gray-600 mb-4 block">device_hub</span>
              <h3 className="text-xl font-medium text-gray-400 mb-2">Henüz ağ arayüzü yok</h3>
              <p className="text-gray-500 mb-6">İlk ağ arayüzünüzü oluşturmak için yukarıdaki butonu kullanın</p>
              <button
                onClick={handleNewInterface}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                İlk Arayüzü Oluştur
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 font-medium text-gray-300">Arayüz</th>
                  <th className="text-left p-4 font-medium text-gray-300">Mod</th>
                  <th className="text-left p-4 font-medium text-gray-300">IP Adresi</th>
                  <th className="text-left p-4 font-medium text-gray-300">Alt Ağ</th>
                  <th className="text-left p-4 font-medium text-gray-300">Ağ Geçidi</th>
                  <th className="text-left p-4 font-medium text-gray-300">DNS</th>
                  <th className="text-left p-4 font-medium text-gray-300">Durum</th>
                  <th className="text-left p-4 font-medium text-gray-300">MTU</th>
                  <th className="text-left p-4 font-medium text-gray-300">VLAN</th>
                  <th className="text-left p-4 font-medium text-gray-300">Son Güncelleme</th>
                  <th className="text-left p-4 font-medium text-gray-300">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {interfaces.map((inf) => (
                  <tr key={inf._id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-700 rounded-lg">
                          <span className="material-icons text-blue-400">ethernet</span>
                        </div>
                        <div>
                          <div className="font-medium text-white">{inf.interface_name}</div>
                          <div className="text-sm text-gray-400">
                            {inf.link_state === "up" ? "Bağlı" : inf.link_state === "down" ? "Bağlı Değil" : "Bilinmiyor"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        inf.ip_mode === "static" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                      }`}>
                        <span className="material-icons mr-1 text-xs">
                          {inf.ip_mode === "static" ? "settings" : "autorenew"}
                        </span>
                        {inf.ip_mode === "static" ? "Statik" : "DHCP"}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300 font-mono text-sm">
                      {inf.ip_address || "-"}
                    </td>
                    <td className="p-4 text-gray-300 font-mono text-sm">
                      {inf.subnet_mask || "-"}
                    </td>
                    <td className="p-4 text-gray-300 font-mono text-sm">
                      {inf.gateway || "-"}
                    </td>
                    <td className="p-4">
                      <div className="text-gray-300 font-mono text-sm">
                        <div>{inf.dns_primary || "-"}</div>
                        {inf.dns_secondary && (
                          <div className="text-gray-500">{inf.dns_secondary}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          inf.admin_enabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          <span className="material-icons mr-1 text-xs">
                            {inf.admin_enabled ? "check_circle" : "cancel"}
                          </span>
                          {inf.admin_enabled ? "Etkin" : "Pasif"}
                        </span>
                        <br />
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          inf.link_state === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          <span className="material-icons mr-1 text-xs">
                            {inf.link_state === "up" ? "link" : "link_off"}
                          </span>
                          {inf.link_state === "up" ? "Bağlı" : "Kopuk"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300 font-mono text-sm">
                      {inf.mtu || "-"}
                    </td>
                    <td className="p-4">
                      {inf.vlan_id ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          <span className="material-icons mr-1 text-xs">label</span>
                          VLAN {inf.vlan_id}
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {formatDateIstanbul(inf.updated_at)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditClick(inf)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <span className="material-icons text-sm">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(inf.interface_name)}
                          className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <span className="material-icons text-sm">delete</span>
                        </button>
                      </div>
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
                    <span className="material-icons">
                      {isEditMode ? "edit" : "add"}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {isEditMode ? "Arayüz Düzenle" : "Yeni Arayüz Ekle"}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {isEditMode ? "Mevcut arayüz ayarlarını güncelleyin" : "Yeni ağ arayüzü yapılandırması oluşturun"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <span className="material-icons">close</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Interface Adı */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <span className="material-icons mr-2 text-sm align-middle">ethernet</span>
                    Arayüz Adı
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    value={intfName}
                    onChange={(e) => setIntfName(e.target.value)}
                    disabled={isEditMode}
                    placeholder="Örn: Ethernet, WiFi"
                  />
                </div>

                {/* Mode */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <span className="material-icons mr-2 text-sm align-middle">settings</span>
                    IP Yapılandırma Modu
                  </label>
                  <select
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    value={ipMode}
                    onChange={(e) => setIpMode(e.target.value)}
                  >
                    <option value="static">Statik IP</option>
                    <option value="dhcp">DHCP (Otomatik)</option>
                  </select>
                </div>

                {/* Static IP Ayarları */}
                {ipMode === "static" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <span className="material-icons mr-2 text-sm align-middle">public</span>
                        IP Adresi
                      </label>
                      <input
                        type="text"
                        className={`w-full bg-gray-700 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-1 transition-colors ${
                          ipErr ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                        value={ipAddress}
                        onChange={handleIpChange}
                        placeholder="192.168.1.10"
                      />
                      {ipErr && <p className="text-red-400 text-sm mt-1">{ipErr}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <span className="material-icons mr-2 text-sm align-middle">crop_free</span>
                        Alt Ağ Maskesi
                      </label>
                      <input
                        type="text"
                        className={`w-full bg-gray-700 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-1 transition-colors ${
                          maskErr ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                        value={subnetMask}
                        onChange={handleMaskChange}
                        placeholder="255.255.255.0"
                      />
                      {maskErr && <p className="text-red-400 text-sm mt-1">{maskErr}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <span className="material-icons mr-2 text-sm align-middle">router</span>
                        Ağ Geçidi <span className="text-gray-500">(İsteğe bağlı)</span>
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        value={gateway}
                        onChange={(e) => setGateway(e.target.value)}
                        placeholder="192.168.1.1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <span className="material-icons mr-2 text-sm align-middle">dns</span>
                        Birincil DNS <span className="text-gray-500">(İsteğe bağlı)</span>
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        value={dnsPrimary}
                        onChange={(e) => setDnsPrimary(e.target.value)}
                        placeholder="8.8.8.8"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <span className="material-icons mr-2 text-sm align-middle">dns</span>
                        İkincil DNS <span className="text-gray-500">(İsteğe bağlı)</span>
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        value={dnsSecondary}
                        onChange={(e) => setDnsSecondary(e.target.value)}
                        placeholder="8.8.4.4"
                      />
                    </div>
                  </>
                )}

                {/* MTU */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <span className="material-icons mr-2 text-sm align-middle">straighten</span>
                    MTU Boyutu
                  </label>
                  <input
                    type="number"
                    className={`w-full bg-gray-700 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-1 transition-colors ${
                      mtuErr ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    value={mtu}
                    onChange={handleMtuChange}
                    placeholder="1500"
                    min="576"
                    max="9000"
                  />
                  {mtuErr && <p className="text-red-400 text-sm mt-1">{mtuErr}</p>}
                  <p className="text-gray-500 text-xs mt-1">576-9000 arası değer girin</p>
                </div>

                {/* VLAN ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <span className="material-icons mr-2 text-sm align-middle">label</span>
                    VLAN ID <span className="text-gray-500">(İsteğe bağlı)</span>
                  </label>
                  <input
                    type="number"
                    className={`w-full bg-gray-700 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-1 transition-colors ${
                      vlanErr ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    value={vlanId}
                    onChange={handleVlanChange}
                    placeholder="100"
                    min="0"
                    max="4095"
                  />
                  {vlanErr && <p className="text-red-400 text-sm mt-1">{vlanErr}</p>}
                  <p className="text-gray-500 text-xs mt-1">0-4095 arası değer girin</p>
                </div>

                {/* Admin Enabled */}
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="adminEnabled"
                      className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                      checked={adminEnabled}
                      onChange={(e) => setAdminEnabled(e.target.checked)}
                    />
                    <label htmlFor="adminEnabled" className="text-sm font-medium text-gray-300 flex items-center">
                      <span className="material-icons mr-2 text-sm">power_settings_new</span>
                      Arayüz Etkinleştir (Up/Down Durumu)
                    </label>
                  </div>
                  <p className="text-gray-500 text-xs mt-1 ml-7">
                    Bu seçenek arayüzün yönetimsel olarak etkin/pasif durumunu belirler
                  </p>
                </div>
              </div>

              {/* Butonlar */}
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <span className="material-icons text-sm">
                    {isEditMode ? "update" : "save"}
                  </span>
                  <span>{isEditMode ? "Güncelle" : "Kaydet"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default NetworkInterfacesPage;
