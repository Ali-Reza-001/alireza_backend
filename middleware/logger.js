const Log = require('../model/Log');
const ipChecker = require('../config/ipInfoInit');

const logger = async (req, res, next) => {
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip;
  const userAgent = req.headers['user-agent'] || '';
  const device = userAgent.replace('(', '#').replace(')', '#').split('#')[1] || 'unknown';

  console.log('User is ' + ip);
  if (ip === '::1' || ip === '127.0.0.1') {
    console.log('Localhost access - skipping log');
    return next();
  }

  try {
    const ipInfo = await ipChecker(ip);
    const log = new Log({ ipInfo, device, method, url });
    await log.save();
  } catch (err) {
    console.error('Error saving new log:', err);
  }

  // Refreshing database: update logs missing ipInfo


  next();
};

module.exports = logger;
