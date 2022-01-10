const mongoose = require('mongoose');

const { MONGO_CONFIG, MONGO_DB_URL } = require('./constants.config');

module.exports = (cb) => {
    const options = {
        keepAlive: true,
        connectTimeoutMS: 30000,
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
    const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = MONGO_CONFIG;
    mongoose.connection.openUri(`mongodb+srv://${DB_USER}:<${DB_PASSWORD}>@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`, options, (err) => {
        if (err) {
            cb(err);
        }
        mongoose.Promise = global.Promise;
        global.ObjectId = mongoose.Types.ObjectId;
        cb(null);
    });
}