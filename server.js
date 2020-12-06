const Game = require('./logic/classes/Game');
const SpaceRanger = require('./logic/classes/Space_ranger');
const PinkLady = require('./logic/classes/Pink_lady');

const express = require('express');
const app = express();
const server = require('http').createServer(app);

const dotenv = require('dotenv');
dotenv.config();

const PORT_GAME = process.env.PORT_GAME;
const api = require('./logic/api');

const io = require('socket.io')(server);

server.listen(PORT_GAME, () => {
    console.log(`Listening to port ${PORT_GAME}`);
});

io.on('connection', function (socket) {

    console.log(`${socket.id} has connected`);

    socket.join('menu');
    Object.keys(games).forEach(function (gameId) {
        if (games[gameId].players.length === 1) {
            socket.emit('add-game-to-list', { gameName: games[gameId].name, gameId: gameId })
        }
    })
    //  Game Logic
    socket.on('create-game', function (gameName) {
        console.log('[NEW GAME CREATED]');
        const gameId = 'game-' + socket.id;
        players[socket.id] = new SpaceRanger({ gameId: gameId, socketId: socket.id });
        const game = new Game({
            id: gameId,
            players: [players[socket.id]],
            name: gameName
        });
        games[gameId] = game;
        console.log('[User joined ' + gameId + '] room');
        socket.join(gameId);
        io.to('menu').emit('add-game-to-list', { gameName: gameName, gameId: gameId })
    })
    socket.on('start-moving-player', function (direction) {
        if (players[socket.id]) {
            players[socket.id].startMoving(direction);
            // console.log('[MOVE PLAYER]', direction)
        }
    })
    socket.on('stop-moving-player', function (axis) {
        if (players[socket.id]) {
            players[socket.id].stopMoving(axis);
            // console.log('[STOP PLAYER]', axis)
        }
    })
    socket.on('join-game', function (gameId) {
        console.log(`[SOCKET ${socket.id} JOINED GAME ${gameId}]`);
        players[socket.id] = new PinkLady({ gameId: gameId, socketId: socket.id });
        games[gameId].players.push(players[socket.id]);
        socket.join(gameId);
        io.to('menu').emit('remove-game-from-list', gameId);
    })
    socket.on('disconnect', function () {
        console.log(`[SOCKET ${socket.id} DISCONNECTED]`);
        if (players[socket.id]) {
            const gameId = players[socket.id].gameId;
            const game = games[gameId];
            const playersToRemoveIds = game.players.map(function (player) {
                return player.socketId;
            })
            clearInterval(game.interval);
            delete games[gameId];
            playersToRemoveIds.forEach(function (playerToRemoveId) {
                delete players[playerToRemoveId];
            })
            io.to(gameId).emit('game-over', 'A player disconnected');
        }
    })
    //  Tema .2
    socket.on('leave-game-room', function () {
        io.emit('menu');
    })
});

app.use(api);

function gameLoop(id) {
    if (games[id]) {
        games[id].update();
        const objectsForDraw = [];
        games[id].players.forEach(function (player) {
            objectsForDraw.push(player.forDraw());
        })
        io.to(id).emit('game-loop', objectsForDraw);
    }
}

const games = {};
const players = {};

module.exports.gameLoop = gameLoop;




