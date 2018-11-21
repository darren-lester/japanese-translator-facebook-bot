'use strict';

const express = require('express');
const statusRouter = express.Router();

statusRouter.get('/', function(req, res) {
  res.status(200).send('200 生きるよ');
});

module.exports = statusRouter;
