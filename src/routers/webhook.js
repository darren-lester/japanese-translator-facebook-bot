const express = require('express');

const messaging = require('../messaging');

const webhookRouter = express.Router();

// fb integration validation
webhookRouter.get('/', function(req, res) {
  if (
    req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === process.env.VALIDATION_TOKEN
  ) {
    console.log('Validating webhook');
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error('Failed validation. Make sure the validation tokens match.');
    res.sendStatus(403);
  }
});

// fb messages will be sent here
webhookRouter.post('/', function(req, res) {
  const data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach(function(pageEntry) {
      pageEntry.messaging.forEach(function(messagingEvent) {
        if (messagingEvent.optin) {
          messaging.receivedAuthentication(messagingEvent);
        } else if (messagingEvent.message) {
          messaging.receivedMessage(messagingEvent);
        } else if (messagingEvent.delivery) {
          messaging.receivedDeliveryConfirmation(messagingEvent);
        } else if (messagingEvent.postback) {
          messaging.receivedPostback(messagingEvent);
        } else {
          console.log(
            'Webhook received unknown messagingEvent: ',
            messagingEvent
          );
        }
      });
    });
    res.sendStatus(200);
  }
});

module.exports = webhookRouter;
