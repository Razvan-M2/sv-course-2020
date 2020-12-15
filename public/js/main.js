const canvas = document.getElementById("game-canvas");
/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext('2d');

const container = document.getElementById('showCounter');
const socketGame = io('http://localhost:3000');
const socketChat = io('http://localhost:5050');

// Chat socket
document.getElementById('join-chat-button').addEventListener('click', function () {
    const input = document.getElementById('user-name-input');
    const color = document.getElementById('user-color');
    const userName = input.value;
    const userColor = color.value;
    if (userName.length > 0) {
        document.getElementById('user-name-missing').classList.add('display-none');
        socketChat.emit('join-chat', { userName: userName, userColor: userColor });
    } else {
        document.getElementById('user-name-missing').classList.remove('display-none');
    }
})

socketChat.on('joined-chat', function () {
    socketChat.emit('new-user');
    document.getElementById('join-chat').classList.add('display-none');
    document.getElementById('chat-container').classList.remove('display-none');
})

document.getElementById('send-message-button').addEventListener('click', function () {
    const input = document.getElementById('message');
    const message = input.value;
    input.value = "";
    socketChat.emit('send-message', message);
})

socketChat.on('new-message', function (package) {

    const messagesContainer = document.getElementById('chat-messages');

    const messageElement = document.createElement('p');
    messagesContainer.appendChild(messageElement);

    const userTag = document.createElement('span');
    userTag.innerHTML = package.userName + " : ";
    messageElement.appendChild(userTag);

    const userMessage = document.createElement('span');
    userMessage.innerHTML = package.message;
    userMessage.style.color = package.userColor;
    messageElement.appendChild(userMessage);
})

document.getElementById('leave-chat-button').addEventListener('click', function () {
    socketChat.emit('leave-chat');
})

socketChat.on('menu', function () {
    document.getElementById('join-chat').classList.remove('display-none');
    document.getElementById('chat-container').classList.add('display-none');
})

socketChat.on('chat-update', function (package) {

    document.getElementById('chat-header').innerHTML = package.heading;

    const messagesContainer = document.getElementById('chat-messages');

    const messageElement = document.createElement('p');
    messageElement.innerHTML = package.announcementPlayer;
    messageElement.style.color = package.announcementColor;
    messagesContainer.appendChild(messageElement);
})

//  Game socket
document.getElementById('create-game-button').addEventListener('click', function () {

    const input = document.getElementById('game-name-input');
    const gameName = input.value;
    input.value = "";
    if (gameName.length > 0) {
        document.getElementById('game-name-input').classList.add('display-none');
        socketGame.emit('create-game', gameName);
    } else {
        document.getElementById('game-name-input').classList.remove('display-none');
    }
})

socketGame.on('game-loop', function (data) {

    document.getElementById('join-chat').classList.add('display-none');
    document.getElementById('create-game-container').classList.add('display-none');
    document.getElementById('game-container').classList.remove('display-none');
    //  Tema .2
    document.getElementById('remaining-diamonds-container').innerText = data.remainingDiamonds;
    document.getElementById('space-ranger-score-container').innerText = data.playersScores[0].score;
    document.getElementById('pink-lady-score-container').innerText = data.playersScores[1].score;
    //

    context.drawImage(document.getElementById('map-image'), 0, 0);

    data.objectsForDraw.forEach(function (objectForDraw) {
        context.drawImage(
            document.getElementById(objectForDraw.imageId),
            ...objectForDraw.drawImageParameters
        )
    })
})

document.addEventListener("keydown", function (event) {
    switch (event.key) {
        case 'ArrowUp':
            socketGame.emit('start-moving-player', 'up');
            break;
        case 'ArrowDown': {
            socketGame.emit('start-moving-player', 'down');
            break;
        }
        case 'ArrowLeft': {
            socketGame.emit('start-moving-player', 'left');
            break;
        }
        case 'ArrowRight': {
            socketGame.emit('start-moving-player', 'right');
            break;
        }
        case ' ': {
            socketGame.emit('attack');

            break;
        }
    }
})

document.addEventListener('keyup', function (event) {
    switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
            socketGame.emit('stop-moving-player', 'dy');
            break;
        case 'ArrowLeft':
        case 'ArrowRight':
            socketGame.emit('stop-moving-player', 'dx');
            break;
    }
})

socketGame.on('add-game-to-list', function (options) {
    const gameElementContainer = document.createElement('div');
    gameElementContainer.classList.add('game-element');
    gameElementContainer.id = options.gameId;

    const gameNameElement = document.createElement('p');
    gameNameElement.innerHTML = options.gameName;
    const joinGameButton = document.createElement('button');
    joinGameButton.innerHTML = 'Join Game!';

    joinGameButton.addEventListener('click', function () {
        socketGame.emit('join-game', options.gameId);
    })

    gameElementContainer.appendChild(gameNameElement);
    gameElementContainer.appendChild(joinGameButton);

    if (socketGame.id === options.gameId.substring(5))
        gameElementContainer.classList.add('display-none');

    document.getElementById('game-list').appendChild(gameElementContainer);
})

socketGame.on('remove-game-from-list', function (gameId) {
    document.getElementById(gameId).classList.add('display-none');
})

socketGame.on('game-over', function (imageId, gameId) {
    context.drawImage(document.getElementById(imageId), 0, 0);

    document.getElementById('leave-game-button').classList.remove('display-none');

})

document.getElementById('leave-game-button').addEventListener('click', function () {
    socketGame.emit('leave-game-room');
    document.getElementById('leave-game-button').classList.add('display-none');
})

socketGame.on('menu', function () {
    document.getElementById('game-container').classList.add('display-none');
    document.getElementById('create-game-container').classList.remove('display-none');
    document.getElementById('join-chat').classList.remove('display-none');
    document.getElementById('game-name-input').classList.remove('display-none');
})
