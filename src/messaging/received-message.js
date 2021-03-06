'use strict';

const translator = require('japanese-translator-interface');
const messages = require('./messages');
const facebook = require('../facebook');
const createMessage = require('./create-message');
const isTextMessage = require('./is-text-message');

async function receivedMessage(event) {
  const senderID = event.sender.id;
  const recipientID = event.recipient.id;
  const timeOfMessage = event.timestamp;
  const message = event.message;

  console.log(
    `Received message for user ${senderID} and page ${recipientID} at ${timeOfMessage} with message:`
  );
  console.log(JSON.stringify(message));

  if (isTextMessage(message)) {
    const { text } = message;
    switch (text) {
      case ':help':
        return sendHelpMessage(senderID);
        break;

      default:
        return sendTranslatedMessage(senderID, text);
    }
  } else {
    const message = createMessage(senderID, messages.onlyText);
    return facebook.send(message);
  }
}

async function sendTranslatedMessage(recipientId, messageText) {
  const message = createMessage(recipientId);
  const translatorResponse = await translator.translate(messageText);
  const json = await translatorResponse.json();
  message.message.text = json.translation;
  return facebook.send(message);
}

async function sendHelpMessage(recipientId) {
  const message = createMessage(recipientId, messages.help);
  return facebook.send(message);
}

module.exports = receivedMessage;
