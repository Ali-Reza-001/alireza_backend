const Log = require('../model/Log');
const User = require('../model/User');

const logger = async (req, res, next) => {
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip;
  const userLogId = req.headers['userlogid'];

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

  }

  next();
};

module.exports = logger;