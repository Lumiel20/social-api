const UserModel = require('../Models/userModels')
const bcrypt = require('bcrypt')


// get a user
module.exports.getUser = async (req, res) => {
    const id = req.params.id

    try {
        const user = await UserModel.findById(id)

        if (user) {

            const { password, ...otherDetails } = user._doc
            res.status(200).json(otherDetails)
        }
        else {
            res.status(404).json("No such user exists")
        }
    } catch (error) {
        res.status(500).json(error)
    }
};


//update a user
module.exports.updateUser = async (req, res) => {
    const id = req.params.id
    const { currentUserId, currentUserAdminStatus, password } = req.body

    if (id === currentUserId || currentUserAdminStatus) {
        try {
            if (password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, salt)
            }

            const user = await UserModel.findByIdAndUpdate(id, req.body, {
                new: true,
            })

            res.status(200).json(user)
        } catch (error) {
            res.status(500).json(error)
        }
    }
    else {
        res.status(403).json("Access Denied! you can only update your own profile")
    }
};


//Delete user
module.exports.deleteUser = async (req, res) => {
    const id = req.params.id

    const { currentUserId, currentUserAdminStatus } = req.body

    if (currentUserId === id || currentUserAdminStatus) {

        try {
            await UserModel.findByIdAndDelete(id)
            res.status(200).json("User deleted successfully")
        } catch (error) {
            res.status(500).json(error)
        }
    }
    else {
        res.status(403).json("Access Denied! you can only delete your own profile")
    } 
}

//Follow User
module.exports.followUser = async (req, res) => {
    const id = req.params.id

    const { currentUserId } = req.body

    if (currentUserId === id) {
        res.status(403).json("Action forbidden")
    }
    else {
        try {
            const followUser = await UserModel.findById(id)
            const followingUser = await UserModel.findById(currentUserId)

            if (!followUser.followers.includes(currentUserId))
             {
                await followUser.update.updateOne({ $push : { followers: currentUserId } })
                await followingUser.update.updateOne({ $push : { following: id } })
                res.status(200).json("User followed!")
            } else {
                res.status(403).json("User is already followed by you")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
}


//UnFollow User
module.exports.UnFollowUser = async (req, res) => {
    const id = req.params.id

    const { currentUserId } = req.body

    if (currentUserId === id) {
        res.status(403).json("Action forbidden")
    }
    else {
        try {
            const followUser = await UserModel.findById(id)
            const followingUser = await UserModel.findById(currentUserId)

            if (followUser.followers.includes(currentUserId)) {
                await followUser.update.updateOne({ $pull: { followers: currentUserId } })
                await followingUser.update.updateOne({ $pull: { following: id } })
                res.status(200).json("User Unfollowed")
            } else {
                res.status(403).json("User is not followed by you")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
}
