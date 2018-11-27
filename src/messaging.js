'use strict';

const translator = require('japanese-translator-interface');
const messages = require('./messages');
const facebook = require('./facebook');

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

  if (isTextMessage(message)) {
    const { text } = message;
    // If we receive a text message, check to see if it matches any special
    // keywords and send back appropriate response. Otherwise, send translation.
    switch (text) {
      case ':help':
        return sendHelpMessage(senderID);
        break;

      default:
        return sendTranslatedMessage(senderID, text);
    }
  } else {
    // Send message alerting user only text may be translated
    const messageData = createMessageData(senderId, messages.onlyText);
    return facebook.send(messageData);
  }
}

function isTextMessage(message) {
  return !!message.text;
}

function receivedDeliveryConfirmation(event) {
  console.log('received delivery confirmation', event);
}

function receivedPostback(event) {
  console.log('received postback', event);
}

async function sendTranslatedMessage(recipientId, messageText) {
  const messageData = createMessageData(recipientId);

  // Translate message and send translation to sender
  const translatorResponse = await translator.translate(messageText);
  const json = await translatorResponse.json();
  messageData.message.text = json.translation;
  return facebook.send(messageData);
}

async function sendHelpMessage(recipientId) {
  const messageData = createMessageData(recipientId, messages.help);
  return facebook.send(messageData);
}

function createMessageData(recipientId, message = '') {
  return {
    recipient: {
      id: recipientId
    },
    message: {
      text: message
    }
  };
}

module.exports = {
  receivedAuthentication,
  receivedMessage,
  receivedDeliveryConfirmation,
  receivedPostback
};
