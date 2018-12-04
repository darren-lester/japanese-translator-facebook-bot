'use strict';

const app = require('./app');
const config = require('./config');

const port = process.env.PORT || config.port;

app.listen(port, function() {
  console.log(`Japanese-Translator-Bot listening on port ${port}`);
});
