'use strict';

const app = require('./app');

const port = process.env.PORT;

app.listen(port, function() {
  console.log('Japanese-Translator-Bot listening on port', port);
});
