'use strict';

require('dotenv').load({silent: true});

// External modules
const throng = require('throng');
const logger = require('winston');
const memwatch = require('memwatch-next'); //TODO: Remove in production

/* istanbul ignore next */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Our modules
const config = require('./config/config');
const queue = require('./app/services/queues.server.service');
const spoor = require('./app/services/spoor.server.services');
const NoMessageInQueue = require('./app/errors/noMessageInQueue.server.error');

logger.level = config.logLevel;

const loggerId = 'WORKER:' + process.pid;

//TODO: Remove in production
let hd; //HeapDiff

logger.level = config.logLevel;

throng(start, {
    workers: config.workers,
    lifetime: Infinity
});

function start () {

    //TODO: Remove in production
    memwatch.on('stats', function(stats) {

        console.error('Worker GC:');
        console.error(stats);

        if (!hd) {
            hd = new memwatch.HeapDiff();
        } else {
            let diff = hd.end();
            console.error(diff.change.details);
            hd = null;
        }
    });

    logger.info(loggerId,  process.env.NODE_ENV + ' worker started');

    process.on('SIGTERM', shutdown);

    forever(moveToSpoor).then(undefined).catch((err) => {

        logger.error(loggerId, err);
        shutdown();

    });

    // TODO: move to app/utils
    // Helper function to have an infinite loop using Promises
    function forever (fn) {
        return fn().then(() => {
            return forever(fn);  // re-execute if successful
        });
    }

    // TODO: move to app/utils
    function moveToSpoor() {

        logger.verbose(loggerId,  'Looking for new messages to move');

        let lastMessageFound;

        return new Promise((fulfill, reject) => {

            queue.pullFromQueue()
                .then((data) => {
                    logger.verbose(loggerId, 'Message retrieved from the queue');
                    lastMessageFound = data;
                    return spoor.send(lastMessageFound.body);
                })
                .then(() => {
                    return queue.deleteFromQueue(lastMessageFound.receiptHandle);
                })
                .then(() => {
                    logger.verbose(loggerId,  'Message moved to Spoor');
                    lastMessageFound = null;
                    fulfill();
                })
                .catch(function (error) {
                    // If there are no messages queued we want to try again
                    if (error instanceof NoMessageInQueue) {
                        logger.info(loggerId, error.message);
                        fulfill();
                    }
                    // If any other error happens, we want the loop to end
                    else {
                        reject(error);
                    }

                });
        });

    }

    // TODO: move to app/utils
    function shutdown() {
        logger.info(loggerId,  process.env.NODE_ENV + ' worker shutting down');
        process.exit();
    }

}
