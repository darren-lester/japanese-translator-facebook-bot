'use strict';

const request = require('supertest');
const express = require('express');

const webhookRouter = require('./webhook');

describe('/webhook', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use('/webhook', webhookRouter);
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
});
