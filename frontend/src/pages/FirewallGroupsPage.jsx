// File: src/pages/FirewallGroupsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

function FirewallGroupsPage() {
  const [groups, setGroups] = useState([]);
  const [rules, setRules] = useState([]); // Grup içindeki kuralları tutmak için

  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showGroupRules, setShowGroupRules] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Form alanları (Grup için)
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:8000/firewall/groups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Backend'den gelen grup verisine rule_count eklenmişse onu kullanabiliriz.
      // Şimdilik manuel olarak her grup için kural sayısını çekmiyoruz, performans için.
      // Eğer backend grup listesinde her grup için kural sayısı veriyorsa, o direkt kullanılabilir.
      setGroups(res.data.map(g => ({ ...g, rule_count: g.rule_count !== undefined ? g.rule_count : 'N/A' })));
    } catch (err) {
      alert("Grup listesi alınamadı: " + (err.response?.data?.detail || err.message));
    }
  };

  const fetchGroupRules = async (group) => {
    setSelectedGroup(group);
    setShowGroupRules(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://127.0.0.1:8000/firewall/groups/${group._id}/rules`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRules(res.data);
    } catch (err) {
      alert(
        `'${group.group_name}' grubuna ait kurallar alınamadı: ` +
        (err.response?.data?.detail || err.message)
      );
      setRules([]); // Hata durumunda kuralları temizle
    }
  };

  const clearForm = () => {
    setCurrentGroupId(null);
    setGroupName("");
    setDescription("");
  };

  const handleNewGroup = () => {
    clearForm();
    setIsEditMode(false);
    setShowForm(true);
    setShowGroupRules(false); // Diğer görünümü kapat
  };

  const handleEditGroup = (group) => {
    setIsEditMode(true);
    setCurrentGroupId(group._id);
    setGroupName(group.group_name);
    setDescription(group.description || "");
    setShowForm(true);
    setShowGroupRules(false); // Diğer görünümü kapat
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      alert("Grup adı boş bırakılamaz.");
      return;
    }
    const token = localStorage.getItem("token");
    const body = { group_name: groupName, description: description };

    try {
      let res;
      if (isEditMode) {
        res = await axios.put(`http://127.0.0.1:8000/firewall/groups/${currentGroupId}`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert(res.data.message || "Grup başarıyla güncellendi.");
      } else {
        res = await axios.post("http://127.0.0.1:8000/firewall/groups", body, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert(res.data.message || "Grup başarıyla eklendi.");
      }
      setShowForm(false);
      fetchGroups();
      clearForm();
    } catch (err) {
      alert(
        `${isEditMode ? "Grup güncelleme" : "Grup ekleme"} hatası: ` +
        (err.response?.data?.detail || err.message)
      );
    }
  };

  const handleDeleteGroup = async (group) => {
    if (!window.confirm(`'${group.group_name}' grubunu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/firewall/groups/${group._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Grup başarıyla silindi.");
      fetchGroups();
      if (selectedGroup && selectedGroup._id === group._id) {
        setShowGroupRules(false);
        setSelectedGroup(null);
        setRules([]);
      }
    } catch (err) {
      alert("Grup silme hatası: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleEnableDisableRulesInGroup = async (group, enable) => {
    const actionText = enable ? "etkinleştirilsin" : "pasifleştirilsin";
    if (!window.confirm(`'${group.group_name}' grubundaki tüm kurallar ${actionText} mi?`)) return;
    try {
      const token = localStorage.getItem("token");
      // Backend endpoint'i bu şekilde olmalı: /firewall/groups/{group_id}/rules/enable?enable=true
      // Veya PATCH /firewall/groups/{group_id}/rules body: { enabled: true/false }
      // Şimdiki API'ye göre uyarlıyorum, backend'e göre endpoint değişebilir.
      await axios.patch(`http://127.0.0.1:8000/firewall/groups/${group._id}/rules/enable`, 
        { enable: enable }, // Body içinde gönderiyoruz
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`'${group.group_name}' grubundaki kurallar başarıyla ${actionText}.`);
      // Eğer aktif olarak o grubun kuralları gösteriliyorsa, listeyi yenile
      if (showGroupRules && selectedGroup && selectedGroup._id === group._id) {
        fetchGroupRules(group);
      }
    } catch (err) {
      alert(
        `Grup kurallarını ${actionText} hatası: ` +
        (err.response?.data?.detail || err.message)
      );
    }
  };

  // FirewallRulesPage'den alınan yardımcı renk/ikon fonksiyonları
  const getActionColor = (action) => {
    return action === "ALLOW" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };
  const getActionIcon = (action) => {
    return action === "ALLOW" ? "check_circle" : "block";
  };
  const getProtocolColor = (protocol) => {
    switch (protocol) {
      case 'TCP': return 'bg-blue-100 text-blue-800';
      case 'UDP': return 'bg-purple-100 text-purple-800';
      case 'ANY': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Başlık Alanı */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 mb-2">
              <span className="material-icons text-3xl text-yellow-400">folder_special</span>
              <h1 className="text-3xl font-bold text-white">Kural Grupları</h1>
            </div>
            {!showForm && !showGroupRules && (
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center shadow-lg"
                onClick={handleNewGroup}
              >
                <span className="material-icons mr-2">add_circle_outline</span>
                Yeni Grup Ekle
              </button>
            )}
          </div>
          <p className="text-gray-400">Güvenlik duvarı kural gruplarını oluşturun ve yönetin.</p>
        </div>

        {/* Form Gösterimi (Yeni/Düzenle) */}
        {showForm && (
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <span className="material-icons mr-2">{isEditMode ? "edit_note" : "add_circle"}</span>
                {isEditMode ? "Kural Grubunu Düzenle" : "Yeni Kural Grubu Oluştur"}
              </h3>
              <button
                className="text-gray-400 hover:text-white"
                onClick={() => {
                  setShowForm(false);
                  clearForm();
                }}
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="groupName" className="block text-sm font-medium text-gray-300 mb-2">
                  Grup Adı *
                </label>
                <input
                  id="groupName"
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Örn: Yasaklı IP Adresleri"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Açıklama
                </label>
                <textarea
                  id="description"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Bu grup ne amaçla kullanılacak? (Opsiyonel)"
                />
              </div>
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-700">
                <button
                  type="button"
                  className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-md transition-colors duration-200"
                  onClick={() => {
                    setShowForm(false);
                    clearForm();
                  }}
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors duration-200 flex items-center"
                >
                  <span className="material-icons mr-2 text-sm">
                    {isEditMode ? "save" : "add"}
                  </span>
                  {isEditMode ? "Güncelle" : "Oluştur"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Grup Listesi Gösterimi */}
        {!showForm && !showGroupRules && (
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <span className="material-icons mr-2">list_alt</span>
                Tanımlı Gruplar ({groups.length} adet)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Grup Adı</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Açıklama</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Kural Sayısı</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {groups.length > 0 ? (
                    groups.map((g) => (
                      <tr key={g._id} className="hover:bg-gray-700 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {g.group_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {g.description || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {/* Kural sayısı backend'den geliyorsa burada gösterilir */}
                          {g.rule_count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-1 flex items-center">
                          <button
                            title="Gruba Ait Kuralları Görüntüle"
                            className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-md transition-colors duration-200 flex items-center"
                            onClick={() => fetchGroupRules(g)}
                          >
                            <span className="material-icons text-sm">visibility</span>
                          </button>
                          <button
                            title="Grup Bilgilerini Düzenle"
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition-colors duration-200 flex items-center"
                            onClick={() => handleEditGroup(g)}
                          >
                            <span className="material-icons text-sm">edit</span>
                          </button>
                          <button
                            title="Bu Gruptaki Tüm Kuralları Etkinleştir"
                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md transition-colors duration-200 flex items-center"
                            onClick={() => handleEnableDisableRulesInGroup(g, true)}
                          >
                            <span className="material-icons text-sm">play_arrow</span>
                          </button>
                          <button
                            title="Bu Gruptaki Tüm Kuralları Pasifleştir"
                            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md transition-colors duration-200 flex items-center"
                            onClick={() => handleEnableDisableRulesInGroup(g, false)}
                          >
                            <span className="material-icons text-sm">pause</span>
                          </button>
                          <button
                            title="Grubu Sil"
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-colors duration-200 flex items-center"
                            onClick={() => handleDeleteGroup(g)}
                          >
                            <span className="material-icons text-sm">delete_sweep</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-10 text-center text-gray-400">
                        <div className="flex flex-col items-center">
                          <span className="material-icons text-5xl mb-2 opacity-50">layers_clear</span>
                          <p className="text-lg">Henüz tanımlanmış bir kural grubu bulunmamaktadır.</p>
                          <p className="text-sm opacity-70 mt-1">Yukarıdaki "Yeni Grup Ekle" butonu ile başlayabilirsiniz.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Seçili Grubun Kuralları Gösterimi */}
        {showGroupRules && selectedGroup && (
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden mt-8">
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <span className="material-icons mr-3 text-purple-400">visibility</span>
                Kural Grubu: <span className="ml-2 font-bold text-purple-300">{selectedGroup.group_name}</span> ({rules.length} kural)
              </h3>
              <button
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
                onClick={() => {
                  setShowGroupRules(false);
                  setSelectedGroup(null);
                  setRules([]);
                }}
              >
                <span className="material-icons mr-1 text-sm">close</span>
                Kapat
              </button>
            </div>
            {rules.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Kural Adı</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">İşlem</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Protokol</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Port</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Kaynak IP</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Yön</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Zamanlama</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Durum</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {rules.map((r, index) => {
                      const ipList = r.source_ips?.join(", ") || "-";
                      let scheduleInfo = "-";
                      if (r.schedule_start && r.schedule_end) {
                        if (r.days_of_week && r.days_of_week.length > 0) {
                          const dayLabels = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
                          const dayStr = r.days_of_week.map(d => dayLabels[d] || "?").join(",");
                          scheduleInfo = `${r.schedule_start}-${r.schedule_end} (${dayStr})`;
                        } else {
                          scheduleInfo = `${r.schedule_start}-${r.schedule_end}`;
                        }
                      }
                      return (
                        <tr key={r._id} className="hover:bg-gray-700 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{r.rule_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(r.action)}`}>
                              <span className="material-icons mr-1 text-xs">{getActionIcon(r.action)}</span>
                              {r.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProtocolColor(r.protocol)}`}>
                              {r.protocol}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{r.port || "-"}</td>
                          <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate" title={ipList}>{ipList}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            <div className="flex items-center">
                              <span className="material-icons mr-1 text-xs">
                                {r.direction === "IN" ? "south_west" : "north_east"}
                              </span>
                              {r.direction}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{scheduleInfo}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              r.enabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              <span className="material-icons mr-1 text-xs">
                                {r.enabled ? "check_circle" : "cancel"}
                              </span>
                              {r.enabled ? "Aktif" : "Pasif"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-10 text-center text-gray-400">
                <div className="flex flex-col items-center">
                  <span className="material-icons text-5xl mb-2 opacity-50">rule_folder</span>
                  <p className="text-lg">Bu grupta gösterilecek herhangi bir kural bulunmamaktadır.</p>
                  <p className="text-sm opacity-70 mt-1">
                    Bu gruba kural eklemek için "Güvenlik Kuralları" sayfasını ziyaret edebilirsiniz.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FirewallGroupsPage;
