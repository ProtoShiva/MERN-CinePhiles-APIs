const express = require("express")
const {
  create,
  verifyEmail,
  resendEmailVerificationToken,
  forgetPassword,
  sendResetPasswordTokenStatus,
  resetPassword,
  signIn,
  saveMovie,
  unSaveMovie,
  userDetails
} = require("../controllers/user")
const { isAuth } = require("../middlewares/auth")
const { isValidPassResetToken } = require("../middlewares/user")
const {
  userValidtor,
  validate,
  validatePassword,
  signInValidator
} = require("../middlewares/validator")

const router = express.Router()

router.post("/create", userValidtor, validate, create)
router.post("/sign-in", signInValidator, validate, signIn)
router.post("/verify-email", verifyEmail)
router.post("/resend-email-verification-token", resendEmailVerificationToken)
router.post("/forget-password", forgetPassword)
router.post(
  "/verify-pass-reset-token",
  isValidPassResetToken,
  sendResetPasswordTokenStatus
)
router.post(
  "/reset-password",
  validatePassword,
  validate,
  isValidPassResetToken,
  resetPassword
)
router.get("/is-auth", isAuth, (req, res) => {
  const { user } = req
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      role: user.role,
      saved: user.saved
    }
  })
})
router.get("/userDetails", isAuth, userDetails)

router.put("/saveMovie", isAuth, saveMovie)
router.put("/unSaveMovie", isAuth, unSaveMovie)

module.exports = router
