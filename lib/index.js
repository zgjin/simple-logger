const Logger = require('./logger');
const consoleAppenders = require('./appenders/consoleAppender');

const loggers = {};

function hasLogger(logger) {
  return loggers.hasOwnProperty(logger);
}
/**
 * 获取logger对象
 * @param {string} loggerCategoryName
 */
function getLogger(loggerCategoryName, options) {
  if (typeof loggerCategoryName !== 'string') {
    loggerCategoryName = Logger.DEFAULT_CATEGORY;
  }
  options = options || {};
  if (!hasLogger(loggerCategoryName)) {
    loggers[loggerCategoryName] = new Logger(loggerCategoryName);
    const appender = consoleAppenders.configure(options);
    loggers[loggerCategoryName].addListener('log', appender);
  }
  return loggers[loggerCategoryName];
}

/**
 * 中间件形式
 * @param {string} categoryName
 * @param {string} level
 * @param {string} layout
 * 主要用log打出来的：requestId, params, err, data, key
 * logger.debug(data, key);
 * { requestId, params, data, key }
 * logger.error(err, key);
 * { requestId, params, errMessage, stack, key }
 */
function simLogger(categoryName, level, layout) {
  categoryName = categoryName || 'default';
  layout = layout || 'colored';
  const appender = consoleAppenders.configure({ layout: { type: layout || 'colored2' } });
  return function (req, res, next) {
    const logger = new Logger(categoryName);
    logger.setLevel(level);
    logger.addListener('log', appender);
    logger.append({ requestId: req.ms_request_id });
    req.logger = logger;
    return next();
  };
}

module.exports = {
  getLogger,
  simLogger
};
