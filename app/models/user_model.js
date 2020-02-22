const mongoose = require('mongoose')
const validator = require("validator")
const bcryptjs = require("bcryptjs")
const Schema = mongoose.Schema

// user schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        minlength: 5,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value)
            },
            message: function () {
                return "invalid email format"
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 128,

    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tokens: [
        {
            token: {
                type: String
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
})

// encrypt the password using bcryptjs
userSchema.pre('save', function (next) {
    const user = this
    if (user.isNew) {
        bcryptjs.genSalt(10)
            .then(salt => {
                bcryptjs.hash(user.password, salt)
                    .then(encryptedPassword => {
                        user.password = encryptedPassword
                        next()
                    })
            })
    }
    else {
        next()
    }

})



const User = mongoose.model('User', userSchema)

module.exports = {
    User
}