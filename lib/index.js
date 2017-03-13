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

module.exports = getLogger;
