const mongoose = require('mongoose')
const {develop, testblueform, users} = require('../connections');
const Schema = mongoose.Schema;

const userSchema = Schema({
	name:String,
	email:String,
	password:String,
	type:Number,
	status:String,
	recoverKey:String,
	deleted:Boolean,
	blocked:Boolean,
	dev:Boolean
})

const development = develop.model('User', userSchema);
const test_blueform = testblueform.model('User', userSchema);
const userDB = users.model('User', userSchema);

module.exports = {
    development,
	test_blueform,
	userDB,
};