const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const GeoLocation = new Schema({
    type:{
        type:String,
        default:"Point",
    },
    cordinates:{ 
        type:[Number],
        index:"2dsphere",
    },

})

const researchSchema = Schema({
	title:String,
	type:String,
	description:String,
	status:String,
	published:Boolean,
	closed:Boolean,
	deleted:Boolean,
	date:Date,
	owner:{
        type: Schema.Types.ObjectId,
        ref: 'User'
	},
	font:{
		type: Schema.Types.ObjectId,
		ref:'Font'
	},
	palette:{
		type: Schema.Types.ObjectId,
		ref:'Palette'
	},
	users:[{ 
		type: Schema.Types.ObjectId,
		ref:'User' 
		}],
	category:{
        type: Schema.Types.ObjectId,
        ref: 'Category'
	},
	params:[{type:String}],
	webHook:String,
	webHookEnabled:Boolean,
	googleAnalytics:String,
	googleAnalyticsEnabled:Boolean,
	geolocation:Boolean,
})

module.exports = mongoose.model('Research', researchSchema)