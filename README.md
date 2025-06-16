# NetGate Güvenlik Duvarı

NetGate, ağ güvenliğinizi yönetmek için kapsamlı bir web arayüzü sunan bir güvenlik duvarı uygulamasıdır. Kullanıcı dostu arayüzü ile güvenlik duvarı kuralları, ağ arayüzleri, NAT ayarları, statik rotalar ve DNS engelleme gibi kritik ağ fonksiyonlarını kolayca yapılandırmanıza olanak tanır.

## ✨ Temel Özellikler

*   **Dashboard:** Sistem durumu, trafik özeti ve güvenlik olayları hakkında genel bir bakış. ([frontend/src/pages/DashboardPage.jsx](frontend/src/pages/DashboardPage.jsx))
*   **Güvenlik Duvarı Kuralları:** Gelen ve giden trafik için detaylı güvenlik duvarı kuralları oluşturma, düzenleme ve yönetme. ([frontend/src/pages/FirewallRulesPage.jsx](frontend/src/pages/FirewallRulesPage.jsx), [backend/app/routers/firewall.py](backend/app/routers/firewall.py))
*   **Kural Grupları:** Kuralları mantıksal gruplar altında toplama ve yönetme. ([frontend/src/pages/FirewallGroupsPage.jsx](frontend/src/pages/FirewallGroupsPage.jsx))
*   **Ağ Arayüzleri:** Ağ arayüzlerini (Ethernet, Wi-Fi vb.) yapılandırma, IP adresi, alt ağ maskesi, ağ geçidi ve DNS ayarlarını yönetme. ([frontend/src/pages/NetworkInterfacesPage_new.jsx](frontend/src/pages/NetworkInterfacesPage_new.jsx))
*   **NAT Ayarları:** Ağ Adresi Çevirisi (NAT) yapılandırması ile iç ağınızı internete güvenli bir şekilde bağlama. ([frontend/src/pages/NatSettingsPage_new.jsx](frontend/src/pages/NatSettingsPage_new.jsx))
*   **Statik Rotalar:** Belirli ağ hedefleri için özel rotalar tanımlama. ([frontend/src/pages/StaticRoutesPage_new.jsx](frontend/src/pages/StaticRoutesPage_new.jsx))
*   **DNS Yönetimi:** İstenmeyen alan adlarını engelleme ve DNS yapılandırmasını yönetme. ([frontend/src/pages/DNSManagementPage_new.jsx](frontend/src/pages/DNSManagementPage_new.jsx))
*   **Sistem Günlükleri:** Güvenlik duvarı etkinliklerini, bağlantı girişimlerini ve sistem olaylarını detaylı olarak izleme. ([frontend/src/pages/LogsPage.jsx](frontend/src/pages/LogsPage.jsx))
*   **Raporlama:** Ağ trafiği, güvenlik olayları ve sistem performansı hakkında kapsamlı raporlar oluşturma. ([frontend/src/pages/ReportsPage_new.jsx](frontend/src/pages/ReportsPage_new.jsx))
*   **Güncellemeler:** Sistem yazılımı ve güvenlik tanımları için güncellemeleri kontrol etme ve yükleme. ([frontend/src/pages/UpdatesPage_new.jsx](frontend/src/pages/UpdatesPage_new.jsx))
*   **Ayarlar:** Sistem ayarlarını yönetme, yapılandırmayı yedekleme ve geri yükleme. ([frontend/src/pages/SettingsPage_new.jsx](frontend/src/pages/SettingsPage_new.jsx), [frontend/src/pages/BackupRestorePage.jsx](frontend/src/pages/BackupRestorePage.jsx))
*   **Kullanıcı Yönetimi:** Güvenli erişim için kullanıcı kimlik doğrulaması.

## 🛠️ Kullanılan Teknolojiler

*   **Backend:**
    *   Python
    *   FastAPI
    *   MongoDB (Motor sürücüsü ile)
    *   Uvicorn
*   **Frontend:**
    *   React
    *   JavaScript
    *   Tailwind CSS
    *   Axios

## 🚀 Kurulum

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

### Gereksinimler

*   Node.js ve npm
*   Python 3.7+ ve pip
*   MongoDB veritabanı

### Backend Kurulumu

1.  **Backend dizinine gidin:**
    ```bash
    cd backend
    ```
2.  **Python sanal ortamı oluşturun ve aktifleştirin (önerilir):**
    ```bash
    python -m venv venv
    # Windows için
    venv\Scripts\activate
    # macOS/Linux için
    source venv/bin/activate
    ```
3.  **Gerekli Python paketlerini yükleyin:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Ortam değişkenlerini ayarlayın:**
    Projenin kök dizininde (`backend/`) bir `.env` dosyası oluşturun. Örnek içerik için [`backend/app/config.py`](backend/app/config.py) dosyasına bakabilirsiniz. Genellikle `JWT_SECRET` ve MongoDB bağlantı bilgileri gibi ayarları içerecektir.
    ```env
    # .env dosyası örneği
    JWT_SECRET=cokgizlibiranahtar
    MONGO_DETAILS=mongodb://localhost:27017
    ```
5.  **Backend sunucusunu başlatın:**
    ```bash
    uvicorn app.main:app --reload
    ```
    Sunucu varsayılan olarak `http://127.0.0.1:8000` adresinde çalışacaktır.

### Frontend Kurulumu

1.  **Frontend dizinine gidin:**
    ```bash
    cd frontend
    ```
2.  **Gerekli Node.js paketlerini yükleyin:**
    ```bash
    npm install
    ```
3.  **Frontend geliştirme sunucusunu başlatın:**
    ```bash
    npm start
    ```
    Uygulama varsayılan olarak `http://localhost:3000` adresinde açılacaktır ve backend API (`http://127.0.0.1:8000`) ile iletişim kuracaktır.
