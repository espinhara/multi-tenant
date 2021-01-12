const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const blockSchema = Schema({
	title:String,
    question:{
        type: Schema.Types.ObjectId,
        ref: 'Question'
    },
   
})

module.exports = mongoose.model('Block', blockSchema)