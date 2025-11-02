const Log = require('../model/Log');

const logger = async (req, res, next) => {
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip;
  const userAgent = req.headers['user-agent'];
  const device = userAgent.replace('(', '#').replace(')', '#').split('#')[1];

  console.log('User is ' + ip);
  if (ip === '::1' || ip === '127.0.0.1') {
    console.log('Localhost access - skipping log');
    return next();
  }


  try {
    const log = new Log({ip, device, method, url});
    await log.save();
  } catch (err) {
    console.log(err);
  }

  next();
};

module.exports = logger;