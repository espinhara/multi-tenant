const express = require('express');
const {test_blueform, development, userDB} = require('./model/user');
const {tenant} = require('./model/tenants')
const crypto = require('crypto')
const cert = require('crypto').Certificate();
const types = require('mongoose').Types
const cors = require('cors')
const app = express();

app.use(cors())
const tenantId = '5fc7898a9a19397636f135b6'
const userEmail = 'gabriel.espinhara@blueforms.it'
const  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmOTM1NDcyOTk0MWI5NTZhZDAwNzY3YSIsImZ1bGxOYW1lIjoiR2FicmllbCBFc3BpbmhhcmEgZGEgU2lsdmEiLCJlbWFpbCI6ImdhYnJpZWwuZXNwaW5oYXJhQGJsdWVjb3JlLml0Iiwic3RhdHVzIjoidHJ1ZSIsInR5cGUiOjEsImRldiI6dHJ1ZSwiaWF0IjoxNjA5NDE0MjY5fQ.-LjzHpceIZ35i0aZUpfZKLNTrSi5FzbILLJYJXrCGdY'

var getSHA256ofJSON =  function(input){
    return crypto.createHash('sha256').update(JSON.stringify(input)).digest('hex')
}
const sha1 =  getSHA256ofJSON(userEmail+tenantId+token)
console.log(sha1)
const getSha1 = '5b0f5eab9bf64ed1b7fce278d52bed0278b6d34bf2c9b5b9a9cda1b107cda847'

function validSha1(sha1, shaRequired){
    if(sha1 == shaRequired){
        return true
    }else{
        false
    }
}
const isValid = validSha1(sha1, getSha1)
console.log(isValid)


//USERS BASE test-blueform
app.get('/test-blueform/users', async (req, res) => {
    const test = await test_blueform.find({});
    res.json(test);
});
//GET USER BY ID BASE test-blueform
app.get('/test-blueform/users/:id', async (req, res) => {
    const _id = req.params.id
    const testById = await test_blueform.findById({_id});

    res.json(testById);
});
//LIST ALL TENANT
app.get('/tenant', async (req, res)=>{
    const tenants = await tenant.find({})   
    var newTenant = tenants.slice()
    // newTenant.concat(tenants.map(res =>{
    //     return {_id:res._id, nickname: res.nickname, strCollection: res.strCollection}
    // }));
    res.send(newTenant)
})
//GET TENANT BY ID
app.get('/tenant/:id', async (req, res)=>{
    const _id = req.params.id
    const tenants = await tenant.findById({_id})
    res.json(tenants)
})
//USERS BASE DEVELOPMENT
app.get('/development/users', async (req, res) => {
    const dev = await development.find({});

    res.json(dev);
});
app.get('/development/users/:id', async (req, res) => {
    const _id = req.params.id
    const dev = await development.findById({_id});
    res.json(dev);
});
//AGGREGATE USERS BY TENANTS
app.get('/users/:tenant_id', async (req, res) => {
    const tenant_id = req.params.tenant_id
    const user = await userDB.aggregate([
        {$unwind:"$operators"}
        ,{$match:{"operators._id": types.ObjectId(tenant_id)}}
        ]);

    res.json(user);
});

const port = process.env.PORT || 3333;
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
// const io = require('socket.io')(app, {
//     transports: ['websocket', 'polling']
//   })