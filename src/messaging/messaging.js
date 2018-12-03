'use strict';

const receivedAuthentication = require('./received-authentication');
const receivedDeliveryConfirmation = require('./received-delivery-confirmation');
const receivedPostback = require('./received-postback');
const receivedMessage = require('./received-message');

module.exports = {
  receivedAuthentication,
  receivedMessage,
  receivedDeliveryConfirmation,
  receivedPostback
};
