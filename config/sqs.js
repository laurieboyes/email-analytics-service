'use strict';

require('dotenv').load({silent: true});
const aws = require('aws-sdk');

const WaitTimeSeconds = 20;
const VisibilityTimeout = 30;
const region = process.env.SQS_REGION || 'eu-west-1';
const accessKeyId = process.env.SQS_ACCESS_KEY || process.env.TEST_SQS_ACCESS_KEY; //Necessary for CI with Heroku
const secretAccessKey =  process.env.SQS_SECRET_KEY || process.env.TEST_SQS_SECRET_KEY; //Necessary for CI with Heroku

module.exports = new aws.SQS({

    region: region,
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,

    params: {
        WaitTimeSeconds: WaitTimeSeconds,
        VisibilityTimeout: VisibilityTimeout
    }

});
