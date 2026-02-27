require("dotenv").config();
const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: process.env.BASE_URL,
        credentials: true
    }
});
//นี้คือการครอบ app ด้วย http server และครอบด้วย io อีกที เพื่อให้สามารถใช้ socket.io ได้
const userSocketMap = []; // {userId: socketId}
function getRecipientSocketId(userId){
    return userSocketMap[userId];
}

io.on('connection', (socket) => {
  console.log("มีคนเชื่อมต่อเขามาแล้วนะไอสัส", socket.id);
  const userId = socket.handshake.query.userId; //รับค่า userId จาก client
  if(userId){
    userSocketMap[userId] = socket.id; //เก็บค่า userId และ socket.id ไว้ใน userSocketMap
    console.log("userSocketMap", userSocketMap);
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap)); //ส่งค่า userId และ socket.id ไว้ใน userSocketMap
  socket.on('event', data => { /* … */ });
  socket.on('disconnect', () => {
    console.log("มีคนตัดการเชื่อมต่อแล้วนะไอสัส", socket.id);
    delete userSocketMap[userId]; //ลบค่า userId และ socket.id ออกจาก userSocketMap
    console.log("userSocketMap", userSocketMap);
  });
});

module.exports = {io, app, server, getRecipientSocketId};
