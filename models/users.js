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
        token: {
            type: String
        },
        total_distance: {
            type: Number,
            default: 0
        },
        distance: {
            type: Number,
            default: 0
        }
    }
);

module.exports = mongoose.model("users", UserSchema);
