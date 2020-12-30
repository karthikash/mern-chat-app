const appConfig = require('./app.config');
const constants = require('./constants.config');
const mongoConnection = require('./database.config');
const logger = require('./logger.config');

module.exports = {
    appConfig,
    constants,
    mongoConnection,
    logger
}