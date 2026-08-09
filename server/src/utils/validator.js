const mongoose = require("mongoose")

const isValid = (value) => {
    if (typeof value === "undefined" || value === "null") return false
    if (typeof value === "string" && value.trim().length === 0) return false
    if (typeof value === "number" && isNaN(value)) return false

    return true
}

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)

const isValidName = (input) => /^[a-zA-Z ]{2,}$/.test(input)
const isValidCategoryName = (input) => /^[a-zA-Z ]{2,}$/.test(input)


const isValidEmail = (input) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input)

const isValidContact = (input) => /^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/.test(input)

const isValidPassword = (input) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,20}$/.test(input)



module.exports = { isValid, isValidName, isValidEmail, isValidContact, isValidPassword, isValidObjectId, isValidCategoryName }