'use strict';const EventEmitter = require('events');

const LoggingEvent = require('./loggerEvent');
const levels = require('./levels');
const bindMethod = require('./utils/bind_method');

const DEFAULT_CATEGORY = '[default]';

class Logger extends EventEmitter {
  constructor(name, level) {
    super();_initialiseProps.call(this);
    this.category = name || DEFAULT_CATEGORY;
    this.level = levels.TRACE;
    this.cache = {};
    if (level) {
      this.setLevel(level);
    }
  }}Logger.

DEFAULT_CATEGORY = DEFAULT_CATEGORY;var _initialiseProps = function () {this.

  setLevel = level => {
    this.level = levels.toLevel(level, this.level || levels.TRACE);
  };this.

  removeLevel = () => {
    delete this.level;
  };this.

  log = (...args) => {
    const argsArr = args.slice();
    const logLevel = levels.toLevel(argsArr[0], levels.INFO);
    if (!this.isLevelEnabled(logLevel)) {
      return;
    }
    const newargs = argsArr.slice(1);
    this._log(logLevel, newargs);
  };this.

  isLevelEnabled = otherLevel => this.level.isLessThanOrEqualTo(otherLevel);this.

  _log = (level, data) => {
    const loggingEvent = new LoggingEvent(this.category, level, data, this);
    this.emit('log', loggingEvent);
  };this.

  append = data => {
    const { requestId, params } = data;
    if (requestId && typeof requestId === 'string') {
      this.cache['requestId'] = requestId || '';
    }
    if (params && typeof params === 'object') {
      this.cache['params'] = params || {};
    }
  };};


bindMethod.addMehtods(Logger);

module.exports = Logger;