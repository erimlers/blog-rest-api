const joi = require("joi");
const APIError = require("../../utils/error");

class authValidation{
    static register = async(req,res,next)=>{
        try {
            await joi.object({
                username:joi.string().trim().required().min(3).max(30).messages({
                    "string.base":"Kullanıcı adı bir metin olmalıdır.",
                    "string.empty":"Kullanıcı adı boş bırakılamaz.",
                    "string.min":"Kullanıcı adı en az 3 karakter olmalıdır.",
                    "string.max":"Kullanıcı adı en fazla 30 karakter olmalıdır.",
                    "any.required":"Kullanıcı adı gereklidir."
                }),
                name:joi.string().trim().required().min(2).max(50).messages({
                    "string.base":"İsim bir metin olmalıdır.",
                    "string.empty":"İsim boş bırakılamaz.",
                    "string.min":"İsim en az 2 karakter olmalıdır.",
                    "string.max":"İsim en fazla 50 karakter olmalıdır.",
                    "any.required":"İsim gereklidir."
                }),
                lastname:joi.string().trim().min(2).max(50).messages({
                    "string.base":"Soyisim bir metin olmalıdır.",
                    "string.empty":"Soyisim boş bırakılamaz.",
                    "string.min":"Soyisim en az 2 karakter olmalıdır.",
                    "string.max":"Soyisim en fazla 50 karakter olmalıdır.",
                }),
                email:joi.string().trim().email().required().messages({
                    "string.base":"Email bir metin olmalıdır.",
                    "string.empty":"Email boş bırakılamaz.",
                    "string.email":"Geçerli bir email adresi giriniz.",
                    "any.required":"Email gereklidir."
                }),
                password:joi.string().trim().required().min(6).max(100).messages({
                    "string.base":"Şifre bir metin olmalıdır.",
                    "string.empty":"Şifre boş bırakılamaz.",
                    "string.min":"Şifre en az 6 karakter olmalıdır.",
                    "string.max":"Şifre en fazla 100 karakter olmalıdır.",
                    "any.required":"Şifre gereklidir."
                })
            }).validateAsync(req.body)

            next();

        } catch (error) {
           throw new APIError(error.details[0].message,400);
        }
    }

    static login = async(req,res,next)=>{
        try {
           await joi.object({
                email:joi.string().trim().email().required().messages({
                    "string.base":"Email bir metin olmalıdır.",
                    "string.empty":"Email boş bırakılamaz.",
                    "string.email":"Geçerli bir email adresi giriniz.",
                    "any.required":"Email gereklidir."
                }),
                password:joi.string().trim().required().min(6).max(100).messages({
                    "string.base":"Şifre bir metin olmalıdır.",
                    "string.empty":"Şifre boş bırakılamaz.",
                    "string.min":"Şifre en az 6 karakter olmalıdır.",
                    "string.max":"Şifre en fazla 100 karakter olmalıdır.",
                    "any.required":"Şifre gereklidir."
                })
            }).validateAsync(req.body)

            next();

        } catch (error) {
           throw new APIError(error.details[0].message,400);
        }
    }
} 

module.exports = authValidation;