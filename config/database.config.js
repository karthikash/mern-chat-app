const mongoose = require('mongoose');

const { MONGO_CONFIG, MONGO_DB_URL } = require('./constants.config');

module.exports = (cb) => {
    const options = {
        keepAlive: 300000,
        connectTimeoutMS: 30000,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    };
    //const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = MONGO_CONFIG;
    mongoose.connection.openUri(MONGO_DB_URL, options, (err) => {
        if (err) {
            cb(err);
        }
        mongoose.Promise = global.Promise;
        global.ObjectId = mongoose.Types.ObjectId;
        cb(null);
    });
}