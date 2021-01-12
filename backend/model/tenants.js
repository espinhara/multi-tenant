const mongoose = require('mongoose')
const {tenants} = require('../connections')

const Schema = mongoose.Schema;

const tenantSchema = Schema({
    cnpj:String,
    nickname:String,
    strConnection:String,
    strCollection: String,
})

const tenant = tenants.model('tenant', tenantSchema)

module.exports={
    tenant
}