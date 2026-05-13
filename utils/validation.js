
let emptyFieldValidation = (res, ...fields) => {
    if (fields.includes('') || fields.includes(undefined)) {
        return res.send({ message: "Please fill all the field" })
    }
}
module.exports = { emptyFieldValidation }