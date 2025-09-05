const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, 'data');
const logFilePath = path.join(logDir, 'logs.jsonl');

const logger = (req, res, next) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  };

  const logLine = JSON.stringify(logEntry) + '\n';

  // Ensure the directory exists
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  fs.appendFile(logFilePath, logLine, (err) => {
    if (err) console.error('Failed to write log:', err);
  });

  next();
};

module.exports = logger;