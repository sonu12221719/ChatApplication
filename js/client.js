const socket = io('http://localhost:8000');

const form = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const messageContainer = document.querySelector('.messages');
const chatHeader = document.querySelector('.chat-header');

var audioReceive = new Audio('received_message.mp3'); // Ensure you have a notification sound file
var audioSend = new Audio('sendmessage.mp3'); // Ensure you have a notification sound file
const appendMessage = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    audioReceive.play(); // Play sound for received messages
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = chatInput.value;
    appendMessage(`You: ${message}`, 'sent');
    socket.emit('send', message);
    audioSend.play(); // Play sound for sent messages
    chatInput.value = '';
});

const userName = prompt('Enter your name to join');
socket.emit('new-user-joined', userName);

chatHeader.innerText = `${userName}`;

socket.on('user-joined', name => {
    appendMessage(`${name} joined the chat`, 'received');
});

socket.on('receive', data => {
    appendMessage(`${data.name}: ${data.message}`, 'received');
});

socket.on('left', name => {
    appendMessage(`${name} left the chat`, 'received');
});