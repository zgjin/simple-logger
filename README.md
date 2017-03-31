Simple to use, simply handled by logstash, highperformence log framework for  [node](http://nodejs.org). and [Express](http://expressjs.com/) project.

```javascript
const Logger = require('simple-logger');
global.logger = Logger.getLogger('express-blog');
logger.setLevel('DEBUG');

logger.debug('data to log out'); // just like console.log(), but it is colored, the output is [2017-03-16 21:14:01.862] [DEBUG] express-blog - data to log out
```

or you can use as a middlemare for express

```javascript
const express = require('express');
const requestId = require('request-id/express');
const Logger = require('simple-logger');

const app = express();

app.use(requestId({
  paramName: 'requestId'
}));
app.use(Logger.simLogger('express-test', 'DEBUG'));

app.get('/', function (req, res) {
  const logger = req.logger;
  logger.append({ params: { params: req.params } });
  logger.debug({ test: 'test' }, 'test logger debug'); // [2017-03-16 21:37:50.885] [DEBUG] express-test - (/Users/zhangguojin/programFile/node-workspace/myNode/simple-logger/test/express.js app.get:25) {"data":{"test":"test"},"key":"test logger debug","requestId":"c855b618-645c-4c39-b4d7-fab5864337c5","params":{"params":"test"}}
  logger.debug('testtset', 'test logger debug'); // [2017-03-16 21:37:50.887] [DEBUG] express-test - (/Users/zhangguojin/programFile/node-workspace/myNode/simple-logger/test/express.js app.get:26) {"data":"testtset","key":"test logger debug","requestId":"c855b618-645c-4c39-b4d7-fab5864337c5","params":{"params":"test"}}
  res.send('Hello World');
});

app.listen(3000);
```

## installation

```text
add this to your package.json's dependencies

"simple-logger": "github:fantasyKing/simple-logger"

run

npm install simple-logger --only=production
```

# API

```js
const Logger = rqeuire('simple-logger');
```

## Logger

`Logger` consists of `getLogger` and `simLogger`

### getLogger

```js
const logger = Logger.getLogger(loggerCategoryName, options);
```

#### loggerCategoryName

`loggerCategoryName` is the identifier of your log. Usually your project name.

The log structure is :

\[date\] \[level\] loggerCategoryName - \(trace method:line\) `your log data`

#### options

```js
{
  layout: {
    type: "basic" // default is colored
  }
}
```

there six layout types you can choose :

`basic`: just console.log();

`colored`: different level has different color

`basic2`

`colored2`

`globalBasic`

`globalColored`

### simLogger

```js
app.use(Logger.simLogger('express-test', 'DEBUG', 'colored2'));

const logger = req.logger;
```