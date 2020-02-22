const express = require("express")
const port = 3005
const app = express()
const { mongoose } = require("./config/database")
const { userRouter } = require("./app/controllers/users_controller")

//to parse the incoming request with JSON payload
app.use(express.json())

//initializing routes 
app.use("/users", userRouter)


app.listen(port, () => {
    console.log("listening on the port ", port)
})