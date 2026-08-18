const User = require("./model");
const Response = require("../../utils/response");
const APIError = require("../../utils/error");
const bcrypt = require("bcrypt");

const updateProfile = async(req,res)=>{
   const userId = req.user._id;
    const {username,name,lastname,email,currentPassword,newPassword} = req.body;
   const user = await User.findById(userId);
    if (!user) {
        throw new APIError("Kullanıcı bulunamadı.", 404);
    }

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
    }

    if (currentPassword && newPassword) {
      const currentMatch = await bcrypt.compare(currentPassword, user.password);
      if (!currentMatch) throw new APIError("Mevcut şifre hatalı.",401);
      user.password = await bcrypt.hash(newPassword, 10);
    }

    user.name = name || user.name;
    user.lastname = lastname || user.lastname;

    if (req.file) {
        user.profileImage = "/public/uploads/" + req.file.filename;
    }

    await user.save();
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

module.exports = {
    updateProfile,
    getProfile
}
