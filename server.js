const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });
let sockets = [];

wss.on('connection', socket => {
  sockets.push(socket);
  console.log("WebSocket server running on ws://localhost:3000");
    console.log('New client connected. Total clients:', sockets.length);

  socket.on('message', msg => {
    // 轉發給其他人
    sockets.forEach(s => {
      if (s !== socket && s.readyState === WebSocket.OPEN) {
        try {
          s.send(msg);
        } catch (err) {
          console.error('Error sending message:', err);
        }
      }
    });
  });

  socket.on('close', () => {
    // 移除已關閉的連線
    sockets = sockets.filter(s => s !== socket);
  });

  socket.on('error', err => {
    console.error('Socket error:', err);
  });
});