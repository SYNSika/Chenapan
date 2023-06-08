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
    console.log(socket.id)
    socket.on('signin', function(username,callback) {
        const user = addUser(username,this.id);
        if(user.error) return callback(error);
        console.log('someone connected to the server');
        console.log(user.username,'has join');

        socket.emit('userlist',getAllUsers());
    })
    socket.on('logout', function() {
        const user = removeUser(socket.id);
        if(user) {
            console.log('someone disconnected from the server')
            console.log(user.username,' has left');
        }
        socket.emit('userlist',getAllUsers());
    })
});

setInterval(function() {
    const users = getAllUsers();
    io.emit('userlist',users);
},10000)

server.listen(3001, () => {
    console.log('listening on *:3001');
});