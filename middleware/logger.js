// logger.js
const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '..', 'data', 'logs.jsonl');

const logger = (req, res, next) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  };
  console.log(logEntry)

  const logLine = JSON.stringify(logEntry) + '\n';

  fs.appendFile(logFilePath, logLine, (err) => {
    if (err) console.error('Failed to write log:', err);
  });

  next();
};

module.exports = logger;