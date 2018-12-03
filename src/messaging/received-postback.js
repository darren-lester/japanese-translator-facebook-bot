'use strict';

function receivedPostback(event) {
  console.log('received postback', event);
}

module.exports = receivedPostback;
