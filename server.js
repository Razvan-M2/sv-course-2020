const Game = require('./logic/classes/Game');
const SpaceRanger = require('./logic/classes/Space_ranger');
const PinkLady = require('./logic/classes/Pink_lady');
const Bullet = require('./logic/classes/Bullet');

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
            if (games[players[socket.id].gameId].players.length != 2) {
                return;
            }
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
        games[gameId].generateDiamonds();
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
            // clearInterval(game.interval);
            clearInterval(game.gameInterval);
            delete games[gameId];
            playersToRemoveIds.forEach(function (playerToRemoveId) {
                delete players[playerToRemoveId];
            })
            io.to(gameId).emit('game-over', 'player-disconnected', gameId);
        }
    })
    socket.on('leave-game-room', function () {
        io.emit('menu');
    })

    socket.on('attack', function () {
        if (players[socket.id]) {
            if (games[players[socket.id].gameId].players.length != 2) {
                return;
            }
            //          Tema .3
            const game = games[players[socket.id].gameId];
            if (!players[socket.id].isShooting) {
                game.bullets.push(new Bullet(players[socket.id]));
                players[socket.id].isShooting = true;
            }
        }
    })
});

app.use(api);

function gameLoop(roomId) {
    const game = games[roomId];
    if (game) {
        game.update();

        if (game.over) {
            const playersToRemoveIds = game.players.map(function (player) {
                return player.socketId;
            })
            clearInterval(game.gameInterval);
            delete games[roomId];
            playersToRemoveIds.forEach(function (playerToRemoveId) {
                delete players[playerToRemoveId];
            })
            io.to(roomId).emit('game-over', game.winner + '-won', roomId);
        } else {
            const objectsForDraw = [];
            const score = [];
            game.players.forEach(function (player,index) {
                objectsForDraw.push(player.forDraw());
                //  Tema .2
                score.push({player_nr:index,score:player.score});
            })
            game.diamonds.forEach(function (diamond) {
                objectsForDraw.push(diamond.forDraw());
            })
            game.bullets.forEach(function (bullet) {
                objectsForDraw.push(bullet.forDraw());
            })

            const data = {
                objectsForDraw: objectsForDraw,
                gameInProgress: game.players.length == 2,
                //  .Tema 2
                playersScores:score,
                remainingDiamonds: game.remainingDiamonds!=undefined? game.remainingDiamonds : 0
                //
            }

            if (data.gameInProgress) {
                data.score = {
                    'space-ranger': game.players[0].score,
                    'pink-lady': game.players[1].score
                }
            }
            io.to(roomId).emit('game-loop', data);
        }
    }
}

const games = {};
const players = {};
const bullets = {};

module.exports.gameLoop = gameLoop;
module.exports.games = games;