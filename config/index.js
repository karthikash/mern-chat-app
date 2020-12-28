const appConfig = require('./app.config');
const constants = require('./constants.config');
const mongoConnection = require('./database.config');
const logger = require('./logger.config');
const redis = require('./redis.config');

module.exports = {
    appConfig,
    constants,
    mongoConnection,
    logger,
    redis
}