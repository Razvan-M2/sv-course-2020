//  Tema .3 half done
const Player = require('./logic/Player');
// const Game = require('./logic/Game');

const express = require('express');
const app = express();
const server = require('http').createServer(app);

const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT;
const api = require('./logic/api');

const io = require('socket.io')(server);

server.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});

// const PLAYER_DIM = 32;
var playerCount = 0;

var counter = 0;

io.on('connection', function (socket) {

    console.log(`${socket.id} has connected`);

    // Tema .1
    socket.emit('new-value', counter);
    socket.on('increment', function (value) {
        counter = value;
        counter++;
        console.log(`New counter value in server: ${counter}`);
        socket.emit('new-value', counter);
    })


    // Chat logic
    socket.on('join-chat', function (user) {
        console.log('[USER JOINED CHAT]', socket.id, user.userName);
        //chatUsers[socket.id] = user.userName;
        chatUsers[socket.id] = user;

        //  Tema .2
        playerCount++;
        io.sockets.emit("chat-update", {
            heading: `${playerCount} players online`,
            announcementPlayer: `${user.userName} joined chat`,
            announcementColor: user.userColor
        });
        // End Tema .2

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

        //  Tema .2
        playerCount--;
        io.sockets.emit("chat-update", {
            heading: `${playerCount} players online`,
            announcementPlayer: `${chatUsers[socket.id].userName} left chat`,
            announcementColor: chatUsers[socket.id].userColor
        });
        //  End Tema .2

        delete chatUsers[socket.id];
        socket.leave('chat');
        socket.emit('menu');
    })

    //  Game Logic
    socket.on('create-game', function (gameName) {
        console.log('[NEW GAME CREATED]');
        const gameId = 'game-' + socket.id;
        const players = [new Player()];
        const game = new Game({
            id: gameId,
            players: players
        });
        games[gameId] = game;
        console.log('[User joined ' + gameId + '] room');
        socket.join(gameId);
    })

});

app.use(api);

class Game {
    constructor(options) {
        this.id = options.id
        this.players = options.players
        this.start();
    }

    start() {
        const that = this;
        setInterval(function () { gameLoop(that.id) }, 1000 / 60);
    }
}

function gameLoop(id) {
    const objectsForDraw = [];
    games[id].players.forEach(function (player) {
        objectsForDraw.push(player.forDraw());
    })
    io.to(id).emit('game-loop', objectsForDraw);
}


const chatUsers = {};
const games = {};
