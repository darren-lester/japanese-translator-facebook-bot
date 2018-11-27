'use strict';

const request = require('request');

async function send(messageData) {
  return new Promise((resolve, reject) => {
    request(
      {
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData
      },
      function(error, response, body) {
        if (!error && response.statusCode == 200) {
          const recipientId = body.recipient_id;
          const messageId = body.message_id;
          console.log(
            'Successfully sent generic message with id %s to recipient \
            %s',
            messageId,
            recipientId
          );
          resolve();
        } else {
          console.error('Unable to send message.');
          console.error(response);
          console.error(error);
          if (
            body.error.message ===
            '(#100) Length of param message[text] must be less than or equal to 320'
          ) {
            messageData.message.text = messages.characterLimit;
            return callSendAPI(messageData);
          }
        }
      }
    );
  });
}

module.exports = {
  send
};
