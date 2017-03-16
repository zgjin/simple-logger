'use strict';const util = require('util');
// const semver = require('semver');
const dateFormat = require('./date_format');

const colours = {
  ALL: 'grey',
  TRACE: 'blue',
  DEBUG: 'cyan',
  INFO: 'green',
  WARN: 'yellow',
  ERROR: 'red',
  FATAL: 'magenta',
  OFF: 'grey' };


const styles = {
  // styles
  bold: [1, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  // grayscale
  white: [37, 39],
  grey: [90, 39],
  black: [90, 39],
  // colors
  blue: [34, 39],
  cyan: [36, 39],
  green: [32, 39],
  magenta: [35, 39],
  red: [31, 39],
  yellow: [33, 39] };


// function wrapErrorsWithInspect(items) {
//   return items.map((item) => {
//     if ((item instanceof Error) && item.stack) {
//       return { inspect: () => {
//         if (semver.satisfies(process.version, '>=6')) {
//           return util.format(item);
//         }
//         return `${util.format(item)}\n${item.stack}`;
//       } };
//     }
//     return item;
//   });
// }

function formatLogData(logData) {
  const data = Array.isArray(logData) ? logData : Array.prototype.slice.call(arguments);
  return util.format.apply(util, data);
}

function colorizeStart(style) {
  return style ? `\x1B[${styles[style][0]}m` : '';
}
function colorizeEnd(style) {
  return style ? `\x1B[${styles[style][1]}m` : '';
}

function colorize(str, style) {
  return colorizeStart(style) + str + colorizeEnd(style);
}

function timestampLevelAndCategory(loggingEvent, colour, timezoneOffest) {
  const output = colorize(
  formatLogData(
  '[%s] [%s] %s - ',
  dateFormat.asString(loggingEvent.startTime, timezoneOffest),
  loggingEvent.level,
  loggingEvent.categoryName),

  colour);

  return output;
}

function basicLayout(loggingEvent, timezoneOffset) {
  return `${timestampLevelAndCategory(loggingEvent, undefined, timezoneOffset)}${formatLogData(loggingEvent.data)}`;
}

function colouredLayout(loggingEvent, timezoneOffset) {
  return timestampLevelAndCategory(
  loggingEvent,
  colours[loggingEvent.level.toString()],
  timezoneOffset) +
  formatLogData(loggingEvent.data);
}

function formatJson(trace, data, key, cache) {
  let logData = {};
  if (data instanceof Error) {
    const errMessage = data.message;
    const stack = data.stack;
    const obj = { errMessage, stack, key };
    logData = Object.assign(obj, cache);
  } else {
    const obj = { data, key };
    logData = Object.assign(obj, cache);
  }
  return util.format.apply(util, [trace, JSON.stringify(logData)]);
}

function formatLog(loggingEvent, color) {
  const data = loggingEvent.data; // [trace, data, key]
  const cache = loggingEvent.logger && loggingEvent.logger.cache || {};
  if (Array.isArray(data)) {
    data.push(cache);
    return `${timestampLevelAndCategory(loggingEvent, color)}${formatJson.apply(null, data)}`;
  }
  return '';
}

function globalFormatJson(trace, logData, key) {
  if (toString.call(logData) === '[object Object]') {
    const { requestId, params, err, data } = logData;
    const obj = { requestId, params, errMessage: err && err.message, stack: err && err.stack, data, key };
    return util.format(JSON.stringify(obj));
  }
  return util.format(JSON.stringify(logData));
}

function globalLog(loggingEvent, color) {
  const data = loggingEvent.data; // [trace, data, key]
  if (Array.isArray(data)) {
    return `${timestampLevelAndCategory(loggingEvent, color)}${globalFormatJson.apply(null, data)}`;
  }
  return '';
}

function globalBasicLyout(loggingEvent) {
  return globalLog(loggingEvent);
}

function globalColoredLyout(loggingEvent) {
  return globalLog(loggingEvent, colours[loggingEvent.level.toString()]);
}

function basicMiddlewareLayout(loggingEvent) {
  return formatLog(loggingEvent);
}

function coloredMiddlewareLayout(loggingEvent) {
  return formatLog(loggingEvent, colours[loggingEvent.level.toString()]);
}

const layoutMakers = {
  basic: basicLayout,
  colored: colouredLayout,
  basic2: basicMiddlewareLayout, // jsonstring layout
  colored2: coloredMiddlewareLayout, // colored jsonstring layout
  globalBasic: globalBasicLyout,
  globalColored: globalColoredLyout };


module.exports = {
  coloredLayout: colouredLayout,
  basicLayout,
  basicMiddlewareLayout,
  layout: name => layoutMakers[name] };