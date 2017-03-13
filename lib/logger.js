const EventEmitter = require('events');

const LoggingEvent = require('./loggerEvent');
const levels = require('./levels');
const bindMethod = require('./utils/bind_method');

const DEFAULT_CATEGORY = '[default]';

class Logger extends EventEmitter {
  constructor(name, level) {
    super();
    this.category = name || DEFAULT_CATEGORY;
    this.level = levels.TRACE;
    if (level) {
      this.setLevel(level);
    }
  }

  static DEFAULT_CATEGORY = DEFAULT_CATEGORY;

  setLevel = (level) => {
    this.level = levels.toLevel(level, this.level || levels.TRACE);
  }

  removeLevel = () => {
    delete this.level;
  }

  log = (...args) => {
    const argsArr = args.slice();
    const logLevel = levels.toLevel(argsArr[0], levels.INFO);
    if (!this.isLevelEnabled(logLevel)) {
      return;
    }
    const newargs = argsArr.slice(1);
    this._log(logLevel, newargs);
  }

  isLevelEnabled = (otherLevel) => this.level.isLessThanOrEqualTo(otherLevel);

  _log = (level, data) => {
    const loggingEvent = new LoggingEvent(this.category, level, data, this);
    this.emit('log', loggingEvent);
  };
}

bindMethod.addMehtods(Logger);

module.exports = Logger;