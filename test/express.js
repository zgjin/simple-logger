const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const compression = require('compression');
const cors = require('cors');
const requestId = require('request-id/express');
const Logger = require('./../lib/index');

const app = express();

app.use(morgan('common'));
app.use(cors());
app.use(bodyParser.json({ limit: '64mb' }));
app.use(bodyParser.urlencoded({ limit: '64mb', extended: true }));
app.use(compression());
app.use(requestId({
  paramName: 'ms_request_id'
}));
app.use(Logger.simLogger('express-test', 'DEBUG'));

app.get('/', (req, res, next) => {
  const logger = req.logger;
  logger.debug('this is a test', 'get / logger');
  return res.json({ code: 1, result: 'success' });
});

app.all('*', (req, res, next) => {
  req.header('Access-Control-Request-Headers', '*');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('X-Frame-Options', 'DENY');
  res.header('Access-Control-Allow-Headers',
              'Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-app-id');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS');
  next();
});

const errorLog = (e, req, res, next) => {
  console.log('err', e);
  next(e);
};

const clientErrorHandler = (e, req, res, next) => {
  if (req.xhr) {
    return res.send({ code: 0, message: '请求异常' });
  }
  return next(e);
};

const errorHandler = (e, req, res, next) => {
  res.statusCode = 500;
  res.send({ code: 500 });
};

const notFoundHandler = (req, res) => {
  res.statusCode = 404;
  res.end();
};

// const apiRouter = express.Router();
// apiRouter.get('/test', (req, res, next) => {
//   res.end('hello world');
// });
// app.use(apiRouter);

app.use(notFoundHandler);
app.use(errorLog);
app.use(clientErrorHandler);
app.use(errorHandler);

const server = http.createServer(app).listen(3000, () => {
  console.log('http listen on', 3000);
  console.log('http run at env:', process.env.NODE_ENV);
});

process.on('SIGINT', () => {
  console.log('http exiting...');
  server.close(() => {
    console.log('http exited.');
    process.exit(0);
  });
});

