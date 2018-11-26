'use strict';

const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const messaging = require('../messaging');
const webhookRouter = require('./webhook');

jest.mock('../messaging');

describe('/webhook', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(bodyParser.json());
    app.use('/webhook', webhookRouter);
  });

  afterAll(() => {
    jest.unmock('../messaging');
  });

  describe('GET', () => {
    const query = {
      'hub.mode': 'subscribe',
      'hub.verify_token': 'token',
      'hub.challenge': 'challenge'
    };

    beforeAll(() => {
      process.env.VALIDATION_TOKEN = query['hub.verify_token'];
    });

    afterAll(() => {
      delete process.env.VALIDATION_TOKEN;
    });

    describe('request made with correct token', () => {
      test('returns 200', async () => {
        const response = await request(app)
          .get('/webhook')
          .query(query);
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe(query['hub.challenge']);
      });
    });

    describe('request made with incorrect token', () => {
      test('returns 403', async () => {
        const response = await request(app)
          .get('/webhook')
          .query({ ...query, 'hub.verify_token': 'incorrecttoken' });
        expect(response.statusCode).toBe(403);
      });
    });
  });

  describe('POST', () => {
    const body = {
      object: 'page',
      entry: [
        {
          messaging: [
            {
              message: {}
            },
            {
              message: {}
            },
            {
              message: {}
            }
          ]
        }
      ]
    };

    describe('when requested with a list of messages', () => {
      test('processes each message', async () => {
        await request(app)
          .post('/webhook')
          .send(body);
        expect(messaging.receivedMessage).toBeCalledTimes(3);
      });
    });
  });
});
