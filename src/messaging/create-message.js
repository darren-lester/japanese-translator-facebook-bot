'use strict';

function createMessage(recipientId, message = '') {
  return {
    recipient: {
      id: recipientId
    },
    message: {
      text: message
    }
  };
}

module.exports = createMessage;
