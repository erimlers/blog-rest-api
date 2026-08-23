const router = require("express").Router();
const {register,login,verifyMail,logout,forgotPassword,resetPassword,refreshToken,cancelEmailChange} = require("./controller");
const authValidation = require("../../middlewares/validations/auth.validation");

router.post("/register",authValidation.register,register)

router.post("/login",authValidation.login,login)

router.post("/logout",logout)

router.get("/verify",verifyMail)

router.post("/forgot-password",forgotPassword)

router.post("/reset-password",resetPassword)

router.post("/refresh-token",refreshToken)

router.get("/cancel-email-change",cancelEmailChange)

module.exports = router;
