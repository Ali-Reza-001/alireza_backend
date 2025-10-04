const express = require('express');
const app = express();
const logger = require('./middleware/logger')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

app.set('trust proxy', true);
require('dotenv').config();
const PORT = process.env.PORT || 5000;

const projectsRouter = require('./routes/project.js');
const usersControl = require('./routes/usersControl.js');
const refreshController = require('./controller/refreshController');
const loginController = require('./controller/loginController.js');
const registerController = require('./controller/registerController.js');
const corsOptions = require('./config/corsOptions.js');
const logs = require('./middleware/logs.js');
const verifyUser = require('./middleware/verifyUser.js');
const verifyRole = require('./middleware/verifyRole.js');
const verifyEmail = require('./middleware/verifyEmail.js');
const roles = require('./config/roles.js');
const profilePic = require('./middleware/profilePic.js');

app.use(cors(corsOptions));
app.options('/{*splat}', cors(corsOptions)); // Handles preflight
app.use(express.json());
app.use(cookieParser());
connectDB();

app.use(logger);

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

// Email Verification
app.get('/verify', verifyEmail);

// Login
app.post('/login', loginController);

app.get('/auth/refresh', refreshController);

// Protected Routes
app.use('/api',verifyUser);

// Controlling the user's picture upload
app.post('/api/upload-profile-pic', profilePic);

app.get('/api/admin', verifyRole(roles.Admin),(req, res) => {res.json({message: 'You are the admin.'})})

app.use('/api/project', projectsRouter);

app.get('/api/logs', logs);

app.use('/api/usersControl', usersControl);

// 404 handler
app.use((req, res) => {
  console.log(req.originalUrl);
  res.status(404).json({ message: 'Route not found' });
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