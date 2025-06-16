// File: src/pages/LoginPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // useNavigate, login başarılı olduğunda /dashboard'a yönlendirmek için
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:8000/auth/login", {
        username,
        password
      });

      // Eğer login başarılı oldu ve access_token geldiyse:
      if (res.data.access_token) {
        // 1) Token'ı localStorage'e yaz
        localStorage.setItem("token", res.data.access_token);
        // 2) /dashboard sayfasına yönlendir
        navigate("/dashboard");
      } else {
        alert("Sunucu geçerli bir token döndürmedi. Lütfen kontrol edin.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Giriş hatası: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo ve Başlık */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <span className="material-icons text-5xl text-blue-500 mr-3">shield</span>
            <h1 className="text-3xl font-bold text-white">NetGate</h1>
          </div>
          <p className="text-gray-400">Güvenlik Duvarı Yönetim Paneli</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800 rounded-lg p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Giriş Yap</h2>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Kullanıcı adınızı girin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Parola
              </label>
              <input
                type="password"
                className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Parolanızı girin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Giriş Yap
            </button>
          </form>

          {/* Alt Bilgi */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
              <span className="material-icons text-green-500 text-sm">security</span>
              <span>Güvenli bağlantı</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            NetGate Güvenlik Duvarı v1.0
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
