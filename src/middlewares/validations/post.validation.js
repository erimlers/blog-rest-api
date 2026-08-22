const joi = require("joi");
const APIError = require("../../utils/error");

class postValidation {
    static create = async (req, res, next) => {
        try {
            await joi.object({
                title: joi.string().trim().required().min(3).max(100).messages({
                    "string.base": "Başlık bir metin olmalıdır.",
                    "string.empty": "Başlık boş bırakılamaz.",
                "string.min":"Başlık en az 3 karakter olmalıdır.",
                "string.max":"Başlık en fazla 100 karakter olmalıdır.",
                "any.required":"Başlık gereklidir."
            }),
            content:joi.string().trim().required().min(10).messages({
                "string.base":"İçerik bir metin olmalıdır.",
                "string.empty":"İçerik boş bırakılamaz.",
                "string.min":"İçerik en az 10 karakter olmalıdır.",
                "any.required":"İçerik gereklidir."
            }),
            tags: joi.array().items(joi.string().trim()).single().messages({
                "array.base": "Etiketler bir dizi olmalıdır.",
                "array.items": "Etiketler bir metin olmalıdır."
            })  
        }).validateAsync(req.body)

        next();

    } catch (error) {
      throw  new APIError(error.details[0].message,400);
    }
  }

  static update = async (req, res, next) => {
    try {
        await joi.object({
                title: joi.string().trim().min(3).max(100).messages({
                    "string.base": "Başlık bir metin olmalıdır.",
                    "string.empty": "Başlık boş bırakılamaz.",
                "string.min":"Başlık en az 3 karakter olmalıdır.",
                "string.max":"Başlık en fazla 100 karakter olmalıdır.",
            }),
            content:joi.string().trim().min(10).messages({
                "string.base":"İçerik bir metin olmalıdır.",
                "string.empty":"İçerik boş bırakılamaz.",
                "string.min":"İçerik en az 10 karakter olmalıdır.",
            }),
            tags: joi.array().items(joi.string().trim()).single().messages({
                "array.base": "Etiketler bir dizi olmalıdır.",
                "array.items": "Etiketler bir metin olmalıdır."
            })  
        }).validateAsync(req.body)
    } catch (error) {
       throw new APIError(error.details[0].message,400);
    }
    next();
  }

  static delete = async (req, res, next) => {
    try {
         await joi.object({
               postId:joi.string().trim().required().messages({
                "string.base":"Post ID bir metin olmalıdır.",
                "string.empty":"Post ID boş bırakılamaz.",
                "any.required":"Post ID gereklidir."
            })
        }).validateAsync(req.params)
    } catch (error) {
        throw new APIError(error.details[0].message,400);
    }
    next();
  }

}

module.exports = postValidation;