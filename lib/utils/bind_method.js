const levels = require('./../levels');

let logWritesEnabled = true;

function prepareStackTrace(error, structuredStackTrace) {
  const trace = structuredStackTrace[0];
  return {
    // method name
    method: trace.getMethodName() || trace.getFunctionName() || '<anonymous>',
    // file name
    file: trace.getFileName(),
    // line number
    line: trace.getLineNumber(),
    // column number
    column: trace.getColumnNumber()
  };
}

function getTrace(caller) {
  const original = Error.prepareStackTrace;
  const error = {};
  Error.captureStackTrace(error, caller || getTrace);
  Error.prepareStackTrace = prepareStackTrace;
  const stack = error.stack;
  Error.prepareStackTrace = original;
  return stack;
}

// format trace
function formatter(trace) {
  return 'at @name (@file:@line:@column)'
    .split('@method')
    .join(trace.method)
    .split('@file')
    .join(trace.file || '')
    .split('@line')
    .join(trace.line)
    .split('@column')
    .join(trace.column)
    .split('@pid')
    .join(process.pid || '@pid')
    .split('@port')
    .join(process.port || '@port');
}

class BindMethod {
  static addLevelMethods = (level, logger) => {
    level = levels.toLevel(level);

    const levelStrLower = level.toString().toLowerCase();
    const levelMethod = levelStrLower.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    const isLevelMethod = levelMethod[0].toUpperCase() + levelMethod.slice(1);

    logger.prototype[`is${isLevelMethod}Enabled`] = function () {
      return this.isLevelEnabled(level.toString());
    };

    logger.prototype[levelMethod] = function log(...args) {
      if (logWritesEnabled && this.isLevelEnabled(level)) {
        const trace = getTrace(log);
        args.unshift(formatter(trace));
        this._log(level, args);
      }
    };
  }

  static disableAllLogWrites = () => {
    logWritesEnabled = false;
  }

  static disableAllLogWrites = () => {
    logWritesEnabled = true;
  }

  static addMehtods = (logger) => {
    const methods = ['Trace', 'Debug', 'Info', 'Warn', 'Error', 'Fatal', 'Mark'];
    for (const method of methods) {
      BindMethod.addLevelMethods(method, logger);
    }
  }
}

module.exports = BindMethod;
