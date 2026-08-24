const User = require("./model");
const Response = require("../../utils/response");
const APIError = require("../../utils/error");
const bcrypt = require("bcrypt");
const { createToken } = require("../../middlewares/auth");
const sendMail = require("../../utils/sendMail");
const jwt = require("jsonwebtoken");

const updateProfile = async(req,res)=>{
   const userId = req.user._id;
   const {username,name,lastname,email,currentPassword,newPassword,removeImage} = req.body;
    const user = await User.findById(userId);
    if (!user) {
        throw new APIError("Kullanıcı bulunamadı.", 404);
    }
    
    let emailChanged = false;
    let passwordChanged = false;

    if (username && username !== user.username) {
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck) {
            throw new APIError("Bu kullanıcı adı zaten kullanılıyor.", 400);
        }
        user.username = username;
    }

    if (email && email !== user.email) {
        if (!currentPassword) {
            throw new APIError("E-posta değiştirmek için mevcut şifrenizi girmelisiniz.", 400);
        }
        const currentMatch = await bcrypt.compare(currentPassword, user.password);
        if (!currentMatch) throw new APIError("Mevcut şifre hatalı.", 401);

        const emailCheck = await User.findOne({ email });
        if (emailCheck) {
            throw new APIError("Bu email adresi zaten kullanılıyor.", 400);
        }
        
        // Asıl e-postayı hemen DEĞİŞTİRME. Beklemeye al.
        user.pendingEmail = email;
        emailChanged = true;
    }

    if (currentPassword && newPassword) {
        // Eğer e-posta değişiminde zaten kontrol edildiyse tekrar etmemek için kontrol edebiliriz
        // Ancak basitlik adına tekrar kontrol edelim
        const currentMatch = await bcrypt.compare(currentPassword, user.password);
        if (!currentMatch) throw new APIError("Mevcut şifre hatalı.", 401);
        
        user.password = await bcrypt.hash(newPassword, 10);
        passwordChanged = true;
    }

    user.name = name || user.name;
    user.lastname = lastname || user.lastname;

    if (req.file) {
        user.profileImage = "/public/uploads/" + req.file.filename;
    } else if (removeImage === "true") {
        user.profileImage = null;
    }

    await user.save();
    
    let responseMessage = "Profil başarıyla güncellendi.";

    // Şifre değiştiyse: Sadece bu cihazda oturumu yenile, diğer cihazları at
    if (passwordChanged) {
        const newAccessToken = createToken(user, "15m");
        const newRefreshToken = createToken(user, "7d");
        
        user.refreshToken = newRefreshToken;
        await user.save(); // Yeni refreshToken'ı kaydet, diğer tüm oturumlar çökecek

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Uyarı e-postası (Eski kayıtlı e-postaya)
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Güvenlik Uyarısı: Şifreniz Değiştirildi",
            html: `
                <h1>Merhaba, ${user.name}!</h1>
                <p>Hesabınızın şifresi az önce başarıyla değiştirildi.</p>
                <p><strong>Bu işlemi siz yapmadıysanız:</strong> Lütfen derhal "Şifremi Unuttum" adımını kullanarak hesabınızı güvenceye alın.</p>
            `
        };
        await sendMail(mailOptions);
        
        responseMessage = "Şifreniz başarıyla güncellendi. Diğer cihazlardaki oturumlarınız kapatıldı.";
    }

    if (emailChanged) {
        // Yeni maile doğrulama linki gönder
        // Token'ın içine yeni email'i gömüyoruz
        const payload = { id: user._id, newEmail: email };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { algorithm: "HS512", expiresIn: "30m" });

        // YENİ e-postaya giden onay maili
        const verifyMailOptions = {
            from: process.env.EMAIL_USER,
            to: email, // Yeni e-posta
            subject: "E-posta Değişikliği Doğrulama",
            html: `
                <h1>Merhaba, ${user.name}!</h1>
                <p>Hesabınızın e-posta adresini bu adres ile değiştirmek istediniz.</p>
                <p>İşlemi onaylamak için aşağıdaki bağlantıya tıklayın (30 dakika geçerlidir):</p>
                <a href="http://localhost:8080/api/auth/verify?token=${token}">Yeni E-postayı Doğrula</a>
            `
        };
        await sendMail(verifyMailOptions);

        // ESKİ e-postaya giden güvenlik uyarısı
        const alertMailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email, // Eski e-posta
            subject: "Güvenlik Uyarısı: E-posta Değişikliği Talebi",
            html: `
                <h1>Merhaba, ${user.name}!</h1>
                <p>Hesabınızın e-posta adresi değiştirilmek isteniyor.</p>
                <p><strong>Eğer bu işlemi siz yapmadıysanız, hesabınız tehlikede olabilir!</strong> Aşağıdaki bağlantıya tıklayarak değişikliği anında iptal edebilir ve cihazları sistemden atabilirsiniz:</p>
                <a href="http://localhost:8080/api/auth/cancel-email-change?token=${token}">Değişikliği İptal Et ve Hesabı Kilitle</a>
            `
        };
        await sendMail(alertMailOptions);

        responseMessage = passwordChanged 
            ? "Şifreniz güncellendi ve yeni e-posta adresinize doğrulama linki gönderildi."
            : "Yeni e-posta adresinize doğrulama linki gönderildi. Onaylayana kadar eski adresiniz geçerlidir.";
    }

    return res.status(200).json({
        success: true,
        message: responseMessage,
        requireRelogin: false, // Artık zorla atmıyoruz, backend yönetiyor
        data: user
    });
}

const getProfile = async(req,res) => {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
        throw new APIError("Kullanıcı bulunamadı.", 404);
    }
    
    return new Response(user, "Profil bilgileri getirildi.").success(res);
}

const getPublicProfileByUsername = async (req, res) => {
    const { username } = req.params;
    
    // Şifre vb. gizli alanları göndermiyoruz, takipçileri ve takip edilenleri çekiyoruz
    const user = await User.findOne({ username })
        .select("-password -email -isVerified")
        .populate("followers", "username name profileImage")
        .populate("following", "username name profileImage");
    
    if (!user) {
        throw new APIError("Kullanıcı bulunamadı.", 404);
    }
    
    return new Response(user, "Kullanıcı profili getirildi.").success(res);
}

const toggleFollowUser = async (req, res) => {
    const { username } = req.params;
    const currentUserId = req.user._id;

    const targetUser = await User.findOne({ username });
    if (!targetUser) {
        throw new APIError("Kullanıcı bulunamadı.", 404);
    }

    if (targetUser._id.toString() === currentUserId.toString()) {
        throw new APIError("Kendinizi takip edemezsiniz.", 400);
    }

    const currentUser = await User.findById(currentUserId);

    const isFollowing = currentUser.following.includes(targetUser._id);

    if (isFollowing) {
        // Takipten çık
        currentUser.following.pull(targetUser._id);
        targetUser.followers.pull(currentUser._id);
    } else {
        // Takip et
        currentUser.following.push(targetUser._id);
        targetUser.followers.push(currentUser._id);
    }

    await currentUser.save();
    await targetUser.save();

    const message = isFollowing ? "Takipten çıkıldı." : "Takip edildi.";
    return new Response(null, message).success(res);
}

module.exports = {
    updateProfile,
    getProfile,
    getPublicProfileByUsername,
    toggleFollowUser
}
