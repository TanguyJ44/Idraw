import express from 'express';
import {
    Server
} from "socket.io";
import http from 'http';

import {
    createNewAccount,
    loginUser,
    confirmEmail,
} from './auth.controller.js';

import {
    addObject,
    deleteObject,
    getSession,
    getSessionReader,
    linkSocketClient,
    newSession,
    updateObject
} from './sessions.controller.js';

const app = express()
const server = http.createServer(app);
const io = new Server(server);

// Interprete data as arraybuffer
app.use(express.urlencoded({
    extended: true
}))

// Use application/json for requests
app.use(express.json());

// Initialize socket connection
io.on('connection', (socket) => {
    socket.on('reader_id', (id) => {
        linkSocketClient(socket, id);
        socket.emit('connected');
    });
});

// Start server on port 8000
server.listen(8000, () => {
    console.log('Server is running on port 8000');
});

// Disable CORS origin restriction
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Create a new account
app.post('/auth/register', (req, res) => {
    const register = createNewAccount(req.body);

    register.then(result => {
        if (result) {
            res.status(200).send('Account created');
        } else {
            res.status(401).send('Account already exists');
        }
    }).catch(() => {
        res.status(500).send('An error occured');
    });
});

// login user
app.post('/auth/login', (req, res) => {
    const login = loginUser(req.body);

    login.then(result => {
        if (result) {
            res.status(200).send('Authentication success');
        } else {
            res.status(401).send('Authentication failed');
        }
    }).catch(() => {
        res.status(500).send('An error occured');
    });
});

// Confirm email address
app.put('/auth/confirm', (req, res) => {
    const confirm = confirmEmail(req.body);

    confirm.then(result => {
        if (result) {
            res.status(200).send('Account confirmed');
        } else {
            res.status(401).send('Account confirmation failed');
        }
    }).catch(() => {
        res.status(500).send('An error occured');
    });
});

// Create a new session
app.get('/session/new', function (req, res) {
    res.send(newSession());
});

// Get reader (owner) session
app.get('/session/:owner_id', function (req, res) {
    const session = getSession(req.params.owner_id);
    if (session) {
        res.send(session);
    } else {
        res.status(404).send('Session not found');
    }
});

// Get reader (spectator) session
app.get('/session/spectate/:reader_id', function (req, res) {
    const session = getSessionReader(req.params.reader_id);
    if (session) {
        res.send(session);
    } else {
        res.status(404).send('Session not found');
    }
});

// Add object to session
app.post('/session/:owner_id', function (req, res) {
    const session = getSession(req.params.owner_id);
    if (session) {
        addObject(req.params.owner_id, req.body);
        res.send(session);
    } else {
        res.status(404).send('Session not found');
    }
});

// Update an object in the session
app.put('/session/:owner_id', function (req, res) {
    const session = getSession(req.params.owner_id);
    if (session) {
        updateObject(req.params.owner_id, req.body);
        res.send(session);
    } else {
        res.status(404).send('Session not found');
    }
});

// Delete object from session
app.delete('/session/:owner_id', function (req, res) {
    const session = getSession(req.params.owner_id);
    if (session) {
        deleteObject(req.params.owner_id, req.body.object_id);
        res.send(session);
    } else {
        res.status(404).send('Session not found');
    }
});