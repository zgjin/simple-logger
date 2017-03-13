import test from 'ava';
import getLogger from './../lib/index';

test('test', async t => {
  const logger = getLogger('test', {
    layout: {
      type: 'basic'
    }
  });
  logger.setLevel('DEBUG');
  logger.debug('test-----');
  t.truthy(true);
});
