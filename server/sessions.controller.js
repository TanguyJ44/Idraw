/*
Une session est un tableau blanc stocké en mémoire vive.
Il contient les informations du tableau blanc ainsi que 2 identifiants uniques:
    - un identifiant unique de session pour la modification du tableau
    - un identifiant unique de session pour la lecture du tableau
Format:
    {
      id: '',
      owner_id: "",
      reader_id: "",
      whiteboard: {},
      last_update: "",
      io_clients: [],
      chat: []
    }
Les sessions sont supprimées de la mémoire vive après 2 heures d'inactivité.
 */
import { v4 as uuid } from 'uuid';

const sessions = [];

export const linkSocketClient = (socket, reader_id) => {
    const session = sessions.find(session => session.reader_id === reader_id);
    if (session) {
        session.io_clients.push(socket);

        socket.on('chat_sent', (message) => {
            const user = message.owner_id === session.owner_id ? 'Propriétaire' : 'Spectateur';
            const text = message.message;

            const objChat = {
                message: text,
                reader_id: reader_id,
                custom_id: message.custom_id,
                name: user
            };

            session.io_clients.forEach(client => {
                client.emit('chat', objChat);
            });

            session.chat.push(objChat);

            // limit chat to 50 messages
            if (session.chat.length > 50) {
                session.chat.shift();
            }
        });
    }
}

export const newSession = () => {
    const session = {
        id: uuid(),
        owner_id: uuid(),
        reader_id: uuid(),
        whiteboard: [],
        last_update: new Date(),
        io_clients: [],
        chat: []
    };
    sessions.push(session);
    return session;
}

export const getSession = (session_id) => {
    // return session without io_clients property
    const session =  sessions.find(session => session.owner_id === session_id);
    if (session) {
        return {
            id: session.id,
            owner_id: session.owner_id,
            reader_id: session.reader_id,
            whiteboard: session.whiteboard,
            last_update: session.last_update,
            chat: session.chat
        };
    }
};

export const addObject = (session_id, object) => {
    const session = sessions.find(session => session.owner_id === session_id);
    if (session) {
        // check if object has id attribute
        if (!object.id) return;
        session.whiteboard.push(object);
        session.last_update = new Date();

        // send object to all clients
        session.io_clients.forEach(client => {
            client.emit('new_object', object);
        });
    }
};

export const deleteObject = (session_id, object_id) => {
    const session = sessions.find(session => session.owner_id === session_id);
    if (session) {
        session.whiteboard = session.whiteboard.filter(object => object.id !== object_id);
        session.last_update = new Date();

        // send object to all clients
        session.io_clients.forEach(client => {
            client.emit('delete_object', object_id);
        });
    }
}

export const updateObject = (session_id, new_object) => {
    const session = sessions.find(session => session.owner_id === session_id);
    if (session) {
        session.last_update = new Date();
        session.whiteboard = session.whiteboard.map(object => {
            if (new_object.id === object.id) {
                return new_object;
            } else {
                return object;
            }
        });

        // send object to all clients
        session.io_clients.forEach(client => {
            client.emit('update_object', new_object);
        });

        return new_object;
    }
}

export const getSessionReader = (session_id) => {
    const session = sessions.find(session => session.reader_id === session_id);

    if (session) {
        // remove owner_id attribute from session object
        const session_copy = {...session};
        delete session_copy.owner_id;
        delete session_copy.io_clients;

        return session_copy;
    }
    return false;
}

// every 2 hours, remove sessions from memory
setInterval(() => {
    sessions.forEach(session => {
        if (new Date() - session.last_update > 1000 * 60 * 60 * 2) {
            sessions.splice(sessions.indexOf(session), 1);
        }
    });
}, 1000 * 60 * 60 * 2);
