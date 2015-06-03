'use strict';

// External modules
require('dotenv').load({silent: true});
const logger = require('winston');

/* istanbul ignore next */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Our modules
const config = require('./config/config');
const express = require('./config/express');

const loggerId = 'SERVER:' + config.processId;

logger.level = config.logLevel;

let app = express();

app.listen(config.port);

module.exports = app;

logger.info(loggerId, process.env.NODE_ENV + ' server running at http://localhost:' + config.port);