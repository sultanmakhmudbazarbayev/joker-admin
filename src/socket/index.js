// In file: utils/socketService.js
import io from 'socket.io-client';

// This should point to the server where your Socket.IO server is running
const SOCKET_SERVER_URL = 'http://localhost:3001'; 

export const initSocket = () => {
  const socket = io(SOCKET_SERVER_URL);
  socket.on('connect', () => {
    console.log('Connected to socket server');
  });

  return socket;
};

export const disconnectSocket = (socket) => {
  if (socket) socket.disconnect();
};

export const subscribeToEvent = (socket, eventName, callback) => {
  if (socket && typeof socket.on === 'function') {
      socket.on(eventName, callback);
  } else {
      console.error('Invalid socket instance provided');
  }
};

export const emitEvent = (socket, eventName, data) => {
  if (!socket) return;
  socket.emit(eventName, data);
};
