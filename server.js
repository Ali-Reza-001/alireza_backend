
const express = require('express');
const app = express();
const logger = require('./middleware/logger')
const cors = require('cors');

require('dotenv').config();

app.use(cors({ origin: 'https://ali-reza.dev', credentials: true }));
app.use(express.json());

app.use((req, res, next) => logger(req, res, next));

app.get('/', async (req, res) => {
    res.redirect('https://ali-reza.dev')
})

app.get('/health', (req, res) => {
  res.send('Backend is alive 🔥');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));