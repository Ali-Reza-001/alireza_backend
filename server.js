
const express = require('express');
const app = express();
const logger = require('./middleware/logger')
const cors = require('cors');
const mongoose = require('mongoose');

app.set('trust proxy', true);
require('dotenv').config();


const projectsRouter = require('./routes/project.js');
const refresh = require('./routes/refresh.js');
const loginController = require('./controller/loginController.js');
const registerController = require('./controller/registerController.js');
const corsOptions = require('./config/corsOptions.js');
const logs = require('./middleware/logs.js');
const users = require('./middleware/users.js');
const verifyUser = require('./middleware/verifyUser.js');


const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.options('/{*splat}', cors(corsOptions)); // Handles preflight
app.use(express.json());

app.use((req, res, next) => logger(req, res, next));


connectDB();


app.get('/', (req, res) => {
  if (req.headers.accept?.includes('text/html')) {
    res.redirect('https://ali-reza.dev');
  } else {
    res.status(200).send('API root');
  }
});

app.get('/health', (req, res) => {
  res.send('Backend is alive 🔥');
});


// Register
app.post('/register', registerController);

// Login
app.post('/login', loginController);

app.use('/auth/refresh', refresh);

// Protected Routes
app.use((req, res, next) => verifyUser(req, res ,next));

app.get('/admin', (req, res) => {res.send('allowed')})

app.use('/api/project', projectsRouter);

app.get('/api/logs', logs);

app.get('/api/users', users);


async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('Connection error:', err);
  }
}