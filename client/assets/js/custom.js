import {handlePreviousMessages} from "./chat.js";

export const canvas = new fabric.Canvas('main');
import {getOwnerSession, getReaderSession, newSession} from './sessions.controller.js';

const frontendUrl = 'http://localhost:3000/';
const backendUrl = 'http://localhost:8000/';

export let socket = io.connect(backendUrl);

// canvas size & resize
canvas.setDimensions({
    width: document.body.clientWidth,
    height: document.body.clientHeight
})

window.addEventListener('resize', function () {
    canvas.setWidth(document.body.clientWidth);
    canvas.setHeight(document.body.clientHeight);
});

canvas.selection = false;

export let g_session;
let g_owner_session = false;
// check if URL contains session_id
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

            handlePreviousMessages(session.chat);

            initSession();
        } else {
            window.location.href = frontendUrl;
        }
    } else {
        await refreshSession();
    }
}

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

const frDateFromIso = (iso) => {
    const date = new Date(iso);
    return `${appendZero(date.getDate())}/${appendZero(date.getMonth() + 1)}/${date.getFullYear()} ${date.getHours()}:${appendZero(date.getMinutes())}:${appendZero(date.getSeconds())}`;
}

const disableEditing = () => {
    canvas.forEachObject(obj => {
        obj.selectable = false;
    });
};

const initSession = () => {
    const id_split = g_session.id.split('-');
    document.querySelector('#whiteboard_id').innerHTML = id_split[id_split.length - 1];
    document.querySelector('#last_edit').innerHTML = frDateFromIso(g_session.last_update);

    socket.disconnect();
    socket.connect();
    socket.on("connect", () => {
        socket.emit('reader_id', g_session.reader_id);
    });

    // if !g_owner_session, then disable all editing
    if (!g_owner_session) {
        document.querySelector('#tools').style.display = 'none';
        document.querySelector('#colors').style.display = 'none';
        canvas.off('object:modified');
        canvas.off('object:added');
        canvas.off('object:removed');

        // add listeners
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

        socket.on('delete_object', (object_id) => {
            canvas.getObjects().forEach(obj => {
                if (obj.id === object_id) {
                    canvas.remove(obj);
                }
            });
            canvas.renderAll();
            updateDate();
        });

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

        // make all objects unselectable
        disableEditing();
    }
}

const updateDate = () => {
    g_session.last_update = new Date();
    document.querySelector('#last_edit').innerHTML = frDateFromIso(g_session.last_update);
}

const refreshSession = async () => {
    const session = await newSession();
    g_session = session;
    canvas.loadFromJSON(session.whiteboard, canvas.renderAll.bind(canvas));
    window.history.pushState({}, '', `${frontendUrl}session/${session.owner_id}`);
    document.querySelector('#chat .content').innerHTML = '';
    await checkSession();
}

document.querySelector('#refresh').addEventListener('click', async () => {
    await refreshSession();
});

canvas.on('object:modified', handleObjectChange);
canvas.on('object:added', handleObjectAdded);
canvas.on('object:removed', handleObjectDelete);

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

(async () => {
    await checkSession();
})();

async function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        return;
    }
    await navigator.clipboard.writeText(text);
}

document.querySelector('.share').addEventListener('click', async () => {
    const url = frontendUrl + 'session/spectate/' + g_session.reader_id;
    await copyTextToClipboard(url);
    Swal.fire('Lien spectateur copié dans le presse-papier');
});

document.querySelector('.logout').addEventListener('click', async () => {
    const pseudo = sessionStorage.getItem('pseudo');

    Swal.fire({
        title: pseudo + ', souhaitez-vous vous déconnecter ?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Oui',
        confirmButtonColor: '#27ae60',
        denyButtonText: 'Annuler',
    }).then((result) => {
        if (result.isConfirmed) {
            sessionStorage.clear();
            window.location.href = '/auth/login';
        }
    })
});
