const User = require('../models/userModel')

let getAllUsersController = async (req, res) => {
    try {
        let userData = await User.find({ isDelete: { $ne: true } })
        res.status(200).send({
            message: "All user Data",
            userData
        })
    } catch (error) {
        res.status(500).send({ message: "Server Error", error: error.message })
    }
}

let singleUserDataController = async (req, res) => {
    try {
        let { id } = req.params
        let userData = await User.findById(id).select('-password')
        res.status(200).send({
            message: `${userData.email} data`,
            userData
        })
    } catch (error) {
        res.status(500).send({ message: "Server Error", error: error.message })
    }
}

let deleteUserController = async (req, res) => {
    try {
        let { id } = req.params
        let userData = await User.findByIdAndUpdate(
            id,
            { isDelete: true },
            { new: true }
        )

        res.status(200).send({
            message: `User deleted successfully`,
            userData
        })
    } catch (error) {
        res.status(500).send({ message: "Server Error", error: error.message })
    }
}

let updateUserController = async (req, res) => {
    try {
        const { id } = req.params
        let userData = await User.findByIdAndUpdate(id, req.body, { new: true })

        res.status(200).send({
            message: `User updated`,
            userData
        })
    } catch (error) {
        res.status(500).send({ message: "Server Error", error: error.message })
    }
}

module.exports = { getAllUsersController, singleUserDataController, deleteUserController, updateUserController }