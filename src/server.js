'use strict';

const app = require('./app');
const config = require('./config');

app.listen(config.port, function() {
  console.log(`Japanese-Translator-Bot listening on port ${config.port}`);
});
