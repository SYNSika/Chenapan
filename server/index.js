const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io")
const cors = require('cors');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

io.on('connection', (socket) => {
    socket.on('signup', (data) => {
        console.log(data.pseudo);
    })
    socket.on('logout', () => {
        console.log('user disconnected');
    })
});

server.listen(3001, () => {
    console.log('listening on *:3001');
});