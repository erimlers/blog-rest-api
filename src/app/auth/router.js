const router = require("express").Router();
const {register,login,verifyMail,logout,forgotPassword,resetPassword} = require("./controller");
const authValidation = require("../../middlewares/validations/auth.validation");

router.post("/register",authValidation.register,register)

router.post("/login",authValidation.login,login)

router.post("/logout",logout)

router.get("/verify",verifyMail)

router.post("/forgot-password",forgotPassword)

router.post("/reset-password",resetPassword)

module.exports = router;
