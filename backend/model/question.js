const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const questionSchema = Schema({
	question:String,
	description:String,
	date:String,
    //configuration:String,
    type:String,//multiple, single, text, email, number, yesno, script
    position:Number,
    choices:[{
        title:String,        
        next_question:{
            type: Schema.Types.ObjectId,
            ref: 'Question'
        },
        additional:{
            question:String,
            required:Boolean
        }
    }],
    research:{
        type: Schema.Types.ObjectId,
        ref: 'Research'
    },
    required:Boolean,
    maxlength:Number,
    showDescription:Boolean,
    numberMin:Number,
    numberMax:Number,
    redirectToEnd:Boolean,
})

module.exports = mongoose.model('Question', questionSchema)