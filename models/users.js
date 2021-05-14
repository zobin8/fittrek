const mongoose = require('mongoose');
const findOrCreate = require('mongoose-find-or-create')

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
UserSchema.plugin(findOrCreate)

module.exports = User = mongoose.model("users", UserSchema);
