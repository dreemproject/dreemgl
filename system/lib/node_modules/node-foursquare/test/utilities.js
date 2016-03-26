
var winston = require('winston'),
    util = require('util');


function getLoggerSettings(name) {
  return {
    'console': {
      'colorize': 'true',
      'level': 'warn',
      'label' : name
    }
  }
}

function reportData(logger, test, data) {
  logger.info(test + ' : ' + data);
}

function reportError(logger, test, message) {
  logger.error(test + ' :  \033[22;31mERROR: ' + message + '\x1B[0m');
}

function reportOk(logger, test) {
  logger.debug(test + ' : \033[22;32mOK\x1B[0m');
}

function getLogger(name) {
  winston.loggers.add(name, getLoggerSettings(name));
  return winston.loggers.get(name);
}

module.exports = {
  getLogger : getLogger,
  reportOk : reportOk,
  reportData : reportData,
  reportError : reportError
};
