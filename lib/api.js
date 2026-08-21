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
    const data = error.response?.data;
    const message = typeof data === "string" 
      ? data 
      : data?.message || "Beklenmeyen bir hata oluştu.";
    const status = error.response?.status;

    // 401: Token geçersiz veya süresi dolmuş
    // NOT: Burada 'window.location.href' ile zorunlu yönlendirme yapmak sonsuz döngüye sebep olur.
    // Çünkü uygulama açılışında 'checkAuth' çalışır, misafir kullanıcı için 401 döner, 
    // login'e yönlendirir, sayfa yeniden yüklenir, checkAuth tekrar çalışır ve sonsuz döngü oluşur.
    // Yetki kontrolü (protected routes) sayfa bazında (veya middleware ile) yapılmalıdır.

    return Promise.reject({ message, status });
  }
);

export default api;
