'use strict';

const request = require('request');
const translator = require('japanese-translator-interface');
const messages = require('./messages');

function receivedAuthentication(event) {
  console.log('received authentication', event);
}

async function receivedMessage(event) {
  const senderID = event.sender.id;
  const recipientID = event.recipient.id;
  const timeOfMessage = event.timestamp;
  const message = event.message;

  console.log(
    'Received message for user %d and page %d at %d with message:',
    senderID,
    recipientID,
    timeOfMessage
  );
  console.log(JSON.stringify(message));

  const messageText = message.text;

  if (messageText) {
    // If we receive a text message, check to see if it matches any special
    // keywords and send back appropriate response. Otherwise, send translation.
    switch (messageText) {
      case ':help':
        return sendHelpMessage(senderID);
        break;

      default:
        return sendTranslatedMessage(senderID, messageText);
    }
  } else {
    // Send message alerting user only text may be translated
    const messageData = {
      recipient: {
        id: senderID
      },
      message: {
        text: messages.onlyText
      }
    };

    return callSendAPI(messageData);
  }
}

function receivedDeliveryConfirmation(event) {
  console.log('received delivery confirmation', event);
}

function receivedPostback(event) {
  console.log('received postback', event);
}

async function sendTranslatedMessage(recipientId, messageText) {
  const messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: ''
    }
  };

  // Translate message and send translation to sender
  const translatorResponse = await translator.translate(messageText);
  const json = await translatorResponse.json();
  messageData.message.text = json.translation;
  return callSendAPI(messageData);
}

async function callSendAPI(messageData) {
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

async function sendHelpMessage(recipientID) {
  const messageData = {
    recipient: {
      id: recipientID
    },
    message: {
      text: messages.help
    }
  };

  return callSendAPI(messageData);
}

module.exports = {
  receivedAuthentication: receivedAuthentication,
  receivedMessage: receivedMessage,
  receivedDeliveryConfirmation: receivedDeliveryConfirmation,
  receivedPostback: receivedPostback
};
