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
    socket.emit('connected')
    socket.on('play', (move) => {
        let playerRoom = rooms.find(room => room.playersList.includes(socket.id))
        if (playerRoom != undefined) {
            socket.broadcast.to(playerRoom.roomId).emit('play', move)
        }
    })

    socket.on('createRoom', (callback) => {
        let roomId = (+new Date).toString(36)
        let room = {
            roomId: roomId,
            playersList: [socket.id],
            isAvailable: true,
        }
        rooms.push(room)
        socket.join(roomId)
        io.emit('getRooms', rooms)
        callback(roomId)
        console.log('new room created')
    })
    socket.on('joinRoom', (roomId, callback) => {
        console.log(roomId)
        let index = rooms.findIndex(room => room.roomId == roomId)
        if (index == -1) {
            console.log("this room doesn't existed")
            callback(false)
        } else if (!rooms[index].isAvailable) {
            console.log('this room is full')
            callback(false)
        } else {
            socket.join(roomId)
            socket.broadcast.to(roomId).emit('rivalJoin')
            rooms[index].playersList.push(socket.id)
            if(rooms[index].playersList.length == 2){
                rooms[index].isAvailable = false
            }
            io.emit('getRooms', rooms)
            callback(true)
            console.log(`user ${socket.id} joined the room ${roomId}`)
        }
    })
    socket.on('leaveRoom', (callback) => {
        let index = rooms.findIndex(room => room.playersList.includes(socket.id))
        if (index === -1) {
            console.log("the player was not in any room")
            callback(false)
        } else {
            let roomId = rooms[index].roomId
            rooms[index].playersList = rooms[index].playersList.filter(name => name != socket.id)
            rooms[index].isAvailable = true
            socket.leave(roomId)
            console.log(`user ${socket.id} just leave the room : ${roomId}`)
            if (rooms[index].playersList.length === 0) {
                rooms = rooms.filter(room => room.roomId != roomId)
                console.log(`The room ${roomId} has been removed`)
            }
            io.emit('getRooms', rooms)
            callback(true)
        }
    })
    socket.on('getRooms', (callback) => {
        rooms = rooms.filter(room => room.playersList.length != 0)
        callback(rooms)
    })
    socket.on('getBoard',async (roomId,callback) => {
        let id = getRoomCreatorId(roomId)
        await io.to(id).timeout(3000).emit('getBoardData', (err,data) => { 
            if (err) {
                callback(null)
            }
            callback(data)
        })
    })
    socket.on('disconnect', () => {
        console.log(`User ${socket.id} has been disconnected`)
        let index = rooms.findIndex(room => room.playersList.includes(socket.id))
        if (index === -1) {
        } else {
            let roomId = rooms[index].roomId
            rooms[index].playersList = rooms[index].playersList.filter(name => name != socket.id)
            rooms[index].isAvailable = true
            socket.leave(roomId)
            console.log(`user ${socket.id} just leave the room : ${roomId}`)
            if (rooms[index].playersList.length === 0) {
                rooms = rooms.filter(room => room.roomId != roomId)
                let roomsId = getList(rooms)
                io.emit('getRooms', roomsId)
                console.log(`The room ${roomId} has been removed`)
            }

        }
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
function getRoomCreatorId(roomId) {
    let room = rooms.find(room => room.roomId == roomId)
    return room.playersList.at(0)
}