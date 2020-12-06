//  Tema .1
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

const io = require('socket.io')(server);

server.listen('5050', () => {
    console.log(`Listening to port 5050`);
});

io.on('connection', function (socket) {
    console.log(`${socket.id} has connected`);

    socket.join('menu');
    // Chat logic
    socket.on('join-chat', function (user) {
        console.log('[USER JOINED CHAT]', socket.id, user.userName);
        chatUsers[socket.id] = user;
        Object.keys(chatUsers).length++;
        io.emit("chat-update", {
            heading: `${Object.keys(chatUsers).length} players online`,
            announcementPlayer: `${user.userName} joined chat`,
            announcementColor: user.userColor
        });

        socket.join('chat');
        socket.emit('joined-chat');
    })
    socket.on('send-message', function (message) {
        console.log('[USER SENT MESSAGE]', message);
        io.to('chat').emit('new-message',
            {
                userColor: chatUsers[socket.id].userColor,
                message: message,
                userName: chatUsers[socket.id].userName
            });
    })
    socket.on('leave-chat', function () {
        console.log('[USER LEFT CHAT]', socket.id);
        io.emit("chat-update", {
            heading: `${Object.keys(chatUsers).length - 1} players online`,
            announcementPlayer: `${chatUsers[socket.id].userName} left chat`,
            announcementColor: chatUsers[socket.id].userColor
        });
        Object.keys(chatUsers).length--;
        delete chatUsers[socket.id];
        socket.leave('chat');
        socket.emit('menu');
    })
});

const chatUsers = {};