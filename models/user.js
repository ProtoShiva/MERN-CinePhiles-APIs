const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: "user",
    enum: ["admin", "user"]
  },
  saved: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie"
      }
    ]
  }
})

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10)
  }

  next()
})

userSchema.methods.comparePassword = async function (password) {
  const result = await bcrypt.compare(password, this.password)
  return result
}

module.exports = mongoose.model("User", userSchema)
