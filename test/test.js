import test from 'ava';
import Logger from './../lib/index';
import rq from 'request-promise';

test.skip('test', async t => {
  const logger = Logger.getLogger('my-test', {
    layout: {
      type: 'globalColored'
    }
  });
  // logger.append({ requestId: 'requestId' });
  logger.setLevel('DEBUG');
  const data = { req:
   { user_id: '57453e35b27f275120d403ce',
     publish_status: {
       a: {
         d: {
           d: {
             d: 'test'
           }
         }
       }
     },
     page: 1,
     limit: 10 },
  params:
   { user_id: '57453e35b27f275120d403ce',
     publish_status: 1,
     page: 1,
     limit: 10 } };
  logger.debug({ requestId: 'requestId', params: { user_id: '57453e35b27f275120d403ce' }, data: 'this is log data' }, 'test-----');
  t.truthy(true);
});

test('req', async t => {
  const options = {
    method: 'GET',
    uri: 'http://localhost:3000'
  };
  try {
    const result = await rq(options);
    console.log('result', result);
    t.truthy(result);
  } catch (err) {
    console.log('err------>', err);
    t.falsy(true);
  }
});
