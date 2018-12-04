module.exports = {
  port: process.env.PORT || 3000,
  facebook: {
    origin: 'https://graph.facebook.com',
    messages: '/v2.6/me/messages'
  },
  accessToken: process.env.PAGE_ACCESS_TOKEN,
  validationToken: process.env.VALIDATION_TOKEN
};
