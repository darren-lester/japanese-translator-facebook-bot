'use strict';

const request = require('request');
const translator = require('japanese-translator-interface');

const helpMessage =
  'Send me some text and I will send you a Japanese \
translation. よろしくね！(*^‿^*)';

function receivedAuthentication(event) {
  console.log('received authentication', event);
}

function receivedMessage(event) {
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
        sendHelpMessage(senderID);
        break;

      default:
        sendTranslatedMessage(senderID, messageText);
    }
  } else {
    // Send message alerting user only text may be translated
    const messageData = {
      recipient: {
        id: senderID,
      },
      message: {
        text: 'Sorry, I only understand text messages!',
      },
    };

    callSendAPI(messageData);
  }
}

function receivedDeliveryConfirmation(event) {
  console.log('received delivery confirmation', event);
}

function receivedPostback(event) {
  console.log('received postback', event);
}

function sendTranslatedMessage(recipientId, messageText) {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      text: '',
    },
  };

  // Translate message and send translation to sender
  translator
      .translate(messageText)
      .then(function(res) {
        return res.json();
      })
      .then(function(json) {
        messageData.message.text = json.translation;
        callSendAPI(messageData);
      });
}

function callSendAPI(messageData) {
  request(
      {
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: messageData,
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
        } else {
          console.error('Unable to send message.');
          console.error(response);
          console.error(error);

          if (
            body.error.message ===
          '(#100) Length of param message[text] must be less than or equal to 320'
          ) {
            messageData.message.text =
            'Sorry, facebook limits the amount of characters I can send to you. Please try and send me that in small chunks!';
            callSendAPI(messageData);
          }
        }
      }
  );
}

function sendHelpMessage(recipientID) {
  const messageData = {
    recipient: {
      id: recipientID,
    },
    message: {
      text: helpMessage,
    },
  };

  callSendAPI(messageData);
}

module.exports = {
  receivedAuthentication: receivedAuthentication,
  receivedMessage: receivedMessage,
  receivedDeliveryConfirmation: receivedDeliveryConfirmation,
  receivedPostback: receivedPostback,
};
