import { io } from "socket.io-client";
import store from "./store";
import router from "./router";

const apiUrl = process.env.VUE_APP_SERVICE_URL

const apiPort = process.env.VUE_APP_SERCIVE_PORT

const socket = io(apiUrl + ":" + apiPort)
socket.on('connected', () => {
    router.push('/')
})
socket.on('play', (move) => {
    store.dispatch('otherPlayerMove', move)

})
socket.on('getRooms', (rooms) => {
    store.dispatch('updateRoomList', rooms)
})
socket.on('getBoardData', (callback) => {
    store.state.haveOtherPlayerJoin = true
    let data = {
        color: store.state.playerColor,
        board: store.state.cells,
        boardColor: store.state.cellsColor,
        isMyTurn: store.state.isMyTurn
    }
    callback(data)
})
socket.on('receivedMessage', (message) => {
    store.dispatch('receivedMessage', message)
})
export default socket