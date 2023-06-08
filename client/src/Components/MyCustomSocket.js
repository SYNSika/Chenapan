import { io } from 'socket.io-client'

export const socket = io('http://localhost:3001')
export let socketId = '';

socket.on('connect', () => {
  socketId = socket.id;
})
