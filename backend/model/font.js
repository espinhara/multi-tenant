const mongo = require('mongoose')

const Schema = mongo.Schema;

const fontSchema = Schema({
    name: String,
    family: String,
})

module.exports = mongo.model("Font", fontSchema)