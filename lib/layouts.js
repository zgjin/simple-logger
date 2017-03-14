const util = require('util');
const semver = require('semver');
const dateFormat = require('./date_format');

function wrapErrorsWithInspect(items) {
  return items.map((item) => {
    if ((item instanceof Error) && item.stack) {
      return { inspect: () => {
        if (semver.satisfies(process.version, '>=6')) {
          return util.format(item);
        }
        return `${util.format(item)}\n${item.stack}`;
      } };
    }
    return item;
  });
}

function formatLogData(logData) {
  const data = Array.isArray(logData) ? logData : Array.prototype.slice.call(arguments);
  return util.format.apply(util, wrapErrorsWithInspect(data));
}

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
  yellow: [33, 39]
};

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
      '[%s] [%s] %s - '
      , dateFormat.asString(loggingEvent.startTime, timezoneOffest)
      , loggingEvent.level
      , loggingEvent.categoryName
    )
    , colour
  );
  return output;
}

function basicLayout(loggingEvent, timezoneOffset) {
  return `${timestampLevelAndCategory(loggingEvent, undefined, timezoneOffset)}${formatLogData(loggingEvent.data)}`;
}

const colours = {
  ALL: 'grey',
  TRACE: 'blue',
  DEBUG: 'cyan',
  INFO: 'green',
  WARN: 'yellow',
  ERROR: 'red',
  FATAL: 'magenta',
  OFF: 'grey'
};
function colouredLayout(loggingEvent, timezoneOffset) {
  return timestampLevelAndCategory(
    loggingEvent,
    colours[loggingEvent.level.toString()],
    timezoneOffset
  ) + formatLogData(loggingEvent.data);
}

const layoutMakers = {
  basic: basicLayout,
  colored: colouredLayout
};

module.exports = {
  layout: (name) => layoutMakers[name]
};
