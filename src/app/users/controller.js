const User = require("./model");
const Response = require("../../utils/response");
const APIError = require("../../utils/error");
const bcrypt = require("bcrypt");
const { createToken } = require("../../middlewares/auth");
const sendMail = require("../../utils/sendMail");

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
        const emailCheck = await User.findOne({ email });
        if (emailCheck) {
            throw new APIError("Bu email adresi zaten kullanılıyor.", 400);
        }
        user.email = email;
        user.isVerified = false;
        emailChanged = true;
    }

    if (currentPassword && newPassword) {
      const currentMatch = await bcrypt.compare(currentPassword, user.password);
      if (!currentMatch) throw new APIError("Mevcut şifre hatalı.",401);
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

    if (emailChanged || passwordChanged) {
        if (emailChanged) {
            const token = createToken(user, "1d");
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: "E-posta Doğrulama",
                html: `
                    <h1>Merhaba, ${user.name}!</h1>
                    <p>E-posta adresinizi güncellediğiniz için hesabınızı yeniden doğrulamanız gerekmektedir. Lütfen aşağıdaki bağlantıya tıklayın:</p>
                    <a href="http://localhost:8080/api/auth/verify?token=${token}">Hesabı Doğrula</a>
                `
            };
            await sendMail(mailOptions);
        }

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        let msg = emailChanged 
            ? "E-posta adresiniz güncellendi. Yeni adresinize bir doğrulama maili gönderildi. Lütfen hesabınızı doğrulayarak tekrar giriş yapın."
            : "Şifreniz başarıyla güncellendi. Güvenliğiniz için lütfen tekrar giriş yapın.";
            
        return res.status(200).json({
            success: true,
            message: msg,
            requireRelogin: true,
            data: user
        });
    }

    return new Response(user, "Kullanıcı başarıyla güncellendi.").success(res);
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
    
    // Şifre vb. gizli alanları göndermiyoruz
    const user = await User.findOne({ username }).select("-password -email -isVerified");
    
    if (!user) {
        throw new APIError("Kullanıcı bulunamadı.", 404);
    }
    
    return new Response(user, "Kullanıcı profili getirildi.").success(res);
}

module.exports = {
    updateProfile,
    getProfile,
    getPublicProfileByUsername
}
