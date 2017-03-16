import test from 'ava';
import getLogger from './../lib/index';
import rq from 'request-promise';

test.skip('test', async t => {
  const logger = getLogger('test', {
    layout: {
      type: 'basic'
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
  logger.debug('test-----', JSON.stringify(data));
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
