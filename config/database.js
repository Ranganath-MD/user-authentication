const mongoose = require("mongoose")

mongoose.Promise = global.Promise

//mongoose connection
mongoose.connect("mongodb://localhost:27017/auth", {
    // deprecation warnings below
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(() => {
        console.log("connected to db")
    })
    .catch(function () {
        console.log('something went wrong in DB connection')
    })

module.exports = {
    mongoose
}