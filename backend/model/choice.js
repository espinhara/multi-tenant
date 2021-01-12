const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const choiceSchema = Schema({
	title:String,
    question:{
        type: Schema.Types.ObjectId,
        ref: 'Question'
    },
    next_question:{
        type: Schema.Types.ObjectId,
        ref: 'Question'
    },
})

module.exports = mongoose.model('Choice', choiceSchema)