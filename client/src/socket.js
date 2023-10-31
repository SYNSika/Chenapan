import { io } from "socket.io-client";
import store from "./store";

const apiUrl = process.env.VUE_APP_SERVICE_URL

const apiPort = process.env.VUE_APP_SERCIVE_PORT

const socket = io(apiUrl + ":"+apiPort)

socket.on('play',(move) => {
    store.dispatch('otherPlayerMove',move)
    store.state.isMyTurn = true
})

export default socket