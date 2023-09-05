
const UserModel = require('../Models/userModels')
const bcrypt = require('bcrypt')

//Registering a new User
module.exports.registerUser = async (req, res) => {
    const { email, password, firstname, lastname } = req.body;

    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(password, salt)

    const newUser = new UserModel({
        email,
        password: hashedPass,
        firstname,
        lastname
    })

    try {
        await newUser.save()
        res.status(200).json(newUser)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


// login User

module.exports.loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await UserModel.findOne({ email: email })

        if (user) {
            const validity = await bcrypt.compare(password, user.password)

            validity ? res.status(200).json(user) : res.status(400).json("wrong Password")
        }
        else {
            res.status(404).json("User does not exists")
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}