'use strict';

function int(str) {
  if (!str) {
    return 0;
  }
  return parseInt(str, 10);
}

const port = process.env.PORT || 1338;
const logLevel = process.env.LOG_LEVEL || 'warn';
const rabbitUrl =  process.env.CLOUDAMQP_URL || 'amqp://localhost';
const eventQueue = 'events.pending';
const batchQueue = 'batch.pending';
const eventPrefetchLimit = int(process.env.EVENT_PREFETCH_LIMIT) || 100;
const batchPrefetchLimit = int(process.env.BATCH_PREFETCH_LIMIT) || 1;
const spoorPostUrl = 'https://spoor-api.ft.com/ingest';
const workers = process.env.WEB_CONCURRENCY || 1;
const processId = process.env.DYNO || process.pid;
const userListsEndpoint = 'https://localhost:1337';
const authUser = process.env.AUTH_USER || 'test';
const authPassword = process.env.AUTH_PASSWORD || 'test';
const dataConsistencyPostUrl =  'https://di5p505om8.execute-api.eu-west-1.amazonaws.com/dev';
const db = process.env.MONGOHQ_URL || 'mongodb://localhost/ft-email-analytics-test';


module.exports = {
    port,
    processId,
    workers,
    logLevel,
    rabbitUrl,
    eventQueue,
    batchQueue,
    eventPrefetchLimit,
    batchPrefetchLimit,
    spoorPostUrl,
    userListsEndpoint,
    authUser,
    authPassword,
    dataConsistencyPostUrl,
    db
};
