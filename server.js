const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');


const userRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const wishlistRoutes = require('./routes/wishListRoutes');
const adminRoutes = require('./routes/adminRoutes');
const messageRoutes = require('./routes/messageRoutes');
const User = require('./models/User');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "https://book-bazaar-mern-frontend-gq97.vercel.app/",
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  socket.on('join', (email) => {
    socket.join(email);
    console.log(` User with email ${email} joined their room`);
  });

  socket.on('sendMessage', ({ senderEmail, receiverEmail, content }) => {
    console.log(`Message from ${senderEmail} to ${receiverEmail}: ${content}`);
    io.to(receiverEmail).emit('receiveMessage', {
      senderEmail,
      content,
      createdAt: new Date(),
    });
  });

  socket.on('disconnect', () => {
    console.log(' Client disconnected:', socket.id);
  });
});

app.use(cors({ origin: 'https://book-bazaar-mern-frontend.onrender.com', credentials: true }));
app.use(express.json());


app.use(async (req, res, next) => {
  const email = req.headers['x-user-email'];
  if (email) {
    const user = await User.findOne({ email });
    if (user) req.user = user;
  }
  next();
});


app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);


app.get('/', (req, res) => {
  res.send('API is running...');
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(` Server with Socket.IO running on port ${PORT}`));
