'use strict';

// Internal modules
const logger = require('../../config/logger');

/* istanbul ignore next */
module.exports = (loggerId, queue) => {
  logger.info(loggerId,  process.env.NODE_ENV + ' shutting down');
  process.exit();
};
