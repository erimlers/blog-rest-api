# Blog API

Bu proje, blog uygulaması için geliştirilmiş RESTful API servisidir. Node.js ve Express.js kullanılarak oluşturulmuş olup, veritabanı olarak MongoDB tercih edilmiştir.

## Özellikler

- JWT tabanlı kimlik doğrulama ve oturum yönetimi
- Kullanıcı güvenliği için Bcrypt ile şifre hashleme
- Helmet, CORS ve Rate Limiting ile API güvenliği optimizasyonu
- Nodemailer üzerinden e-posta doğrulama (email verification) işlemleri
- Multer ile güvenli dosya ve medya yükleme mekanizması
- Socket.io entegrasyonu ile gerçek zamanlı veri ve bildirim iletimi
- Joi ile gelen isteklerin (request) detaylı validasyonu
- Merkezi ve standartlaştırılmış hata yakalama (Error Handling) yapısı
- Gönderi, yorum, cevap ve beğeni gibi iç içe (nested) veri ilişkilerinin yönetimi
- Date-fns ile zaman dilimi (timezone) destekli tarih işlemleri

## Kullanılan Teknolojiler

- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT)
- Socket.io
- Multer & Nodemailer
- Joi & Bcrypt

## Kurulum ve Çalıştırma

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. Proje kök dizininde `.env` dosyası oluşturarak gerekli ortam değişkenlerini tanımlayın (Örn: Veritabanı bağlantı adresi, JWT gizli anahtarı, SMTP bilgileri, Port).

3. Geliştirme ortamında sunucuyu başlatmak için:
   ```bash
   npm run dev
   ```

Sunucu varsayılan olarak belirtilen port numarası üzerinden hizmet vermeye başlayacaktır.
