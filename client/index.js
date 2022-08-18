import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static('client'));
app.listen(3000)

// route /session/:id
app.get('/session/:owner_id', function(req, res) {
    // load index.html
    res.sendFile('index.html', { root: __dirname });
});

// route /session/:id
app.get('/session/spectate/:reader_id', function(req, res) {
    // load index.html
    res.sendFile('index.html', { root: __dirname });
});
