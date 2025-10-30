const express = require('express');
const app = express();
const logger = require('./middleware/logger')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

app.set('trust proxy', true);
require('dotenv').config();
const PORT = process.env.PORT || 5000;

const projectsRouter = require('./routes/project.js');
const usersControl = require('./routes/usersControl.js');
const logsControl = require('./routes/logsControl.js');
const blogsControl = require('./routes/blogsControl.js');
const refreshController = require('./controller/refreshController');
const loginController = require('./controller/loginController.js');
const registerController = require('./controller/registerController.js');
const corsOptions = require('./config/corsOptions.js');
const verifyUser = require('./middleware/verifyUser.js');
const verifyRole = require('./middleware/verifyRole.js');
const verifyEmail = require('./middleware/verifyEmail.js');
const roles = require('./config/roles.js');
const profilePic = require('./middleware/profilePic.js');
const resendEmailVerification = require('./middleware/resendEmailVerification');
const userOnlineStatus = require('./middleware/userOnlineStatus.js');
const socketCorsOptions = require('./config/socketCorsOptions.js');
const redirectRoot = require('./routes/redirectRoot.js');
const officialEmail = require('./middleware/officialEmail.js');
const uploadBlog = require('./middleware/uploadBlog.js');
const blogUserData = require('./middleware/blogUserData.js');

app.use(cors(corsOptions));
app.options('/{*splat}', cors(corsOptions)); // Handles preflight
app.use(express.json());
app.use(cookieParser());
connectDB();

const server = http.createServer(app); 
const io = new Server(server, socketCorsOptions);

io.on('connection', userOnlineStatus);

app.use(logger);

app.get('/', redirectRoot);

app.post('/register', registerController);

app.get('/verify', verifyEmail);

app.post('/login', loginController);

app.get('/auth/refresh', refreshController);

app.post('/resend-verification', resendEmailVerification);

app.get('/blog-user-data/:id', blogUserData);


// Protected Routes
app.use('/api', verifyUser);

app.post('/api/upload-profile-pic', profilePic);

app.post('/api/upload-blog', uploadBlog);

app.use('/api/blogsControl', blogsControl);

app.get('/api/admin', verifyRole(roles.Admin),(req, res) => {res.json({message: 'You are the admin.'})});

app.use('/api/project', projectsRouter);

app.use('/api/logsControl', logsControl);

app.use('/api/usersControl', usersControl);

app.use('/api/official-email', officialEmail);


// 404 handler
app.use((req, res) => {
  console.log(req.originalUrl);
  res.status(404).json({ message: 'Route not found' });
});

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('Connection error:', err);
  }
}