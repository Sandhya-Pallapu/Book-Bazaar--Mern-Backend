// src/socket.js
import { io } from 'socket.io-client';

const socket = io('https://book-bazaar-mern-backend.onrender.com'); // Or your deployed backend URL

export default socket;
