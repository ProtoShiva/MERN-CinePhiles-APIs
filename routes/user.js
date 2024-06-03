const express = require("express")
const {
  create,
  signIn,
  saveMovie,
  unSaveMovie,
  userDetails
} = require("../controllers/user")
const { isAuth } = require("../middlewares/auth")

const {
  userValidtor,
  validate,
  signInValidator
} = require("../middlewares/validator")

const router = express.Router()

router.post("/create", userValidtor, validate, create)
router.post("/sign-in", signInValidator, validate, signIn)
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
