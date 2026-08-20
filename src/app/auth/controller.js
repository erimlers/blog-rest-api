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

    return new Response({username,email},"Kayıt başarılı. Doğrulama e-postası adresinize gönderildi.").created(res);
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

    const token = createToken(user,"7d");

    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return new Response({
        user: { id: user._id, name: user.name, email: user.email }
    }, "Giriş başarılı.").success(res);
}

const logout = async(req,res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
    return new Response(null, "Çıkış başarılı.").success(res);
}

module.exports = {
    register,
    verifyMail,
    login,
    logout
}
