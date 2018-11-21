'use strict';

const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('Japanese-Translator-Bot listening on port', port);
});
