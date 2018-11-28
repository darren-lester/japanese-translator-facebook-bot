'use strict';

const fetch = require('node-fetch');

const errorResponse = require('./error-response');

async function send(messageData) {
  const response = await fetch(
    `https://graph.facebook.com/v2.6/me/messages?access_token=${
      process.env.PAGE_ACCESS_TOKEN
    }`,
    {
      method: 'POST',
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
    'Successfully sent generic message with id %s to recipient \
                %s',
    messageId,
    recipientId
  );
}

async function sendErrorMessage(error, messageData) {
  messageData.message.text = errorResponse(error.message);
  return send(messageData);
}

module.exports = {
  send
};
