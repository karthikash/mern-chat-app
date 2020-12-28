const redis = require('redis')

const constants = require('./constants.config')

const createConnection = () => {
    const retryStrategy = (options) => {
        logger.debug(options)
        if (options.error) {
            if (options.error.code == 'ECONNREFUSED') {
                // End reconnecting on a specific error and flush all commands with
                // a individual error
                return new Error('Redis service refused the connection')
            } else if (options.error.code == 'CLUSTERDOWN') {
                // End reconnecting on a specific error and flush all commands with
                // a individual error
                return new Error('Redis cluster is down')
            }
        }
        logger.debug(`Already spent ${options.total_retry_time} milliseconds to re-establish the connections with redis`)
        if (options.total_retry_time > 1000 * 60 * 60 * 6) {
            // End reconnecting after a specific timeout and flush all commands
            // with a individual error
            return new Error('Retry time exhausted')
        }
        if (options.attempt > 120) {
            // End reconnecting with built in error
            return undefined
        }
        // reconnect after
        return Math.min(options.attempt * 100, 3000)
    }
    constants.REDIS_CONFIG.PORT['retry_strategy'] = retryStrategy

    const client = redis.createClient(constants.REDIS_CONFIG.REDIS_PORT)

    client.on('error', (error) => {
        logger.error('Unable to establish a redis connection', JSON.stringify(error))
    })

    client.on('connect', () => {
        logger.info('Redis connection established')
    })
    return client
}

module.exports = { createConnection };