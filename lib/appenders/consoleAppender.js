const layouts = require('./../layouts');
const consoleLog = console.log.bind(console);

function consoleAppender(layout) {
  layout = layout || layouts.basicLayout;
  return function (loggingEvent) {
    consoleLog(layout(loggingEvent));
  };
}

function configure(config) {
  let layout;
  if (config.layout) {
    layout = layouts.layout(config.layout.type);
  }
  return consoleAppender(layout);
}

exports.appender = consoleAppender;
exports.configure = configure;
