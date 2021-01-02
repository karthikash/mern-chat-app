require('dotenv').config();

const constants = {
    "development": {
        NODE_ENV: process.env.NODE_ENV,
        CLIENT: process.env.CLIENT,
        HOST: process.env.HOST,
        PORT: process.env.PORT,
        AUTH: {
            JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
            JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN
        },
        MONGO_DB_URL: process.env.MONGO_DB_URL,
        API_VERSION: process.env.API_VERSION
    },
    "production": {
        NODE_ENV: process.env.NODE_ENV,
        CLIENT: process.env.CLIENT,
        HOST: process.env.HOST,
        PORT: process.env.PORT,
        AUTH: {
            JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
            JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN
        },
        MONGO_CONFIG: {
            DB_HOST: process.env.DB_HOST,
            DB_USER: process.env.DB_USER,
            DB_PASSWORD: process.env.DB_PASSWORD,
            DB_NAME: process.env.DB_NAME,
        },
        API_VERSION: process.env.API_VERSION
    }
};

module.exports = constants[process.env.NODE_ENV || "development"];