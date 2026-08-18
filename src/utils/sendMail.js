const nodeMailer = require("nodemailer");
const APIError = require("./error");

const transporter = nodeMailer.createTransport({
    service:"gmail",
    auth:{ user:process.env.EMAIL_USER, pass:process.env.EMAIL_PASSWORD }
});

const sendMail = async (mailOptions)=>{
    try {
        await transporter.sendMail(mailOptions);
    } catch {
        throw new APIError("E-posta gönderimi sırasında bir hata oluştu.",500);
    }
}

module.exports = sendMail;