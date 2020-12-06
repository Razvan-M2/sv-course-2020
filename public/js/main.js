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

socketGame.on('game-loop', function (objectsForDraw) {

    document.getElementById('join-chat').classList.add('display-none');
    document.getElementById('create-game-container').classList.add('display-none');
    document.getElementById('game-container').classList.remove('display-none');
    context.drawImage(document.getElementById('map-image'), 0, 0);

    objectsForDraw.forEach(function (objectForDraw) {
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

    //  Tried to fix some bug, on creating a game, the game remains in your list even
    //  thou you created it.
    if (socketGame.id === options.gameId.substring(5))
        gameElementContainer.classList.add('display-none');

    document.getElementById('game-list').appendChild(gameElementContainer);
})

socketGame.on('remove-game-from-list', function (gameId) {
    document.getElementById(gameId).classList.add('display-none');
})

socketGame.on('game-over', function (reason) {
    console.log('Game Over!', reason);

    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = "30px gameFont";
    context.textAlign = "center";
    context.fillStyle = "black";
    context.fillText(`Game Over! ${reason}`, canvas.width / 2, canvas.height / 2);

    document.getElementById('leave-game-button').classList.remove('display-none');

})
//  Tema .2
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


//  .Tema 3

var user_1 = new Employee(
    'Mike',
    26, 1.79,
    'My Home',
    'Cleaning',
    true,
    2,
    'Everything is dirty',
    "I don't like cleaning");
var user_2 = new Employee(
    'Emma',
    27,
    1.70,
    'Envy Ink',
    'Tattoo Artist',
    false,
    6,
    'Today the coffee machine was broken',
    "I really enjoy working here");
user_1.complain();
user_2.info();
user_2.isWorking();
user_1.howIsWorking();

//  Tema .4 

//  .1
var arr = [1, -2, 6, -7, 10, 9, 14, true, false, null, undefined];

var arrNumb = arr.filter((value) => { return typeof (value) === 'number'; })
console.log('%c' + arrNumb, 'color: #6666ff');

//  .2
var arrNumb = arrNumb.map((value) => {
    return value * 10;
});
console.log('%c' + arrNumb, 'color: #ff6600');

//  .3
var result = arrNumb.reduce((initialValue, curentValue) => { return initialValue + curentValue });
console.log('%c' + result, 'color: #6666ff');
