
const express = require('express');
const app = express();
const logger = require('./middleware/logger')
const cors = require('cors');
const mongoose = require('mongoose');

const projectsRouter = require('./routes/project.js');
const loginController = require('./controller/loginController.js');
const registerController = require('./controller/registerController.js');
const corsOptions = require('./config/corsOptions.js');
const logs = require('./middleware/logs.js');


require('dotenv').config();


const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => logger(req, res, next));


connectDB();


app.get('/', async (req, res) => {
    res.redirect('https://ali-reza.dev')
});



// Register
app.post('/register', registerController);

// Login
app.post('/login', loginController);

app.use('/api/project', projectsRouter);

app.get('/api/logs', logs);

app.get('/health', (req, res) => {
  res.send('Backend is alive 🔥');
});


async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('Connection error:', err);
  }
}