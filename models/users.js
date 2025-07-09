const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        openid: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            default: "User"
        },
        lastsync: {
            type: Number,
            default: 0
        },
        token: {
            type: String
        },
        distance: {
            type: Number,
            default: 0
        }
    }
);

module.exports = mongoose.model("users", UserSchema);
