class LoggingEvent {
  constructor(categoryName, level, data, logger) {
    this.startTime = new Date();
    this.categoryName = categoryName;
    this.data = data;
    this.level = level;
    this.logger = logger;
    this.requestId = logger.requestId || '';
    this.params = logger.params || '';
  }
}

module.exports = LoggingEvent;
