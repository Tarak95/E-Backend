const User = require('../models/userModel')


let existingData = async (res, findData) => {
    let existingUser = await User.findOne(findData)

    if (existingUser) {
        // res.send({ message: "User already exist" })

        return true;
    }
    else {
        return false;
    }


}

module.exports = existingData