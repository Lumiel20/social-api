const mongoose = require('mongoose')

const UserSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true   
        },
        isAdmin: {
            type: Boolean,
            default: false   
        },
        profilPicture: String,
        coverPicture: String,
        about: String,
        livesin: String,
        workAt: String,
        relationship: String,
        followers: [],
        followings: [] 
    },
    {
        timestamps: true
    }
)


module.exports = mongoose.model("Users", UserSchema)
  //const UserModel = mongoose.model("Users", UserSchema)
//export default UserModel