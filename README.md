# Blog API Projesi

Bu proje, bir blog uygulaması için geliştirilmiş kapsamlı, güvenli ve modüler bir Node.js / Express REST API sistemidir.

##  Öne Çıkan Özellikler

* **Güvenli Kimlik Doğrulama:** JWT (JSON Web Token) tabanlı oturum yönetimi ve Bcrypt şifreleme.
* **Kayıt ve Email Doğrulaması:** Nodemailer ile asenkron onay e-postası (email verification) gönderimi.
* **Kapsamlı İçerik Etkileşimi:** İç içe (nested) yorum/cevap yapısı ve gönderi beğeni (like) sistemi.
* **Dosya Yönetimi:** Multer ile güvenli medya ve dosya yükleme (upload) işlemleri.
* **Merkezi Hata Yönetimi:** Kapsamlı ve standartlaştırılmış global hata yakalama (Error Handling) mekanizması.
* **Veri Doğrulama:** Joi kullanılarak request payload'larının detaylı validasyonu.
* **Güvenlik & Performans:** Helmet (güvenlik başlıkları), CORS, Rate Limiter (istek sınırı) ve Compression (sıkıştırma).
* **Zaman Dilimi (Timezone) Desteği:** `date-fns` ve `@date-fns/tz` ile tarihlerde tam `Europe/Istanbul` yerel zaman desteği.

## Kullanılan Teknolojiler

* **Core:** Node.js, Express.js
* **Veritabanı:** MongoDB (Mongoose)
* **Güvenlik:** jsonwebtoken, bcrypt, helmet, express-rate-limit
* **Araçlar ve Kütüphaneler:** Joi, Multer, Nodemailer, date-fns

## Proje Yapısı (Service-Oriented)

Proje servis/özellik odaklı (Feature-based) bir mimari üzerine kuruludur.

```text
blogapi/
├── src/
│   ├── app/           # Her özelliğe (auth, comments vs.) ait model, controller ve router dosyaları
│   ├── middlewares/   # Global hata yakalayıcı, JWT koruma gibi ara yazılımlar
│   ├── utils/         # Custom error sınıfları, tarih formatlayıcılar (dateFormatter.js)
│   └── ...
├── public/            # Statik dosyalar
├── app.js             # Express app yapılandırması (middleware ve root route tanımları)
├── server.js          # DB bağlantısı ve sunucuyu ayağa kaldırma noktası
└── package.json       # Bağımlılıklar ve npm betikleri
```

## Kurulum ve Çalıştırma

1. Proje bağımlılıklarını kurun:
   ```bash
   npm install
   ```
2. Ana dizine bir `.env` dosyası oluşturun (Veritabanı URL, JWT Secret Key, Port bilgisi vs. gibi ayarları içermelidir).
3. Geliştirme ortamında sunucuyu başlatmak için:
   ```bash
   npm run dev
   ```
