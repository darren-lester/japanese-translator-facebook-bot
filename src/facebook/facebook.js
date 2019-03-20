'use strict';

const fetch = require('node-fetch');

const config = require('../config');
const errorResponse = require('./error-response');

async function send(messageData) {
  const response = await fetch(
    `${config.facebook.origin}${config.facebook.messages}?access_token=${
      config.accessToken
    }`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messageData)
    }
  );

  const body = await response.json();

  if (body.error) {
    console.error('Unable to send message.');
    console.error(body.error);
    return sendErrorMessage(body.error, messageData);
  }

  const recipientId = body.recipient_id;
  const messageId = body.message_id;
  console.log(
    `Successfully sent generic message with id ${messageId} to recipient ${recipientId}`
  );
}

async function sendErrorMessage(error, messageData) {
  messageData.message.text = errorResponse(error.message);
  return send(messageData);
}

module.exports = {
  send
};
