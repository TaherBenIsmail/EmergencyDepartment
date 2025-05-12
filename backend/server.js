// server.js
// ✅ MongoDB connection
require('./config/db');

// ✅ Required modules
const express       = require('express');
const session       = require('express-session');
const passport      = require('passport');
const cors          = require('cors');
const cookieParser  = require('cookie-parser');
const MongoStore    = require('connect-mongo');
const http          = require('http');
const { PythonShell } = require('python-shell');
require('dotenv').config();

// ✅ Initialize Express app
const app   = express();
const port  = process.env.PORT || 3000;
const socketIo = require('socket.io');

// ✅ Import routers
const consultationRouter = require('./api/routes/consultationRoutes');
const rendezVousRouter   = require('./api/routes/rendezVousRoutes');
const UserRouter         = require('./api/User');
const RoomRouter         = require('./api/roomManagement');
const DocumentRouter     = require('./api/Document');
const chatRouter         = require('./api/chat');
const makeappointmentRouter = require('./api/makeappointment');
const SpecialiteRouter   = require('./api/Specialite');
const paiementRouter     = require('./api/routes/paiementRoutes');
const triageRouter       = require('./api/routes/triage'); // route ML prediction

// ✅ Middleware configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3001',
    'http://localhost:3002'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecretkey',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/EmergencyMangment',
    ttl: 24 * 60 * 60
  }),
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// ✅ Test session route
app.get('/test-session', (req, res) => {
  req.session.test = 'Session is working!';
  res.json({ message: 'Session saved!', session: req.session });
});

// ✅ Application routes
app.use('/user', UserRouter);
app.use('/room', RoomRouter);
app.use('/specialite', SpecialiteRouter);
app.use('/document', DocumentRouter);
app.use('/chat', chatRouter);
app.use('/makeappointment', makeappointmentRouter);
app.use('/api/consultations', consultationRouter);
app.use('/api/paiements', paiementRouter);
app.use('/api/rendez-vous', rendezVousRouter);
app.use('/api/triage', triageRouter);

// ✅ Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io     = socketIo(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:3001',
      'http://localhost:3002'
    ],
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);
  });

  socket.on('offer', (offer, roomId, userId) => {
    socket.to(roomId).emit('offer', offer, userId);
  });

  socket.on('answer', (answer, roomId, userId) => {
    socket.to(roomId).emit('answer', answer, userId);
  });

  socket.on('ice-candidate', (candidate, roomId, userId) => {
    socket.to(roomId).emit('ice-candidate', candidate, userId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// ✅ Start server
server.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
