// File: src/pages/DNSManagementPage.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";

function DNSManagementPage() {
  const [domains, setDomains] = useState([]);
  const [newDomain, setNewDomain] = useState("");
  const [useWildcard, setUseWildcard] = useState(true);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [adblockUrl, setAdblockUrl] = useState("");
  const [adblockStatus, setAdblockStatus] = useState("");
  const [adblockLoading, setAdblockLoading] = useState(false);

  const [selectedDomains, setSelectedDomains] = useState([]);
  const [dohBlockStatus, setDohBlockStatus] = useState("");
  const [dohLoading, setDohLoading] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:8000/dns/domains", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDomains(res.data);
      setSelectedDomains([]);
    } catch (err) {
      alert("Domain listesi çekilemedi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDomain = async (e) => {
    e.preventDefault();
    if (!newDomain) {
      alert("Lütfen domain giriniz.");
      return;
    }
    
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const body = {
        domain: newDomain.trim().toLowerCase(),
        note,
        use_wildcard: useWildcard
      };
      const res = await axios.post("http://127.0.0.1:8000/dns/domains", body, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message || "Domain başarıyla eklendi");
      setNewDomain("");
      setNote("");
      setUseWildcard(true);
      setShowAddForm(false);
      fetchDomains();
    } catch (err) {
      alert("Domain ekleme hatası: " + (err.response?.data?.detail || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleCheckboxChange = (domainObj) => {
    const domainName = domainObj.domain;
    if (selectedDomains.includes(domainName)) {
      setSelectedDomains(selectedDomains.filter((d) => d !== domainName));
    } else {
      setSelectedDomains([...selectedDomains, domainName]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const all = filteredDomains.map((d) => d.domain);
      setSelectedDomains(all);
    } else {
      setSelectedDomains([]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedDomains.length === 0) {
      alert("Hiç domain seçmediniz.");
      return;
    }
    if (!window.confirm(`Seçili ${selectedDomains.length} domain silinsin mi?`)) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      for (const dom of selectedDomains) {
        await axios.delete(`http://127.0.0.1:8000/dns/domains/${encodeURIComponent(dom)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      alert("Seçili domainler silindi");
      fetchDomains();
    } catch (err) {
      alert("Toplu silme hatası: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleDeleteDomain = async (domainObj) => {
    if (!window.confirm(`"${domainObj.domain}" silinsin mi?`)) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/dns/domains/${encodeURIComponent(domainObj.domain)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Domain silindi");
      fetchDomains();
    } catch (err) {
      alert("Silme hatası: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleAdblockImport = async () => {
    if (!adblockUrl) {
      alert("Adblock liste URL'si giriniz!");
      return;
    }
    setAdblockLoading(true);
    try {
      const token = localStorage.getItem("token");
      setAdblockStatus("Liste indiriliyor ve işleniyor...");
      const body = { url: adblockUrl };
      const res = await axios.post("http://127.0.0.1:8000/dns/adblocklist", body, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdblockStatus(res.data.message || "Liste başarıyla eklendi");
      fetchDomains();
    } catch (err) {
      setAdblockStatus("Hata: " + (err.response?.data?.detail || err.message));
    } finally {
      setAdblockLoading(false);
    }
  };

  const handleBlockDoH = async () => {
    setDohLoading(true);
    try {
      setDohBlockStatus("DoH sunucuları engelleniyor...");
      const token = localStorage.getItem("token");
      const res = await axios.post("http://127.0.0.1:8000/dns/doh-block", null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDohBlockStatus(res.data.message || "DoH sunucuları başarıyla engellendi");
    } catch (err) {
      setDohBlockStatus("Hata: " + (err.response?.data?.detail || err.message));
    } finally {
      setDohLoading(false);
    }
  };

  // Domain filtreleme
  const filteredDomains = domains.filter(domain =>
    domain.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (domain.note && domain.note.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-lg">DNS kayıtları yükleniyor...</span>
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
            <div className="p-2 bg-green-600 rounded-lg">
              <span className="material-icons text-2xl">dns</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">DNS Yönetimi</h1>
              <p className="text-gray-400 mt-1">Domain engelleme, reklam filtreleme ve DNS güvenliği</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <span className="material-icons">add</span>
            <span>Yeni Domain</span>
          </button>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Engelli Domainler</p>
              <p className="text-2xl font-bold text-white">{domains.length.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-600 rounded-lg">
              <span className="material-icons text-white">block</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Wildcard Kurallar</p>
              <p className="text-2xl font-bold text-white">
                {domains.filter(d => d.use_wildcard).length.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-orange-600 rounded-lg">
              <span className="material-icons text-white">all_inclusive</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Seçili Domainler</p>
              <p className="text-2xl font-bold text-white">{selectedDomains.length.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-600 rounded-lg">
              <span className="material-icons text-white">check_box</span>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Listesi */}
      <div className="bg-gray-800 rounded-xl shadow-lg mb-6">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <span className="material-icons text-red-400">block</span>
              <h2 className="text-xl font-semibold">Engelli Domainler</h2>
            </div>
            
            {/* Arama ve Filtreler */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">search</span>
                <input
                  type="text"
                  placeholder="Domain ara..."
                  className="bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {selectedDomains.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <span className="material-icons">delete</span>
                  <span>Seçilenleri Sil ({selectedDomains.length})</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredDomains.length === 0 ? (
            <div className="p-12 text-center">
              {searchTerm ? (
                <>
                  <span className="material-icons text-6xl text-gray-600 mb-4 block">search_off</span>
                  <h3 className="text-xl font-medium text-gray-400 mb-2">Arama sonucu bulunamadı</h3>
                  <p className="text-gray-500 mb-6">"{searchTerm}" için eşleşen domain bulunamadı</p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Aramayı Temizle
                  </button>
                </>
              ) : (
                <>
                  <span className="material-icons text-6xl text-gray-600 mb-4 block">dns</span>
                  <h3 className="text-xl font-medium text-gray-400 mb-2">Henüz engelli domain yok</h3>
                  <p className="text-gray-500 mb-6">İlk domain engelinizi oluşturmak için yukarıdaki butonu kullanın</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    İlk Domain'i Engelle
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              {/* Toplu İşlemler */}
              <div className="p-4 border-b border-gray-700 bg-gray-750">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                      checked={filteredDomains.length > 0 && selectedDomains.length === filteredDomains.length}
                      onChange={handleSelectAll}
                    />
                    <span className="text-sm text-gray-300">Tümünü Seç</span>
                  </label>
                  
                  <span className="text-sm text-gray-500">
                    {filteredDomains.length} domain gösteriliyor
                  </span>
                </div>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-4 font-medium text-gray-300 w-12">#</th>
                    <th className="text-left p-4 font-medium text-gray-300">Domain</th>
                    <th className="text-left p-4 font-medium text-gray-300">Wildcard</th>
                    <th className="text-left p-4 font-medium text-gray-300">Not</th>
                    <th className="text-left p-4 font-medium text-gray-300">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDomains.map((item, idx) => (
                    <tr key={item._id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                            checked={selectedDomains.includes(item.domain)}
                            onChange={() => handleCheckboxChange(item)}
                          />
                          <span className="text-sm text-gray-400">{idx + 1}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gray-700 rounded-lg">
                            <span className="material-icons text-red-400 text-sm">block</span>
                          </div>
                          <div>
                            <div className="font-medium text-white font-mono text-sm">{item.domain}</div>
                            <div className="text-xs text-gray-400">
                              {item.use_wildcard ? `*.${item.domain} dahil` : "Sadece bu domain"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.use_wildcard ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          <span className="material-icons mr-1 text-xs">
                            {item.use_wildcard ? "all_inclusive" : "stop"}
                          </span>
                          {item.use_wildcard ? "Wildcard" : "Spesifik"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-300 text-sm">
                          {item.note || <span className="text-gray-500">-</span>}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDeleteDomain(item)}
                          className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                          title="Domain'i Sil"
                        >
                          <span className="material-icons text-sm">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      {/* Reklam Engelleme */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Adblock Listesi */}
        <div className="bg-gray-800 rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <span className="material-icons text-yellow-400">shield</span>
              <h2 className="text-xl font-semibold">Reklam/Tracker Engelleyici</h2>
            </div>
            <p className="text-gray-400 text-sm mt-1">Harici adblock listelerinden toplu domain içe aktarımı</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <span className="material-icons mr-2 text-sm align-middle">link</span>
                  Adblock Liste URL'si
                </label>
                <input
                  type="url"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  value={adblockUrl}
                  onChange={(e) => setAdblockUrl(e.target.value)}
                  placeholder="https://somehost.com/adblock-list.txt"
                />
                <p className="text-gray-500 text-xs mt-1">
                  EasyList, AdGuard veya benzeri format desteklenir
                </p>
              </div>
              
              <button
                onClick={handleAdblockImport}
                disabled={adblockLoading || !adblockUrl}
                className="w-full flex items-center justify-center space-x-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 px-4 py-3 rounded-lg font-medium transition-colors"
              >
                {adblockLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>İndiriliyor...</span>
                  </>
                ) : (
                  <>
                    <span className="material-icons">download</span>
                    <span>Liste İndir ve Ekle</span>
                  </>
                )}
              </button>
              
              {adblockStatus && (
                <div className={`p-3 rounded-lg ${
                  adblockStatus.includes("Hata") 
                    ? "bg-red-900 border border-red-600 text-red-200" 
                    : "bg-green-900 border border-green-600 text-green-200"
                }`}>
                  <div className="flex items-center space-x-2">
                    <span className="material-icons text-sm">
                      {adblockStatus.includes("Hata") ? "error" : "check_circle"}
                    </span>
                    <span className="text-sm">{adblockStatus}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DoH Engelleme */}
        <div className="bg-gray-800 rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <span className="material-icons text-red-400">security</span>
              <h2 className="text-xl font-semibold">DNS over HTTPS Engelleme</h2>
            </div>
            <p className="text-gray-400 text-sm mt-1">Şifreli DNS trafiğini engelle</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <span className="material-icons text-yellow-400 mt-0.5">warning</span>
                  <div>
                    <h4 className="font-medium text-yellow-200 mb-1">Dikkat</h4>
                    <p className="text-yellow-100 text-sm">
                      DoH engelleme, Google DNS, Cloudflare DNS gibi şifreli DNS servislerini engeller. 
                      Bu, DNS filtrelemenizi bypass etmeye çalışan cihazları durdurur.
                    </p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleBlockDoH}
                disabled={dohLoading}
                className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-4 py-3 rounded-lg font-medium transition-colors"
              >
                {dohLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Engelleniyor...</span>
                  </>
                ) : (
                  <>
                    <span className="material-icons">block</span>
                    <span>DoH Sunucularını Engelle</span>
                  </>
                )}
              </button>
              
              {dohBlockStatus && (
                <div className={`p-3 rounded-lg ${
                  dohBlockStatus.includes("Hata") 
                    ? "bg-red-900 border border-red-600 text-red-200" 
                    : "bg-green-900 border border-green-600 text-green-200"
                }`}>
                  <div className="flex items-center space-x-2">
                    <span className="material-icons text-sm">
                      {dohBlockStatus.includes("Hata") ? "error" : "check_circle"}
                    </span>
                    <span className="text-sm">{dohBlockStatus}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <span className="material-icons">add</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Yeni Domain Engelle</h2>
                    <p className="text-gray-400 text-sm">Engellenecek domain adresini ekleyin</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <span className="material-icons">close</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleAddDomain} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <span className="material-icons mr-2 text-sm align-middle">language</span>
                    Domain Adresi
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    placeholder="example.com"
                    required
                  />
                  <p className="text-gray-500 text-xs mt-1">www. öneki olmadan girin</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <span className="material-icons mr-2 text-sm align-middle">note</span>
                    Not <span className="text-gray-500">(İsteğe bağlı)</span>
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Neden engellendiğini açıklayın"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="wildcardCheck"
                    className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    checked={useWildcard}
                    onChange={(e) => setUseWildcard(e.target.checked)}
                  />
                  <label htmlFor="wildcardCheck" className="text-sm font-medium text-gray-300 flex items-center">
                    <span className="material-icons mr-2 text-sm">all_inclusive</span>
                    Alt domain'leri de engelle (Wildcard)
                  </label>
                </div>
                <p className="text-gray-500 text-xs ml-7">
                  Etkinleştirilirse *.domain.com formatında tüm alt domainler de engellenir
                </p>
              </div>

              {/* Preview */}
              {newDomain && (
                <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-300 mb-2">Engellenecek:</p>
                  <div className="space-y-1">
                    <div className="text-sm font-mono text-red-400">
                      {newDomain.trim().toLowerCase()}
                    </div>
                    {useWildcard && (
                      <div className="text-sm font-mono text-red-400">
                        *.{newDomain.trim().toLowerCase()}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={saving || !newDomain}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Ekleniyor...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-icons text-sm">block</span>
                      <span>Domain'i Engelle</span>
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
          <span className="material-icons text-green-400">help_outline</span>
          <h3 className="text-lg font-semibold">DNS Filtreleme Hakkında</h3>
        </div>
        <div className="text-gray-400 text-sm space-y-2">
          <p>
            <strong>Domain Engelleme:</strong> Belirtilen web sitelerine erişimi DNS seviyesinde engeller. 
            Bu yöntem reklam, zararlı yazılım ve istenmeyen içerik engellemede etkilidir.
          </p>
          <p>
            <strong>Wildcard Engelleme:</strong> *.example.com formatında tüm alt domainleri de engeller. 
            Örneğin ads.example.com, tracker.example.com gibi adresler de engellenecektir.
          </p>
          <p>
            <strong>Adblock Listeleri:</strong> EasyList, AdGuard gibi yaygın reklam engelleme listelerini 
            otomatik olarak içe aktarabilirsiniz.
          </p>
          <p>
            <strong>DoH Engelleme:</strong> DNS over HTTPS trafiğini engelleyerek, filtrelemeyi bypass etmeye 
            çalışan cihazları durdurur.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DNSManagementPage;
