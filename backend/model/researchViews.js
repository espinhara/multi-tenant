const mongoose = require('mongoose');
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

const researchViewsSchema = new Schema({
    ip:String,
    system: String,
    browser:String,
    geolocation:{
        latitude:Number,
        longitude:Number,
    },
    /*geolocation:{
        type:GeoLocation,
        index: '2dsphere'
    },*/
    city:String,
    country_name:String,
    region:String,
    region_code:String,
    research: {
        type: Schema.Types.ObjectId,
        ref: 'Research'
    },
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
    },
}, {timestamps:true})

module.exports = mongoose.model('ResearchViews', researchViewsSchema)