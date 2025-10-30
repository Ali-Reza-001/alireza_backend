const Log = require('../model/Log');
const User = require('../model/User');

const logger = async (req, res, next) => {
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip;
  const userLogId = req.headers['userlogid'];

  if (ip === '::1' || ip === '127.0.0.1') {
    console.log('Localhost access - skipping log');
    return next();
  }

  const log = await Log.findById(userLogId);
  if (log) {

    console.log(`The id ${userLogId} is for the log ${log}`);

    const now = Date.now();
    const timeElapsed = Math.floor((now - log.createdAt.getTime()) / 1000); // in seconds
    console.log('TimeElapsed' + timeElapsed)

    try {
      log.trip.push({method, url, timeElapsed});
      await log.save();
    } catch (err) {
      console.log(err)
    }

  } else {
    console.log(`User with ip ${ip} and log ID ${userLogId} has a wrong log ID.`)
  }

  next();
};

module.exports = logger;