import axios from "axios";

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
  (error) => {
    // Hata durumu
    const message =
      error.response?.data?.message || "Beklenmeyen bir hata oluştu.";
    const status = error.response?.status;

    // 401: Token geçersiz veya süresi dolmuş
    if (status === 401) {
      // Client-side'da ise login sayfasına yönlendir
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject({ message, status });
  }
);

export default api;
