const DOMAIN = require('./DOMAIN.js');

const socketCorsOptions = {
  cors: {
    origin: [
      DOMAIN.original,
      'https://alireza-qtbmpxy9s-alirezas-projects-3b87abb8.vercel.app'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
}

module.exports = socketCorsOptions;