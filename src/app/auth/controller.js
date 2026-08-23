const User = require("../users/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Response = require("../../utils/response");
const APIError = require("../../utils/error");
const {createToken} = require("../../middlewares/auth");
const sendMail = require("../../utils/sendMail");

const register = async(req,res) =>{
    const {username,name,lastname,email,password} = req.body;
    const userCheck = await User.findOne({email});
    if(userCheck){
        throw new APIError("Bu email adresi ile kayıtlı bir kullanıcı bulunmaktadır.",400);
    }
        const usernameCheck = await User.findOne({username});
    if(usernameCheck){
        throw new APIError("Bu kullanıcı adı ile kayıtlı bir kullanıcı bulunmaktadır.",400);
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const newUser = new User({
        username,
        name,
        lastname:lastname ? lastname : null,
        email,
        password:hashedPassword
    });
    const savedUser = await newUser.save();
    const token = createToken(savedUser,"1d");
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: savedUser.email,
        subject: "Hesap Doğrulama / Hoş Geldiniz",
        html: `
            <h1>Hoş Geldin, ${savedUser.name}!</h1>
            <p>Hesabını doğrulamak için aşağıdaki bağlantıya tıkla:</p>
            <a href="http://localhost:8080/api/auth/verify?token=${token}">Hesabı Doğrula</a>
        `
    };
    
    await sendMail(mailOptions);

    return new Response({
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        lastname: savedUser.lastname,
        username: savedUser.username,
        email: savedUser.email,
        profileImage: savedUser.profileImage
      }
    },"Kayıt başarılı. Doğrulama e-postası adresinize gönderildi.").created(res);
}

const verifyMail = async(req,res) =>{
    const {token} = req.query;
    if(!token){
        throw new APIError("Doğrulama tokeni eksik.",400);
    }
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch {
        throw new APIError("Geçersiz veya süresi dolmuş doğrulama tokeni.",400);
    }

    const user = await User.findById(decoded.id);
    if(!user){
        throw new APIError("Kullanıcı bulunamadı.",404);
    }
    if(user.isVerified){
        return new Response(null,"Hesabınız daha önce doğrulanmış.").ok(res);
    }
    
    user.isVerified = true;
    await user.save();

    return new Response(null, "Hesabınız başarıyla doğrulandı. Artık giriş yapabilirsiniz.").success(res);
}

const login = async(req,res) =>{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        throw new APIError("Kullanıcı bulunamadı.",404);
    }
    if(!user.isVerified){
        throw new APIError("Hesabınız doğrulanmamış. Lütfen e-posta adresinizi doğrulayın.",403);
    }
    const passwordCompare = await bcrypt.compare(password,user.password);
    if(!passwordCompare){
        throw new APIError("Geçersiz şifre.",401);
    }

    const accessToken = createToken(user, "15m");
    const refreshToken = createToken(user, "7d");

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000, // 15 dakika
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
    });

    return new Response({
        user: { 
            _id: user._id, 
            name: user.name, 
            lastname: user.lastname,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage
        }
    }, "Giriş başarılı.").success(res);
}

const logout = async (req, res) => {
    // req.user yoksa bile token'dan bulmak için deneyebiliriz ama genellikle
    // client logout'a bastığında accessToken ile istek atar.
    // accessToken süresi geçmiş olsa da, çerezleri silebiliriz.
    
    // Güvenlik: DB'den refreshToken'ı temizle (eğer accessToken'dan gelen req.user varsa)
    if (req.user && req.user._id) {
        await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    } else {
        // req.user yoksa ve sadece çerezlerle logout atmışsa refreshToken'ı okuyalım
        const refreshTokenCookie = req.cookies?.refreshToken;
        if (refreshTokenCookie) {
             const user = await User.findOne({ refreshToken: refreshTokenCookie });
             if (user) {
                 user.refreshToken = null;
                 await user.save();
             }
        }
    }

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    return new Response(null, "Çıkış başarılı.").success(res);
}

const refreshToken = async (req, res) => {
    const token = req.cookies?.refreshToken;

    if (!token) {
        throw new APIError("Yenileme jetonu bulunamadı. Lütfen tekrar giriş yapın.", 401);
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch {
        throw new APIError("Yenileme jetonu geçersiz veya süresi dolmuş.", 401);
    }

    const user = await User.findById(decoded.id);
    
    if (!user) {
        throw new APIError("Kullanıcı bulunamadı.", 404);
    }

    // Güvenlik kontrolü: Veritabanındaki refreshToken ile gelen token aynı mı?
    if (user.refreshToken !== token) {
        // Başkası token'ı kullanmış olabilir, güvenlik için token'ı sıfırla
        user.refreshToken = null;
        await user.save();
        throw new APIError("Güvenlik ihlali tespit edildi. Lütfen tekrar giriş yapın.", 401);
    }

    // Her şey yolunda, yeni bir accessToken üret
    const newAccessToken = createToken(user, "15m");

    res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000, // 15 dakika
    });

    return new Response(null, "Token başarıyla yenilendi.").success(res);
}

const forgotPassword = async (req, res) => {
    const { emailOrUsername } = req.body;
    if (!emailOrUsername) {
        throw new APIError("Lütfen e-posta veya kullanıcı adınızı girin.", 400);
    }

    const user = await User.findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!user) {
        throw new APIError("Bu bilgilere ait bir kullanıcı bulunamadı.", 404);
    }

    // 15 dakikalık şifre sıfırlama token'ı oluştur
    const token = createToken(user, "15m");

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Şifre Sıfırlama İsteği",
        html: `
            <h1>Merhaba, ${user.name}!</h1>
            <p>Hesabınız için bir şifre sıfırlama isteği aldık. Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
            <p><strong>Bu bağlantı 15 dakika boyunca geçerlidir.</strong></p>
            <a href="http://localhost:3000/auth/reset-password?token=${token}">Şifremi Sıfırla</a>
            <p>Eğer bu isteği siz yapmadıysanız, bu e-postayı dikkate almayabilirsiniz.</p>
        `
    };

    await sendMail(mailOptions);

    return new Response(null, "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.").success(res);
}

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        throw new APIError("Eksik veya geçersiz parametreler.", 400);
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch {
        throw new APIError("Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş.", 400);
    }

    const user = await User.findById(decoded.id);
    if (!user) {
        throw new APIError("Kullanıcı bulunamadı.", 404);
    }

    // Yeni şifreyi kaydet
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return new Response(null, "Şifreniz başarıyla güncellendi. Artık yeni şifrenizle giriş yapabilirsiniz.").success(res);
}

module.exports = {
    register,
    verifyMail,
    login,
    logout,
    forgotPassword,
    resetPassword,
    refreshToken
}
