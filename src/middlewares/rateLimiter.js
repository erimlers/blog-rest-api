const rateLimit = require("express-rate-limit");
const APIError = require("../utils/error");

// Genel API Limitörü (Yazıları getirme, arama yapma vb. zararsız ve sık işlemler için çok esnek)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 1000, // 15 dakikada 1000 istek
  handler: (req, res, next) => {
    next(new APIError("Çok fazla istek yapıldı, lütfen daha sonra tekrar deneyin.", 429));
  }
});

// Güvenlik Kritik API Limitörü (Giriş yapma, Kayıt olma vb. işlemler için daha katı)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 20, // 15 dakikada maksimum 20 auth işlemi
  handler: (req, res, next) => {
    next(new APIError("Çok fazla giriş denemesi yapıldı. Güvenliğiniz için lütfen 15 dakika bekleyin.", 429));
  }
});

module.exports = { generalLimiter, authLimiter };
