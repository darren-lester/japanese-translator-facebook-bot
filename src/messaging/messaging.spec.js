'use strict';

const nock = require('nock');

const config = require('../config');
const messaging = require('./messaging');

process.env.TRANSLATOR = 'http://translator';

nock(process.env.TRANSLATOR)
  .get('/?input=hello&source=&target=ja')
  .reply(200, {
    translation: 'こんにちは'
  });

const facebook = nock(config.facebook.origin)
  .post(new RegExp(`^${config.facebook.messages}`), {
    recipient: {
      id: 1
    },
    message: {
      text: 'こんにちは'
    }
  })
  .reply(200, {
    recipient_id: '1',
    message_id: '123'
  });

describe('messaging', () => {
  describe('receivedMessage', () => {
    const event = {
      message: {
        text: 'hello'
      },
      recipient: {
        id: 1
      },
      sender: {
        id: 1
      }
    };

    test('sends translation to Facebook', async () => {
      await messaging.receivedMessage(event);
      expect(facebook.isDone()).toBe(true);
    });
  });
});
