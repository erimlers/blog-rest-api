import axios from "axios";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Axios instance — tüm API istekleri buradan geçer
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // httpOnly cookie'leri her istekte otomatik gönderir
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Response Interceptor ───────────────────────────────────
// Backend her zaman { success, data, message } formatında döner.
// Bu interceptor wrapper'ı açarak sadece işe yarar veriyi döner.
api.interceptors.response.use(
  (response) => {
    // Başarılı yanıt — backend wrapper'ını aç
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 Hatası yakalanırsa ve daha önce denenmemişse (ayrıca refresh-token isteğinin kendisi değilse)
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && originalRequest.url !== "/auth/refresh-token") {
      
      if (isRefreshing) {
        // Eğer zaten bir yenileme işlemi sürüyorsa bu isteği kuyruğa ekle
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Arka planda yeni token al
        await api.post("/auth/refresh-token");
        
        // Kuyruktaki bekleyen istekleri serbest bırak
        processQueue(null);
        
        // Asıl isteği tekrar dene
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token da ölmüşse kuyruktakileri hata ile patlat
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Normal hata durumu
    const data = error.response?.data;
    const message = typeof data === "string" 
      ? data 
      : data?.message || "Beklenmeyen bir hata oluştu.";
    const status = error.response?.status;

    return Promise.reject({ message, status });
  }
);

export default api;
