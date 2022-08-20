import { g_session, socket } from "./custom.js";

// Scope chat element
const toggler = document.getElementById('toggle-chat');
const chat = document.getElementById('chat');

// Toggle chat when button is clicked
toggler.addEventListener('click', () => {
    document.body.classList.toggle('chat-open');
    chat.classList.toggle('chat-open');
});

// Send message when button is clicked
document.querySelector('#chat-submit').addEventListener('click', async () => {
    await sendChatMessage();
});

// Create chat session id
// random 32 character string
const custom_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// Send message with socket
export const sendChatMessage = async () => {
    const message = document.getElementById('chat-input').value.trim();
    if (!message) return;

    socket.emit('chat_sent', {
        message: message,
        custom_id: custom_id,
        reader_id: g_session.reader_id,
        owner_id: g_session.owner_id ? g_session.owner_id : null
    });

    // Clear input message box
    document.getElementById('chat-input').value = '';
}

// Special characters patch
const htmlEntities = (str) => {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Load previous messages for new client connection
export const handlePreviousMessages = (messages) => {
    messages.forEach(handleMessage);

    socket.on('chat', (message) => {
        handleMessage(message);
    });
}

// Build message element
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
