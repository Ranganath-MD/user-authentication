const express = require("express")
const router = express.Router()
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { User } = require("../models/user_model")
const { authenticateUser } = require("../middlewares/authenticateUser")

// register user
router.post('/register', function (req, res) {
    const body = req.body
    User.findOne({ username: body.username })
        .then(user => {
            if (user) {
                res.send({ message: "user already exists" })
            } else {
                const user = new User(body)
                user.save()
                    .then(user => {
                        res.send(user)
                    })
                    .catch(err => {
                        res.send(err.message)
                    })
            }
        })

})

// user login
router.post("/login", (req, res) => {
    const body = req.body
    // before login, find the user with email and generate a token
    User.findOne({ email: body.email })
        .then(user => {
            if (!user) {
                res.send({ message: "invalid email / password" })
            } else {
                bcryptjs.compare(body.password, user.password)
                    .then(result => {
                        if (result) {
                            const tokenData = {
                                _id: user._id,
                                username: user.username,
                                createdAt: Number(new Date())
                            }
                            const token = jwt.sign(tokenData, "auth")
                            user.tokens.push({ token })
                            user.save()
                                .then(user => {
                                    const user_details = {
                                        username: user.username,
                                        email: user.email,
                                        token: token
                                    }
                                    res.send(user_details)
                                })
                                .catch(err => {
                                    res.send(err)
                                })
                        }
                    })
            }
        })
})

// user details
router.get("/account", authenticateUser, (req, res) => {
    const { user } = req
    res.send({
        _id: user.id,
        username: user.username,
        email: user.email,
    })
})

//user logout
//remove token 
router.delete("/logout", authenticateUser, (req, res) => {
    const { user, token } = req
    User.findByIdAndUpdate(user._id, { $pull: { tokens: { token: token } } })
        .then(() => {
            res.send({ message: "Successfully logged out" })
        })
        .catch(err => {
            res.send(err)
        })
})


module.exports = {
    userRouter: router
}