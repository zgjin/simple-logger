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

function simLogger(categoryName, layout) {
  categoryName = categoryName || 'default';
  layout = layout || 'colored';
  const appender = consoleAppenders.configure({ layout: { type: layout || 'colored' } });
  logger.addListener('log', appender);
  return function (req, res, next) {
    const logger = new Logger(categoryName);
    req.logger = logger;
    return next();
  };
}

module.exports = {
  getLogger,
  simLogger
};
