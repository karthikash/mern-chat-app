/**
 * @author [Karthik Ashokkumar]
 * @email [karthikashokumar@gmail.com]
 * @create date 2020-12-24 19:13:21
 * @modify date 2022-01-10 11:13:11
 * @desc [Chat application backend entry point]
 */

// required libraries
'use strict';

require('dotenv').config();

const fs = require('fs');
const http = require('http');
const express = require('express');
const { logger, constants, mongoConnection, appConfig, socketio } = require('./config');

/**
 * app instance from express framework
 * global middleware for app instance
 */
const app = express();
appConfig(app);
const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer, { cors: { origin: '*' } });
socketio(io);

const publicPath = './public';
const uploadPath = './public/uploads';

if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath);
}

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}


// establishing database connection
mongoConnection((err) => {
    if (err) {
        logger.error(err.stack);
        process.exit(1);
    }
    logger.info('Database is connected');
    httpServer.listen(constants.PORT, () => {
        logger.info(`Server is running at port ${constants.PORT}`);
    });
    // initializing global variables
    global.logger = logger;
    global.constants = constants;
});