const jwt = require("jsonwebtoken")
const User = require("../models/user")
const { sendError } = require("../utils/helper")

exports.create = async (req, res) => {
  const { name, email, password } = req.body

  const oldUser = await User.findOne({ email })

  if (oldUser) return sendError(res, "This email is already in use!")

  const newUser = new User({ name, email, password })
  await newUser.save()

  res.status(201).json({
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email
    }
  })
}

exports.signIn = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) return sendError(res, "Email/Password mismatch!")

  const matched = await user.comparePassword(password)
  if (!matched) return sendError(res, "Email/Password mismatch!")

  const { _id, name, role, isVerified, saved } = user

  const jwtToken = jwt.sign({ userId: _id }, process.env.JWT_SECRET)

  res.json({
    user: { id: _id, name, email, role, token: jwtToken, isVerified, saved }
  })
}

//save a movie to Watchlist logic
exports.saveMovie = async (req, res) => {
  const { productId } = req?.body
  const id = req?.user?._id

  const targetUser = await User.findById(id)
  const savedLog = targetUser?.saved?.map((prod) => {
    return prod?._id
  })

  const isSaved = targetUser?.saved?.includes(productId)
  if (isSaved) throw new Error("Already Saved this Movie!")

  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        $push: { saved: productId }
      },
      { new: true }
    )

    const updatedUser = await User.findById(id).populate("saved")

    //send the status code and user
    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    })
  }
}

//unsave a movie to Watchlist logic
exports.unSaveMovie = async (req, res) => {
  const { productId } = req?.body
  const id = req?.user?._id

  const targetUser = await User.findById(id)
  const savedLog = targetUser?.saved?.map((prod) => {
    return prod?._id
  })

  const isSaved = targetUser?.saved?.includes(productId)

  try {
    if (isSaved) {
      const user = await User.findByIdAndUpdate(
        id,
        {
          $pull: { saved: productId }
        },
        { new: true }
      )

      const updatedUser = await User.findById(id).populate("saved")

      res.status(200).json(updatedUser)
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    })
  }
}

//user details
exports.userDetails = async (req, res) => {
  const id = req?.user?._id
  try {
    const user = await User.findById(id).select("-password").populate("saved")
    res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    })
  }
}
