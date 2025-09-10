const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    fullName: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
        }
    },
    role: {
        type: String,
        enum: [ "seller", "user" ],//enum is used to restrict the value of a field to a specific set of values in simple terms it is used to define a set of allowed values for a field
        default: "user"
    },
    password: {
        type: String,
        select: false
    }
})

const userModel = mongoose.model("user", userSchema)

module.exports = userModel