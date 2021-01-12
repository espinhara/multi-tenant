const mongoose = require('mongoose');
function makeNewConnection(uri) {
    const db = mongoose.createConnection(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });

    db.on('error', function (error) {
        console.log(`MongoDB :: connection ${this.name} ${JSON.stringify(error)}`);
        db.close().catch(() => console.log(`MongoDB :: failed to close connection ${this.name}`));
    });

    db.on('connected', function () {
        mongoose.set('debug', function (col, method, query, doc) {
            console.log(`MongoDB :: ${this.conn.name} ${col}.${method}(${JSON.stringify(query)},${JSON.stringify(doc)})`);
        });
        console.log(`MongoDB :: connected ${this.name}`);
    });

    db.on('disconnected', function () {
        console.log(`MongoDB :: disconnected ${this.name}`);
    });

    return db;
}

//this is uri's

const testblueform = makeNewConnection('mongodb+srv://espinhara:loobMZx5zzXUcIuv@cluster0.jlmms.mongodb.net/test-blueform?authSource=admin&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true');
const develop = makeNewConnection('mongodb+srv://espinhara:loobMZx5zzXUcIuv@cluster0.jlmms.mongodb.net/development?authSource=admin&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true');
const tenants = makeNewConnection('mongodb+srv://espinhara:loobMZx5zzXUcIuv@cluster0.jlmms.mongodb.net/operators-test?authSource=admin&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true');
const users = makeNewConnection('mongodb+srv://blueforms:N6fQxVsRmzKA2qgm@dev01.mz2es.azure.mongodb.net/blueforms-users');

module.exports = {
    testblueform,
    develop,
    tenants,
    users,
};