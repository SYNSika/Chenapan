require('dotenv').config()
const server = require('express')
const http = require('http').createServer(server)
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});
const port = process.env.API_PORT
let rooms = []

io.on('connection', (socket) => {
    console.log('A user just connected ' + socket.id)

    socket.on('play', (move) => {
        let playerRoom = rooms.find(room => room.playersList.includes(socket.id))
        if(playerRoom != undefined) {
            socket.broadcast.to(playerRoom.roomId).emit('play',move)
        }
    })
    
    socket.on('createRoom', (callback) => {
        let roomId = (+new Date).toString(36)
        let room = {
            roomId: roomId,
            playersList: [socket.id],
        }
        rooms.push(room)
        socket.join(roomId)
        let roomsId = getList(rooms)
        io.emit('getRooms', roomsId)
        callback(roomId)
        console.log('new room created')
    })
    socket.on('joinRoom', (roomId, callback) => {
        console.log(roomId)
        let index = rooms.findIndex(room => room.roomId == roomId)
        if(index == -1) {
            console.log("this room doesn't existed")
            callback(false)
        } else if(rooms[index].playersList.length >= 2){
            console.log('this room is full')
            callback(false)
        }else {
            socket.join(roomId)
            socket.broadcast.to(roomId).emit('rivalJoin')
            rooms[index].playersList.push(socket.id)
            callback(true)
            console.log(`user ${socket.id} joined the room ${roomId}`)
        }
    })
    socket.on('leaveRoom', (callback) => {
        let index = rooms.findIndex(room => room.playersList.includes(socket.id))
        if(index === undefined) {
            console.log("the player was not in any room")
            callback(false)
        } else {
            let roomId = rooms[index].roomId
            rooms[index].playersList = rooms[index].playersList.filter(name => name != socket.id)            
            if(rooms[index].playersList.length === 0) {
                rooms = rooms.filter(room => room.roomId != roomId)
                let roomsId = getList(rooms)
                io.emit('getRooms',roomsId)
            }
            socket.leave(roomId)
            callback(true)
            console.log(`user ${socket.id} leave the room`)
        }
    })
    socket.on('getRooms', (callback) => {
        rooms = rooms.filter(room => room.playersList.length != 0)
        let roomsId = getList(rooms)
        callback(roomsId)
    })
})

http.listen(port, () => {
    console.log(`Server started on port ${port}`)
})

function getList(rooms) {
    let roomsId = []
    rooms.forEach((room) => {
        roomsId.push(room.roomId)
    });
    return roomsId
}