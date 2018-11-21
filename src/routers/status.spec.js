'use strict';

const request = require('supertest');
const express = require('express');

const statusRouter = require('./status');

describe('/status', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use('/status', statusRouter);
  });

  test('returns 200', async () => {
    const response = await request(app).get('/status');
    expect(response.statusCode).toBe(200);
  });
});
