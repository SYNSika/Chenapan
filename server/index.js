const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io")
const cors = require('cors');
const { addUser,getAllUsers,removeUser } = require('./src/assets/user');

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    }
});
app.use(cors());

io.on('connection', (socket) => {
    socket.on('signin', function(data,callback) {
        const user = addUser(data.pseudo,this.id);
        if(user.error) return callback(error);
        console.log('someone connected to the server');
        console.log(user.pseudo,'has join');
        socket.broadcast.emit('user joined', user);
        socket.emit('alluserdata',getAllUsers());
    })
    socket.on('logout', function() {
        const user = removeUser(socket.id);
        if(user) {
            console.log('someone disconnected from the server')
            console.log(user.pseudo,' has left');
        }
    })
});

server.listen(3001, () => {
    console.log('listening on *:3001');
});