require('dotenv').config();

const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const moment = require('moment');
const express = require('express');
const routes = require('../routes');
const constants = require('./constants.config');
const { json, urlencoded, } = require('body-parser');
const publicDirectoryPath = path.join(__dirname, '../public');
const clientDirectoryPath = path.join(__dirname, '../client/build');

module.exports = (app) => {

    // X-header protections
    app.use(helmet({
        contentSecurityPolicy: false
    }));

    // for parsing application/json
    app.use(json({
        limit: '500mb',
        extended: false
    }));

    // for parsing application/x-www-form-urlencoded
    app.use(urlencoded({
        limit: '500mb',
        extended: true,
        parameterLimit: 50000
    }));

    // for serving static files
    app.use(express.static(publicDirectoryPath));
    app.use(express.static(clientDirectoryPath));

    // logs every request to the console
    morgan.token('date', () => { return moment().format('DD-MM-YYYY HH:mm:ss'); });
    app.use(morgan(':date[Asia/Kolkata] - [ApiInfo] - info: :method - :url - :status - :res[content-length] - :response-time ms - :user-agent'));

    // CORS controllers
    app.use(cors({ origin: true, credentials: true }));
    app.use((_req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.header("Access-Control-Expose-Headers", "Authorization"); // for webgl support
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        next();
    });

    app.get('/health_check', (_req, res) => {
        return res.status(200).json({
            status: 200,
            message: 'Server health check passed'
        });
    });

    app.use(`/${constants.API_VERSION}`, routes);

    app.get('*',  (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
    });

    app.use((_req, res, _next) => {
        var err = new Error('OOPS! Invalid Route');
        err.status = 404;
        return res.send({
            status: err.status,
            message: err.message
        });
    });
}