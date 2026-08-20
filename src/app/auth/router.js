const router = require("express").Router();
const {register,login,verifyMail,logout} = require("./controller");
const authValidation = require("../../middlewares/validations/auth.validation");

router.post("/register",authValidation.register,register)

router.post("/login",authValidation.login,login)

router.post("/logout",logout)

router.get("/verify",verifyMail)

module.exports = router;
