const User = require('../models/userModel')

let getAllUsersController = async (req, res) => {

     let userData = await User.find({})
     res.send({
          message: "All user Data",
          userdata
     })

}



let singleUserDataController = async (req, res) => {
     let { id } = req.params
     let userData = await User.findById(id)
     res.send({
          message: `${userData.email} data`,
          userdata
     })
}

let deleteUserController = async (req, res) => {
     let { id } = req.params
     let userData = await User.findByIdAndDelete(id)
     res.send({
          message: `User deleted`,
     })
}

let updateUserController = async (req, res) => {
     const { id } = req.params

     let userData = await User.findByIdAndUpdate({ _id: id }, req.body, { new: true })

     res.send({
          message: `User updated`,
     })
}


module.exports = {getAllUsersController,singleUserDataController,deleteUserController,updateUserController}