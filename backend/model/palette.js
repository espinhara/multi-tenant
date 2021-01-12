const mongo = require('mongoose')

const Schema = mongo.Schema;

const paletteSchema = Schema({
    name: String,
    maincolor: String,
    backcolor: String,
    textcolor: String
})

module.exports = mongo.model("Palette", paletteSchema)