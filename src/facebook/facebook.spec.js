'use strict';

const nock = require('nock');

const facebook = require('./facebook');

const LARGE_MESSAGE_REQUEST = {
  recipient: {
    id: 1
  },
  message: {
    text: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
       aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
       aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
       aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
       aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
       aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
       aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
       aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
       aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
       aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
      `
  }
};

describe('facebook', () => {
  let facebookMock;
  describe('send', () => {
    beforeEach(() => {
      facebookMock = nock('https://graph.facebook.com')
        .post(new RegExp('^/v2.6/me/messages'), LARGE_MESSAGE_REQUEST)
        .reply(200, {
          error: {
            message:
              '(#100) Length of param message[text] must be less than or equal to 320'
          }
        })
        .post(new RegExp('^/v2.6/me/messages'), {
          recipient: {
            id: 1
          },
          message: {
            text:
              'Sorry, facebook limits the amount of characters I can send to you. Please try and send me that in small chunks!'
          }
        })
        .reply(200, {});
    });

    test('sends character limit error message when Facebook returns character limit error', async () => {
      await facebook.send(LARGE_MESSAGE_REQUEST);
      expect(facebookMock.isDone()).toBe(true);
    });
  });
});
