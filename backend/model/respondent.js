
const mongoose = require('mongoose');
const { count } = require('./user');

const Schema = mongoose.Schema;

/*const GeoLocation = new Schema({
    type:{
        type:String,
        enum:['Point'],
        required:true
    },
    coordinates:{
        type:[Number],
        required:true,
        
    }
})*/

const respondentSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    research: {
        type: Schema.Types.ObjectId,
        ref: 'Research'
    },
    ip:String,
    system: String,
    browser:String,
    geolocation:{
        latitude:Number,
        longitude:Number,
    },
    city:String,
    country_name:String,
    region:String,
    region_code:String,
    address:{
        road:String,
        neighbourhood:String,
        suburb:String,
        city_district:String,
        city:String,
        county:String,
        state:String,
        postcode:String,
        country:String,
    }
    
}, {timestamps:{createdAt:'createdAt'}})

module.exports = mongoose.model('Respondent', respondentSchema)