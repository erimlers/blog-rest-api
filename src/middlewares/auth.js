const jwt = require("jsonwebtoken");
const APIError = require("../utils/error");

const createToken = (user,expire_in) =>{
   const payload={id:user._id}

   return jwt.sign(payload,process.env.JWT_SECRET_KEY,{
      algorithm:"HS512",
       expiresIn:expire_in 
   });
}

const tokenCheck = (req,res,next) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        throw new APIError("Lütfen giriş yapınız. Token eksik.",401);
    }

    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.user = { 
            _id: decoded.id 
        };
        next();
    } catch {
        throw new APIError("Geçersiz veya süresi dolmuş token.",401);
    }

}

module.exports = {
    createToken,
    tokenCheck
}
