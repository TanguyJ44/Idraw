import {handlePreviousMessages} from "./chat.js";

// Add fabric library
export const canvas = new fabric.Canvas('main');
import {getOwnerSession, getReaderSession, newSession} from './sessions.controller.js';

// Define front / back url
const frontendUrl = 'http://localhost/';
const backendUrl = 'http://localhost:8000/';

// Connect to socket server
export let socket = io.connect(backendUrl);

// Set canvas size & resize
canvas.setDimensions({
    width: document.body.clientWidth,
    height: document.body.clientHeight
})

// Adjust canvas size when window is resized
window.addEventListener('resize', function () {
    canvas.setWidth(document.body.clientWidth);
    canvas.setHeight(document.body.clientHeight);
});

// Default disable object selection
canvas.selection = false;

export let g_session;
let g_owner_session = false;

// Check if URL contains session_id
const checkSession = async () => {
    const url = window.location.href;

    g_owner_session = !url.includes('spectate');
    const session_id = url.split('/')[url.split('/').length - 1];
    if (session_id) {
        const session = g_owner_session ? await getOwnerSession(session_id) : await getReaderSession(session_id);
        if (session) {
            g_session = session;
            canvas.loadFromJSON({
                objects: session.whiteboard
            }, () => {
                canvas.renderAll();
                updateToObject();
            });

            // Load previous messages
            handlePreviousMessages(session.chat);

            // Init session and object listeners
            initSession();
        } else {
            window.location.href = frontendUrl;
        }
    } else {
        // Reload active session if no session_id
        await refreshSession();
    }
}

// Update canvas with existing objects
const updateToObject = () => {
    canvas.getObjects().forEach(obj => {
        obj.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    id: obj.id
                });
            };
        })(obj.toObject);
    });
}

const appendZero = (num) => {
    return num < 10 ? `0${num}` : num;
}

// Format date from french ISO string
// ex : 01/01/2020 00:00:00
const frDateFromIso = (iso) => {
    const date = new Date(iso);
    return `${appendZero(date.getDate())}/${appendZero(date.getMonth() + 1)}/${date.getFullYear()} ${date.getHours()}:${appendZero(date.getMinutes())}:${appendZero(date.getSeconds())}`;
}

// Disable editing canavs (spectators)
const disableEditing = () => {
    canvas.forEachObject(obj => {
        obj.selectable = false;
    });
};

// Init session by id (for new session or existing session (spectators))
const initSession = () => {
    const id_split = g_session.id.split('-');
    document.querySelector('#whiteboard_id').innerHTML = id_split[id_split.length - 1];
    document.querySelector('#last_edit').innerHTML = frDateFromIso(g_session.last_update);

    // Close all socket connections and open new one
    socket.disconnect();
    socket.connect();
    socket.on("connect", () => {
        socket.emit('reader_id', g_session.reader_id);
    });

    // Disable all editing
    if (!g_owner_session) {
        document.querySelector('#tools').style.display = 'none';
        document.querySelector('#colors').style.display = 'none';
        canvas.off('object:modified');
        canvas.off('object:added');
        canvas.off('object:removed');

        // Add new listeners
        socket.on('new_object', (data) => {
            fabric.util.enlivenObjects([data], function (enlivenedObjects) {
                enlivenedObjects.forEach(function (obj, index) {
                    canvas.add(obj);
                });
                canvas.renderAll();
            });
            disableEditing();
            updateDate();
        });

        // Remove object on canvas
        socket.on('delete_object', (object_id) => {
            canvas.getObjects().forEach(obj => {
                if (obj.id === object_id) {
                    canvas.remove(obj);
                }
            });
            canvas.renderAll();
            updateDate();
        });

        // Update object on canvas
        socket.on('update_object', (data) => {
            canvas.getObjects().forEach(obj => {
                if (obj.id === data.id) {
                    obj.set(data);
                }
            });
            canvas.renderAll();
            disableEditing();
            updateDate();
        });

        // Make all objects unselectable (spectators)
        disableEditing();
    }
}

// Update last update date (with each new modification)
const updateDate = () => {
    g_session.last_update = new Date();
    document.querySelector('#last_edit').innerHTML = frDateFromIso(g_session.last_update);
}

// Refresh existing session (with page refresh or refresh button pressed)
const refreshSession = async () => {
    const session = await newSession();
    g_session = session;
    canvas.loadFromJSON(session.whiteboard, canvas.renderAll.bind(canvas));
    window.history.pushState({}, '', `${frontendUrl}session/${session.owner_id}`);
    document.querySelector('#chat .content').innerHTML = '';
    await checkSession();
}

// Refresh current session when refresh button is pressed
document.querySelector('#refresh').addEventListener('click', async () => {
    await refreshSession();
});

// Add canvas object event listeners (call back)
canvas.on('object:modified', handleObjectChange);
canvas.on('object:added', handleObjectAdded);
canvas.on('object:removed', handleObjectDelete);

// Update object on canvas when object is modified
async function handleObjectChange(elem) {
    if (!g_owner_session) return;

    await fetch(backendUrl + 'session/' + g_session.owner_id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(elem.target)
    });

    updateDate();
}

// Add object on canvas when object is added
async function handleObjectAdded(elem) {
    if (!g_owner_session) return;

    await fetch(backendUrl + 'session/' + g_session.owner_id, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(elem.target)
    });

    updateDate();
}

// Remove object on canvas when object is removed
async function handleObjectDelete(elem) {
    if (!g_owner_session) return;

    await fetch(backendUrl + 'session/' + g_session.owner_id, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({object_id: elem.target.id})
    });

    updateDate();
}

// Check session status (if it's still active)
(async () => {
    await checkSession();
})();

// Copy session id to clipboard (for sharing)
async function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        return;
    }
    await navigator.clipboard.writeText(text);
}

// Copy session id to clipboard with share button click
document.querySelector('.share').addEventListener('click', async () => {
    const url = frontendUrl + 'session/spectate/' + g_session.reader_id;
    Swal.fire('Lien spectateur : <a href="' + url + '" target="_blank">' + url + '</a>');
});

// Logout user and redirect to login page
document.querySelector('.logout').addEventListener('click', async () => {
    let pseudo = sessionStorage.getItem('pseudo');
    let titleMsg = '';

    if (pseudo === null) {
        titleMsg = 'Souhaitez-vous quitter la zone de dessin ?';
    } else {
        titleMsg = pseudo + ', souhaitez-vous vous déconnecter ?'
    }

    Swal.fire({
        title: titleMsg,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Oui',
        confirmButtonColor: '#7066e0',
        denyButtonText: 'Annuler',
    }).then((result) => {
        if (result.isConfirmed) {
            sessionStorage.clear();
            window.location.href = '/auth/login';
        }
    })
});
