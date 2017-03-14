import test from 'ava';
import getLogger from './../lib/index';

test('test', async t => {
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
