const joi = require("joi");
const APIError = require("../../utils/error");

class commentValidation{
    static createComment = async(req,res,next)=>{
        try {
            await joi.object({
                content:joi.string().trim().required().min(1).max(500).messages({
                    "string.base":"Yorum bir metin olmalıdır.",
                    "string.empty":"Yorum boş bırakılamaz.",
                    "string.min":"Yorum en az 1 karakter olmalıdır.",
                    "string.max":"Yorum en fazla 500 karakter olmalıdır.",
                    "any.required":"Yorum gereklidir."
                }),
                parentComment: joi.string().hex().length(24).optional().messages({
                    "string.base":"Üst yorum ID'si geçerli bir metin olmalıdır.",
                    "string.hex":"Üst yorum ID'si geçerli bir formatta olmalıdır.",
                    "string.length":"Üst yorum ID'si 24 karakter uzunluğunda olmalıdır."
                })
            }).validateAsync(req.body)

            next();

        } catch (error) {
            throw new APIError(error.details[0].message,400);
        }
    }
}

module.exports = commentValidation;