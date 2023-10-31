import { io } from "socket.io-client";
import store from "./store";

const apiUrl = process.env.API_URL
const apiPort = process.env.API_PORT

const socket = io(apiUrl+':'+apiPort)

socket.on('play',(move) => {
    store.dispatch('otherPlayerMove',move)
    store.state.isMyTurn = true
})

export default socket