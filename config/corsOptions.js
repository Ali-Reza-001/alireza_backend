
const allowedOrigins = [
    'https://ali-reza.dev',
    'https://www.ali-reza.dev',
]

const corsOptions = { origin: allowedOrigins, credentials: true };

module.exports = corsOptions;