require("express-async-errors")
const express = require("express")
const morgan = require("morgan")
const { errorHandler } = require("./middlewares/error")
const cors = require("cors")
require("dotenv").config()
require("./db")
const userRouter = require("./routes/user")
const actorRouter = require("./routes/actor")
const movieRouter = require("./routes/movie")
const reviewRouter = require("./routes/review")
const adminRouter = require("./routes/admin")
// const { handleNotFound } = require("./utils/helper");

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))
app.get("/", (req, res) => {
  res.send("Hello World!")
})
app.use("/api/user", userRouter)
app.use("/api/actor", actorRouter)
app.use("/api/movie", movieRouter)
app.use("/api/review", reviewRouter)
app.use("/api/admin", adminRouter)
// app.use("/*", handleNotFound);

app.use(errorHandler)

app.listen(8000, () => {
  console.log("the port is listening on port 8000")
})
