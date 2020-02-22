const { User } = require("../models/user_model")
const jwt = require("jsonwebtoken")

// middleware function to authenticate routes
const authenticateUser = (req, res, next) => {
    const token = req.header("x-auth")
    let tokenData
    try {
        // verify the token with secret key
        tokenData = jwt.verify(token, "auth")
    } catch (err) {
        return Promise.reject(err)
    }

    User.findOne({
        _id: tokenData._id,
        "tokens.token": token
    })
        .then(user => {
            if (user) {
                req.user = user
                req.token = token
                next()
            } else {
                res.status("401").send({ message: "token not available"})
            }
        })
}

module.exports = {
    authenticateUser
}