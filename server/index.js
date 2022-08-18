import express from 'express';
import { Server } from "socket.io";
import http from 'http';

import {
    createNewAccount
} from './auth.controller.js';

import {
    addObject,
    deleteObject,
    getSession,
    getSessionReader, linkSocketClient,
    newSession, updateObject
} from './sessions.controller.js';

const app = express()
const server = http.createServer(app);
const io = new Server(server);

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

io.on('connection', (socket) => {
    socket.on('reader_id', (id) => {
        linkSocketClient(socket, id);
        socket.emit('connected');
    });
});

server.listen(8000, () => {
    console.log('Server is running on port 8000');
});

// disable cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/auth/register', (req, res) => {
    const register = createNewAccount(req.body);

    register.then(result => {
        if (result) {
            res.status(200).send('Account created');
        } else {
            res.status(400).send('Account already exists');
        }
    }).catch(() => {
        res.status(500).send('An error occured');
    });
});

app.post('/auth/login', (req, res) => {
    //
});

app.put('/auth/confirm', (req, res) => {
    //
});

app.get('/session/new', function(req, res) {
    res.send(newSession());
});

app.get('/session/:owner_id', function(req, res) {
    const session = getSession(req.params.owner_id);
    if (session) {
        res.send(session);
    } else {
        res.status(404).send('Session not found');
    }
});

app.get('/session/spectate/:reader_id', function(req, res) {
    const session = getSessionReader(req.params.reader_id);
    if (session) {
        res.send(session);
    } else {
        res.status(404).send('Session not found');
    }
});

app.post('/session/:owner_id', function(req, res) {
    const session = getSession(req.params.owner_id);
    if (session) {
        addObject(req.params.owner_id, req.body);
        res.send(session);
    } else {
        res.status(404).send('Session not found');
    }
});

app.put('/session/:owner_id', function(req, res) {
    const session = getSession(req.params.owner_id);
    if (session) {
        updateObject(req.params.owner_id, req.body);
        res.send(session);
    } else {
        res.status(404).send('Session not found');
    }
});

app.delete('/session/:owner_id', function(req, res) {
    const session = getSession(req.params.owner_id);
    if (session) {
        deleteObject(req.params.owner_id, req.body.object_id);
        res.send(session);
    } else {
        res.status(404).send('Session not found');
    }
});
