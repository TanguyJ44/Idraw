import { g_session, socket } from "./custom.js";

const toggler = document.getElementById('toggle-chat');
const chat = document.getElementById('chat');

// Toggle chat when button is clicked
toggler.addEventListener('click', () => {
    document.body.classList.toggle('chat-open');
    chat.classList.toggle('chat-open');
});

document.querySelector('#chat-submit').addEventListener('click', async () => {
    await sendChatMessage();
});

// random 32 character string
const custom_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export const sendChatMessage = async () => {
    const message = document.getElementById('chat-input').value.trim();
    if (!message) return;

    socket.emit('chat_sent', {
        message: message,
        custom_id: custom_id,
        reader_id: g_session.reader_id,
        owner_id: g_session.owner_id ? g_session.owner_id : null
    });

    document.getElementById('chat-input').value = '';
}

const htmlEntities = (str) => {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export const handlePreviousMessages = (messages) => {
    messages.forEach(handleMessage);

    socket.on('chat', (message) => {
        handleMessage(message);
    });
}

const handleMessage = (message) => {
    const chat = document.querySelector('#chat .content');

    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    const avatar = document.createElement('span');
    avatar.classList.add('avatar');

    const text = document.createElement('span');
    text.classList.add('text');

    avatar.innerHTML = message.name;
    text.innerHTML = htmlEntities(message.message);

    if(message.custom_id === custom_id || message.name === 'Propriétaire' && g_session.owner_id) {
        avatar.innerHTML = 'Vous';
    }

    messageElement.appendChild(avatar);
    messageElement.appendChild(text);
    chat.appendChild(messageElement);
    chat.scrollTop = chat.scrollHeight;
}
