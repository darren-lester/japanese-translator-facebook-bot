'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const webhookRouter = require('./routers/webhook');
const statusRouter = require('./routers/status');

const app = express();
app.use(bodyParser.json());

app.use('/webhook', webhookRouter);
app.use('/', statusRouter);

module.exports = app;
