const messages = require('../messages');

const ERROR_RESPONSES = {
  '(#100) Length of param message[text] must be less than or equal to 320':
    messages.characterLimit
};

const DEFAULT_ERROR_RESPONSE = 'Sorry, something went wrong.';

function errorResponse(errorMessage) {
  return ERROR_RESPONSES[errorMessage] || DEFAULT_ERROR_RESPONSE;
}

module.exports = errorResponse;
