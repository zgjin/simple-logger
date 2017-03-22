import test from 'ava';
import Logger from './../lib/index';
import rq from 'request-promise';

test.skip('test', async t => {
  const logger = Logger.getLogger('my-test', {
    layout: {
      type: 'basic'
    }
  });
  // logger.append({ requestId: 'requestId' });
  logger.setLevel('DEBUG');
  logger.debug({ requestId: 'e4f203d9-42e0-452f-9671-b89fb2b60e73', params: { user_id: '57453e35b27f275120d403ce' }, data: 'this is log data' }, 'this is my test log');
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
