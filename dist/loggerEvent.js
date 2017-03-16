"use strict";class LoggingEvent {
  constructor(categoryName, level, data, logger) {
    this.startTime = new Date();
    this.categoryName = categoryName;
    this.data = data;
    this.level = level;
    this.logger = logger;
  }}


module.exports = LoggingEvent;