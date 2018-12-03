'use strict';

function isTextMessage(message) {
  return !!message.text;
}

module.exports = isTextMessage;
