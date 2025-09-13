// corsOptions.js
const allowedOrigins = [
  'https://ali-reza.dev',
  'https://www.ali-reza.dev',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browsers
};

module.exports = corsOptions;
