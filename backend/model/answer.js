
const mongoose = require('mongoose')
const {develop, testblueform} = require('../../connections');
const Schema = mongoose.Schema;

const answerSchema = Schema({
	answer:String,
	answers:[String],
	date:Date,
	research:{
		type: Schema.Types.ObjectId,
		ref:'Research'
	},
	question:{
        type: Schema.Types.ObjectId,
        ref: 'Question'
	},
	respondent:{
		type: Schema.Types.ObjectId,
		ref:'Respondent'
	},
})

const devAnswer = develop.model('Answer', answerSchema)

module.exports ={
	devAnswer
}