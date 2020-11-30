const canvas = document.getElementById("game-canvas");
/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext('2d');

const container = document.getElementById('showCounter');
const socket = io();


//  Tema .1
socket.on('new-value', (value) => {
    console.log(`Received new value! ${value}`)
    container.textContent = value;
})

var incrementValue = () => {
    //var value = container.textContent;
    socket.emit('increment', container.textContent);
}

// Chat logic
document.getElementById('join-chat-button').addEventListener('click', function () {
    const input = document.getElementById('user-name-input');
    const color = document.getElementById('user-color');
    const userName = input.value;
    const userColor = color.value;
    if (userName.length > 0) {
        document.getElementById('user-name-missing').classList.add('display-none');
        socket.emit('join-chat', { userName: userName, userColor: userColor });
    } else {
        document.getElementById('user-name-missing').classList.remove('display-none');
    }
})

socket.on('joined-chat', function () {
    socket.emit('new-user');
    console.log('You joined chat!');
    document.getElementById('join-chat').classList.add('display-none');
    document.getElementById('chat-container').classList.remove('display-none');
})

document.getElementById('send-message-button').addEventListener('click', function () {
    const input = document.getElementById('message');
    const message = input.value;
    input.value = "";
    socket.emit('send-message', message);
})

socket.on('new-message', function (package) {

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
    socket.emit('leave-chat');
})

socket.on('menu', function () {
    console.log('You left chat!');
    document.getElementById('join-chat').classList.remove('display-none');
    document.getElementById('chat-container').classList.add('display-none');
})

//  Tema .2
socket.on('chat-update', function (package) {

    document.getElementById('chat-header').innerHTML = package.heading;

    const messagesContainer = document.getElementById('chat-messages');

    const messageElement = document.createElement('p');
    messageElement.innerHTML = package.announcementPlayer;
    messageElement.style.color = package.announcementColor;
    messagesContainer.appendChild(messageElement);
})

document.getElementById('create-game-button').addEventListener('click', function () {

    const input = document.getElementById('game-name-input');
    const gameName = input.value;
    if (gameName.length > 0) {
        document.getElementById('game-name-missing').classList.add('display-none');
        socket.emit('create-game', gameName);
    } else {
        document.getElementById('game-name-missing').classList.remove('display-none');
    }
})

socket.on('game-loop', function (objectsForDraw) {

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