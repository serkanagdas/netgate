// File: src/pages/FirewallRulesPage.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function FirewallRulesPage() {
  const [rules, setRules] = useState([]);
  const [groups, setGroups] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form alanları
  const [ruleId, setRuleId] = useState(null);
  const [ruleName, setRuleName] = useState("");
  const [sourceIps, setSourceIps] = useState("");
  const [port, setPort] = useState("");
  const [protocol, setProtocol] = useState("TCP"); // TCP/UDP/ANY
  const [action, setAction] = useState("ALLOW");
  const [direction, setDirection] = useState("OUT");
  const [profile, setProfile] = useState("Any");
  const [description, setDescription] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [priority, setPriority] = useState(100);

  const [scheduleStart, setScheduleStart] = useState("");
  const [scheduleEnd, setScheduleEnd] = useState("");
  const [daysOfWeek, setDaysOfWeek] = useState([]);

  const [groupId, setGroupId] = useState("");

  useEffect(() => {
    fetchRules();
    fetchGroups();
  }, []);

  const fetchRules = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:8000/firewall/rules", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRules(res.data);
    } catch (err) {
      alert("Kural listesi alınamadı: " + err.message);
    }
  };

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:8000/firewall/groups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(res.data);
    } catch (err) {
      console.error("Grup listesi alınamadı:", err);
    }
  };

  const clearForm = () => {
    setRuleId(null);
    setRuleName("");
    setSourceIps("");
    setPort("");
    setProtocol("TCP");
    setAction("ALLOW");
    setDirection("OUT");
    setProfile("Any");
    setDescription("");
    setEnabled(true);
    setPriority(100);
    setScheduleStart("");
    setScheduleEnd("");
    setDaysOfWeek([]);
    setGroupId("");
  };

  const handleNewRule = () => {
    clearForm();
    setIsEditMode(false);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Kaynak IP(ler) virgülle ayrılabilir: "10.36.130.28, 192.168.1.5"
    const ipsArr = sourceIps
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i);

    const body = {
      rule_name: ruleName,
      source_ips: ipsArr,       // array
      port: port,               // "80,443" girilmişse string
      protocol: protocol,       // "TCP"/"UDP"/"ANY"
      action: action,
      direction: direction,     // "IN"/"OUT"
      profile: profile,         // "Any"/"Domain"/"Private"/"Public"
      description: description,
      enabled: enabled,
      priority: Number(priority),
      schedule_start: scheduleStart || null,
      schedule_end: scheduleEnd || null,
      days_of_week: daysOfWeek.map(d => parseInt(d, 10)),
      group_id: groupId || null
    };

    try {
      if (!isEditMode) {
        // POST -> kural ekle
        const res = await axios.post("http://127.0.0.1:8000/firewall/rules", body, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert(res.data.message);
      } else {
        // PUT -> güncelle
        const url = `http://127.0.0.1:8000/firewall/rules/${ruleId}`;
        const res = await axios.put(url, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert(res.data.message);
      }
      setShowForm(false);
      fetchRules();
    } catch (err) {
      alert("Kural kaydedilemedi: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleEdit = (r) => {
    setIsEditMode(true);
    setShowForm(true);
    setRuleId(r._id);
    setRuleName(r.rule_name || "");
    setSourceIps(r.source_ips?.join(", ") || "");
    setPort(r.port || "");
    setProtocol(r.protocol || "TCP");
    setAction(r.action || "ALLOW");
    setDirection(r.direction || "OUT");
    setProfile(r.profile || "Any");
    setDescription(r.description || "");
    setEnabled(r.enabled !== false);
    setPriority(r.priority || 100);
    setScheduleStart(r.schedule_start || "");
    setScheduleEnd(r.schedule_end || "");
    setDaysOfWeek(r.days_of_week || []);
    setGroupId(r.group_id || "");
  };

  const handleDelete = async (r) => {
    if (!window.confirm(`'${r.rule_name}' kuralını silmek istediğinize emin misiniz?`)) return;
    try {
      const token = localStorage.getItem("token");
      const url = `http://127.0.0.1:8000/firewall/rules/${r._id}`;
      const res = await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(res.data.message);
      fetchRules();
    } catch (err) {
      alert("Silme hatası: " + (err.response?.data?.detail || err.message));
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const arr = Array.from(rules);
    const [removed] = arr.splice(source.index, 1);
    arr.splice(destination.index, 0, removed);
    setRules(arr);
    // Priority güncellemesi istersen backend'e de iletebilirsin.
  };

  // Haftanın günleri tıklandığında
  const handleDayCheck = (idx) => {
    if (daysOfWeek.includes(idx)) {
      setDaysOfWeek(daysOfWeek.filter((d) => d !== idx));
    } else {
      setDaysOfWeek([...daysOfWeek, idx]);
    }
  };

  const getGroupName = (gid) => {
    if (!gid) return "-";
    const g = groups.find((item) => item._id === gid);
    return g ? g.group_name : "(Silinmiş Grup)";
  };

  const getActionColor = (action) => {
    return action === "ALLOW" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getActionIcon = (action) => {
    return action === "ALLOW" ? "check_circle" : "block";
  };

  const getProtocolColor = (protocol) => {
    switch (protocol) {
      case 'TCP':
        return 'bg-blue-100 text-blue-800';
      case 'UDP':
        return 'bg-purple-100 text-purple-800';
      case 'ANY':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Başlık */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 mb-2">
              <span className="material-icons text-3xl text-blue-400">security</span>
              <h1 className="text-3xl font-bold text-white">Güvenlik Kuralları</h1>
            </div>
            <button 
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center shadow-lg"
              onClick={handleNewRule}
            >
              <span className="material-icons mr-2">add</span>
              Yeni Kural Ekle
            </button>
          </div>
          <p className="text-gray-400">Güvenlik duvarı kurallarını yönetin ve zamanlayın</p>
        </div>

        {/* Kurallar Tablosu */}
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <span className="material-icons mr-2">list</span>
              Aktif Kurallar ({rules.length} adet)
            </h3>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="firewall-rules-list">
              {(provided) => (
                <div className="overflow-x-auto" ref={provided.innerRef} {...provided.droppableProps}>
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Kural Adı
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Grup
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          İşlem
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Protokol
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Port
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Kaynak IP
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Yön
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Zamanlama
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Durum
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {rules.map((r, index) => {
                        const gName = getGroupName(r.group_id);
                        const ipList = r.source_ips?.join(", ") || "-";

                        let scheduleInfo = "-";
                        if (r.schedule_start && r.schedule_end) {
                          if (r.days_of_week && r.days_of_week.length > 0) {
                            const dayLabels = ["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"];
                            const dayStr = r.days_of_week.map(d => dayLabels[d] || "?").join(",");
                            scheduleInfo = `${r.schedule_start}-${r.schedule_end} (${dayStr})`;
                          } else {
                            scheduleInfo = `${r.schedule_start}-${r.schedule_end}`;
                          }
                        }

                        return (
                          <Draggable key={r._id} draggableId={r._id} index={index}>
                            {(prov) => (
                              <tr
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                {...prov.dragHandleProps}
                                className="hover:bg-gray-700 transition-colors duration-200"
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                  <div className="flex items-center">
                                    <span className="material-icons mr-2 text-gray-400 cursor-move">drag_indicator</span>
                                    {index + 1}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                  {r.rule_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                  {gName}
                                </td>
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                  {r.port || "-"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                                  {ipList}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                  <div className="flex items-center">
                                    <span className="material-icons mr-1 text-xs">
                                      {r.direction === "IN" ? "input" : "output"}
                                    </span>
                                    {r.direction}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                  {scheduleInfo}
                                </td>
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                  <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors duration-200 flex items-center inline-flex"
                                    onClick={() => handleEdit(r)}
                                  >
                                    <span className="material-icons mr-1 text-sm">edit</span>
                                    Düzenle
                                  </button>
                                  <button
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors duration-200 flex items-center inline-flex"
                                    onClick={() => handleDelete(r)}
                                  >
                                    <span className="material-icons mr-1 text-sm">delete</span>
                                    Sil
                                  </button>
                                </td>
                              </tr>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </tbody>
                  </table>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Form Modal/Kart */}
        {showForm && (
          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <span className="material-icons mr-2">{isEditMode ? "edit" : "add"}</span>
                {isEditMode ? "Kuralı Düzenle" : "Yeni Kural Ekle"}
              </h3>
              <button
                className="text-gray-400 hover:text-white"
                onClick={() => setShowForm(false)}
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Grid Layout for Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Kural Adı *
                  </label>
                  <input
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    value={ruleName}
                    onChange={(e) => setRuleName(e.target.value)}
                    placeholder="Kural adını girin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Kaynak IP(ler)
                  </label>
                  <input
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={sourceIps}
                    onChange={(e) => setSourceIps(e.target.value)}
                    placeholder="192.168.1.1, 10.0.0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Port
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    placeholder="80,443"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Protokol
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={protocol}
                    onChange={(e) => setProtocol(e.target.value)}
                  >
                    <option value="TCP">TCP</option>
                    <option value="UDP">UDP</option>
                    <option value="ANY">ANY</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    İşlem
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                  >
                    <option value="ALLOW">İZİN VER</option>
                    <option value="DENY">ENGELLE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Yön
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={direction}
                    onChange={(e) => setDirection(e.target.value)}
                  >
                    <option value="IN">GİREN</option>
                    <option value="OUT">ÇIKAN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Profil
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={profile}
                    onChange={(e) => setProfile(e.target.value)}
                  >
                    <option value="Any">Herhangi</option>
                    <option value="Domain">Domain</option>
                    <option value="Private">Özel</option>
                    <option value="Public">Genel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Öncelik
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    placeholder="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Grup
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={groupId}
                    onChange={(e) => setGroupId(e.target.value)}
                  >
                    <option value="">Seçiniz</option>
                    {groups.map((g) => (
                      <option key={g._id} value={g._id}>
                        {g.group_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Açıklama */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Açıklama
                </label>
                <textarea
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Bu kural hakkında açıklama ekleyin..."
                />
              </div>

              {/* Zaman Planlama */}
              <div className="border-t border-gray-700 pt-6">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                  <span className="material-icons mr-2">schedule</span>
                  Zaman Planlaması
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Başlangıç Saati
                    </label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={scheduleStart}
                      onChange={(e) => setScheduleStart(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bitiş Saati
                    </label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={scheduleEnd}
                      onChange={(e) => setScheduleEnd(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Haftanın Günleri
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"].map((lbl, idx) => (
                      <label key={idx} className="flex items-center">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={daysOfWeek.includes(idx)}
                          onChange={() => handleDayCheck(idx)}
                        />
                        <div className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors duration-200 ${
                          daysOfWeek.includes(idx) 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}>
                          {lbl}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Kural Durumu */}
              <div className="border-t border-gray-700 pt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                  />
                  <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    enabled ? 'bg-green-500' : 'bg-gray-600'
                  }`}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                      enabled ? 'translate-x-6' : ''
                    }`}></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-300">
                    Kural Etkin
                  </span>
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-700">
                <button
                  type="button"
                  className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-md transition-colors duration-200"
                  onClick={() => setShowForm(false)}
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
                  {isEditMode ? "Güncelle" : "Ekle"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default FirewallRulesPage;
