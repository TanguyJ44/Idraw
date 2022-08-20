import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Define location of page
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use express JS
const app = express();

// Define express to static app (client folder)
app.use(express.static('client'));

// Start server in port 3000
app.listen(3000)

// Login page
app.get('/auth/login', function(req, res) {
    res.sendFile('login.html', { root: __dirname });
});

// Register page
app.get('/auth/register', function(req, res) {
    res.sendFile('register.html', { root: __dirname });
});

// Email confirmation page
app.get('/auth/confirm', function(req, res) {
    res.sendFile('confirm.html', { root: __dirname });
});

// Owner session page
app.get('/session/:owner_id', function(req, res) {
    res.sendFile('index.html', { root: __dirname });
});

// Spectator session page
app.get('/session/spectate/:reader_id', function(req, res) {
    res.sendFile('index.html', { root: __dirname });
});
