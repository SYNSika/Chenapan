require('dotenv').config()
const fs = require('fs')
const server = require('express')
const https = require('https').createServer({
    key: fs.readFileSync(process.env.API_PRIVATE_KEY),
    cert: fs.readFileSync(process.env.API_CERT),
    ca: fs.readFileSync(process.env.API_CA),

    requestCert: false,
    rejectUnauthorized: false
}, server)

const io = require('socket.io')(https, {
    cors : {
        origin: "*",
        methods: ["GET","POST"]
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
    socket.on('sendMessage', (message) => {
        let room = rooms.find(room => room.playersList.includes(socket.id) || room.spectatorList.includes(socket.id))
        if(room != undefined) {
            socket.broadcast.to(room.roomId).emit('receivedMessage',message)
        }
    })

    socket.on('createRoom', (callback) => {
        let roomId = (+new Date).toString(36)
        let room = {
            roomId: roomId,
            playersList: [socket.id],
            isAvailable: true,
            spectatorList: []
        }
        rooms.push(room)
        socket.join(roomId)
        io.emit('getRooms', rooms)
        callback(roomId)
        console.log('new room created')
    })
    socket.on('joinRoom', (roomId, callback) => {
        let index = rooms.findIndex(room => room.roomId == roomId)
        if (index == -1) {
            console.log("this room doesn't existed")
            callback(false)
        } else if (!rooms[index].isAvailable) {
            socket.join(roomId)
            rooms[index].spectatorList.push(socket.id)
            console.log(`User ${socket.id} joined room ${roomId} as spectator`)
            callback(true)
        } else {
            socket.join(roomId)
            socket.broadcast.to(roomId).emit('rivalJoin')
            rooms[index].playersList.push(socket.id)
            if (rooms[index].playersList.length == 2) {
                rooms[index].isAvailable = false
            }
            callback(true)
            setTimeout(() => { io.emit('getRooms', rooms) },1000)
            console.log(`user ${socket.id} joined the room ${roomId} as player`)
        }
    })
    socket.on('leaveRoom', (callback) => {
        let indexPlayer = rooms.findIndex(room => room.playersList.includes(socket.id))
        let indexSpec = rooms.findIndex(room => room.spectatorList.includes(socket.id))
        if (indexPlayer === -1 && indexSpec === -1) {
            console.log("the user was not in any room")
            callback(false)
        } else {
            if (indexPlayer != -1) {
                let roomId = rooms[indexPlayer].roomId
                rooms[indexPlayer].playersList = rooms[indexPlayer].playersList.filter(name => name != socket.id)
                rooms[indexPlayer].isAvailable = true
                socket.leave(roomId)
                console.log(`player ${socket.id} just leave the room : ${roomId}`)
                if (rooms[indexPlayer].playersList.length === 0) {
                    rooms = rooms.filter(room => room.roomId != roomId)
                    console.log(`The room ${roomId} has been removed`)
                }
                io.emit('getRooms', rooms)
                callback(true)
            }
            if(indexSpec != -1) {
                let roomId = rooms[indexSpec].roomId
                rooms[indexSpec].spectatorList = rooms[indexSpec].spectatorList.filter(name => name != socket.id)
                socket.leave(roomId)
                console.log(`spectator ${socket.id} just leave the room : ${roomId}`)
                callback(true)
            }
        }
    })
    socket.on('getRooms', (callback) => {
        rooms = rooms.filter(room => room.playersList.length != 0)
        callback(rooms)
    })
    socket.on('getBoard', async (roomId, callback) => {
        let id = getRoomCreatorId(roomId)
        await io.to(id).timeout(3000).emit('getBoardData', (err, data) => {
            if (err) {
                callback(null)
            }
            callback(data)
        })
    })
    socket.on('disconnect', () => {
        console.log(`User ${socket.id} has been disconnected`)
        let indexPlayer = rooms.findIndex(room => room.playersList.includes(socket.id))
        let indexSpec = rooms.findIndex(room => room.spectatorList.includes(socket.id))
        if (indexPlayer != -1) {
            let roomId = rooms[indexPlayer].roomId
            rooms[indexPlayer].playersList = rooms[indexPlayer].playersList.filter(name => name != socket.id)
            rooms[indexPlayer].isAvailable = true
            socket.leave(roomId)
            console.log(`player ${socket.id} just leave the room : ${roomId}`)
            if (rooms[indexPlayer].playersList.length === 0) {
                rooms = rooms.filter(room => room.roomId != roomId)
                let roomsId = getList(rooms)
                io.emit('getRooms', roomsId)
                console.log(`The room ${roomId} has been removed`)
            }

        }
        if(indexSpec != -1) {
            let roomId = rooms[indexSpec].roomId
            rooms[indexSpec].spectatorList = rooms[indexSpec].spectatorList.filter(name => name != socket.id)
            socket.leave(roomId)
            console.log(`spectator ${socket.id} just leave the room : ${roomId}`)
            callback(true)
        }
    })
})

https.listen(port, () => {
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