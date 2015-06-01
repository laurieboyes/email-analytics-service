'use strict';

// Our modules
const sqs = require('../../config/sqs');
const config = require('../../config/config');
const NoMessageInQueue = require('../errors/noMessageInQueue.server.error');

// External modules
const Q = require( 'q' );
const logger = require('winston');

exports.addToQueue = (message) => {

    return new Promise((fulfill, reject) => {

        // Use the Q module to create a promise interface for the sqs sendMessage method
        let sendMessage = Q.nbind( sqs.sendMessage, sqs );

        sendMessage({
            QueueUrl: config.sqsQueueUrl,
            MessageBody: message
        })
        .then((data) => {
            let messageId = data.MessageId;
            fulfill(messageId);

        })
        .catch(reject);

    });

};

exports.pullFromQueue = () => {

    return new Promise((fulfill, reject) => {

        // Use the Q module to create a promise interface for the sqs receiveMessage method
        let receiveMessage = Q.nbind( sqs.receiveMessage, sqs );

        receiveMessage ({
            QueueUrl: config.sqsQueueUrl
        })
        .then((data) => {

            //There are no messages in the queue
            /* istanbul ignore if  */
            if (!data.Messages) {
                reject(new NoMessageInQueue());
            }
            else {
                let message = data.Messages[0];

                fulfill({
                    id: message.MessageId,
                    body: message.Body,
                    receiptHandle: message.ReceiptHandle
                });
            }

        })
        .catch (reject);
    });

};

exports.deleteFromQueue = (receiptHandle) => {

    return new Promise((fulfill, reject) =>  {

        // Use the Q module to create a promise interface for the sqs deleteMessage method
        let deleteMessage = Q.nbind( sqs.deleteMessage, sqs );

        deleteMessage({
            QueueUrl: config.sqsQueueUrl,
            ReceiptHandle: receiptHandle
        })
        .then(fulfill)
        .catch (reject);
    });

};