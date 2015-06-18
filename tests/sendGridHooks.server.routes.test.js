'use strict';

// External dependencies
const should = require('should');
const request = require('supertest');

// Our dependencies
const app = require('../server');


const agent = request.agent(app);

const bounceExample = require('./events/sendgrid/bounce.json');
const deliveredExample = require('./events/sendgrid/delivered.json');
const meta = require('./meta/meta.json');

bounceExample.meta = meta;
deliveredExample.meta = meta;

describe('SendGrid Hooks tests:', () => {

    it('responds with OK when a POST is received', (done) => {

        let events = [bounceExample, deliveredExample];

        // Save a new example
        agent.post('/hooks/sendgrid')
            .send(events)
            .expect(200)
            .end((hooksPostErr, hooksPostRes) => {
                if (hooksPostErr) {
                    done(hooksPostErr);
                }
                hooksPostRes.text.should.match('OK');
                done();
            });
    });

});