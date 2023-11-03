import { createStore } from 'vuex'
import router from '@/router'
import socket from '@/socket'

const inArray = (value, arr) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === value) { return true }
  }
  return false
}

export default createStore({
  state: {
    cells: [],
    cellsColor: [],
    cellsBackColor: [],
    selectedCells: [],
    roomList: [],

    roomId: "",
    playerColor: 2,

    isMyTurn: false,
    inRoom: false,
    canJoinRoom: true,
    isJoinningRoom: false,

    isGameOver: false,
    isGameWon: false,
  },
  getters: {
    isSwapPossible: (state) => {
      let index1 = state.selectedCells.at(0)
      let index2 = state.selectedCells.at(1)

      let str1 = state.cells.at(index1)
      let str2 = state.cells.at(index2)
      let str3 = state.cells.at(index1 + (index2 - index1) / 2)

      const delta = Math.abs(index2 - index1)
      let swap = false
      switch (str1) {
        case "0":
          break;
        case "A":
          if (str2 === "R" && inArray(delta, [1, 4, 5, 6])) {
            swap = true
          }
          break;
        case "R":
          if (str2 != "A" && str2 != "0" && inArray(delta, [1, 4, 5, 6])) {
            swap = true
          }
          break;
        case "D":
          if (str2 != "R" && str2 != "0" && str3 != "R" && str3 != "0" && inArray(delta, [2, 10])) {
            swap = true
          }
          break;
        case "V":
          if (str2 != "R" && str2 != "0" && str2 != "D" && inArray(delta, [3, 7, 9, 11])) {
            swap = true
          }
          break;
        default:
          if (str2 != "R" && str2 != "D" && str2 != "V" && inArray(delta, [1, 5])) {
            if (parseInt(str1) >= parseInt(str2)) {
              swap = true
            } else if (str2 === "A") {
              swap = true
            }
          }
          break;
      }
      return swap
    },
    firstCellCorrectColor: state => index => {
      if (state.selectedCells.length != 0) {
        return true
      } else {
        if (state.cellsColor.at(index) == state.playerColor) {
          return true
        } else { return false }
      }
    }
  },
  mutations: {
    swapCells: (state) => {
      let index1 = state.selectedCells.at(0)
      let index2 = state.selectedCells.at(1)
      let index3 = index1 + ((index2 - index1) / 2)
      let tempCell = state.cells.at(index2)
      let tempCellColor = state.cellsColor.at(index2)
      if (state.cells.at(index1) != "D") {
        state.cells[index2] = state.cells.at(index1)
        state.cells[index1] = tempCell

        state.cellsColor[index2] = state.cellsColor.at(index1)
        state.cellsColor[index1] = tempCellColor
      } else {
        state.cells[index2] = state.cells.at(index1)
        state.cells[index1] = state.cells.at(index3)
        state.cells[index3] = tempCell

        state.cellsColor[index2] = state.cellsColor.at(index1)
        state.cellsColor[index1] = state.cellsColor.at(index3)
        state.cellsColor[index3] = tempCellColor
      }
      state.isMyTurn = false
      let audio = new Audio(require('@/assets/move-self.mp3'))
      audio.play();
    },
    addCellIndex: (state, index) => {
      state.selectedCells.push(index)
    },
    changeCellBack: (state, index) => {
      state.cellsBackColor[index] = 1
    },
    changeAdjacentCellBack: (state, index) => {
      let len = state.cells.length
      let str1 = state.cells.at(index)
      let str2 = []
      let arr = []
      switch (str1) {
        case "A":
          arr = [1, 4, 5, 6]
          str2 = ["R"]
          for (let i = 0; i < arr.length; i++) {
            let newIndexPos = index + arr[i]
            let newIndexNeg = index - arr[i]
            if (newIndexPos < len && str2.includes(state.cells.at(newIndexPos))) {
              state.cellsBackColor[index + arr[i]] = 2
            }
            if (newIndexNeg >= 0 && str2.includes(state.cells.at(newIndexNeg))) {
              state.cellsBackColor[index - arr[i]] = 2
            }
          }
          break;
        case "R":
          arr = [1, 4, 5, 6]
          str2 = ["A", "0"]
          for (let i = 0; i < arr.length; i++) {
            let newIndexPos = index + arr[i]
            let newIndexNeg = index - arr[i]
            if (newIndexPos < len && !str2.includes(state.cells.at(newIndexPos))) {
              state.cellsBackColor[index + arr[i]] = 2
            }
            if (newIndexNeg >= 0 && !str2.includes(state.cells.at(newIndexNeg))) {
              state.cellsBackColor[index - arr[i]] = 2
            }
          }
          break;
        case "D":
          arr = [2, 10]
          str2["A", "R", "0"]
          for (let i = 0; i < arr.length; i++) {
            let newIndexPos = index + arr[i]
            let newIndexPosDelta = index + (arr[i] / 2)
            let newIndexNeg = index - arr[i]
            let newIndexNegDelta = index - (arr[i] / 2)
            if (newIndexPos < len && (newIndexPos) % 5 >= index % 5 && !str2.includes(state.cells.at(newIndexPos)) && !str2.includes(state.cells.at(newIndexPosDelta))) {
              state.cellsBackColor[newIndexPos] = 2
            }
            if (newIndexNeg >= 0 && (newIndexNeg) % 5 <= index % 5 && !str2.includes(state.cells.at(newIndexNeg)) && !str2.includes(state.cells.at(newIndexNegDelta))) {
              state.cellsBackColor[newIndexNeg] = 2
            }
          }
          break;
        case "V":
          arr = [3, 7, 9, 11, -3, -7, -9, -11]
          str2["A", "R", "D", "0"]
          for (let i = 0; i < arr.length; i++) {
            let newIndex = index + arr[i]
            if ((0 <= newIndex < len) && !str2.includes(state.cells.at(newIndex))) {
              state.cellsBackColor[newIndex] = 2
            }
          }
          break;
        default:
          arr = [1, 5]
          str2["R", "D", "V"]
          for (let i = 0; i < arr.length; i++) {
            let newIndexPos = index + arr[i]
            let newIndexNeg = index - arr[i]
            if (newIndexPos < len && newIndexPos % 5 >= index % 5 && !str2.includes(state.cells.at(newIndexPos))) {
              if (parseInt(str1) >= parseInt(state.cells.at(newIndexPos)) || state.cells.at(newIndexPos) === "A") {
                state.cellsBackColor[index + arr[i]] = 2
              }
            }
            if (newIndexNeg >= 0 && newIndexNeg % 5 <= index % 5 && !str2.includes(state.cells.at(newIndexNeg))) {
              if (parseInt(str1) >= parseInt(state.cells.at(newIndexNeg) || state.cells.at(newIndexNeg) === "A")) {
                state.cellsBackColor[index - arr[i]] = 2
              }

            }
          }
          break;
      }
    },
    refreshCellBack: state => {
      let len = state.cellsBackColor.length
      for (let i = 0; i < len; i++) {
        state.cellsBackColor[i] = 0
      }
    },
    createBoard: state => {
      if (state.isJoinningRoom) {
        state.cells = ["8", "V", "R", "D", "9", "7", "4", "A", "6", "5", "3", "2", "0", "2", "3", "5", "6", "A", "4", "7", "9", "D", "R", "V", "8"]
        state.cellsColor = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        state.cellsBackColor = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      } else {
        state.cells = ["8", "V", "R", "D", "9", "7", "4", "A", "6", "5", "3", "2", "0", "2", "3", "5", "6", "A", "4", "7", "9", "D", "R", "V", "8"]
        state.cellsColor = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        state.cellsBackColor = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    },
    invertePlayerMove: (state, moves) => {
      let invertedMove = []
      moves.forEach((move) => {
        invertedMove.push(24 - move)
      })
      state.selectedCells = invertedMove
    },
    isGameOver: (state) => {
      let pos = [0,1,2,3,4,20,21,22,23,24]
      for(let i = 0; i<pos.length; i++){
        if(state.cells.at(pos[i]) === "0") {
          state.isGameOver = true
          console.log("Partie Terminé")
          if(pos[i] >= 20) {
            state.isGameWon = true
            console.log("Partie Gagné")
          }
          break;
        }
      }
    },
    updateRoomList: (state,rooms) => {
      state.roomList = rooms
      console.log(state.roomList)
    }
  },
  actions: {
    updateSwapCells: (context, index) => {
      if (context.state.isMyTurn && context.getters.firstCellCorrectColor(index) && !context.state.isGameOver) {
        context.commit("addCellIndex", index)
        context.commit("changeCellBack", index)
        context.commit("changeAdjacentCellBack", index)

        if (context.state.selectedCells.length === 2) {
          if (context.getters.isSwapPossible) {
            context.commit("swapCells")
            context.commit("isGameOver")
            socket.emit('play', context.state.selectedCells)
          }
          context.state.selectedCells = []
          context.commit("refreshCellBack")
        }
      }
    },
    otherPlayerMove: (context, move) => {
      context.commit("invertePlayerMove", move)
      context.commit("swapCells")
      context.commit("isGameOver")
      context.state.selectedCells = []
    },
    updateRoomList: (context, rooms) => {
      context.commit("updateRoomList",rooms)
    },
    createRoom: (context) => {
      socket.emit("createRoom", (roomId) => {
        context.state.roomId = roomId
        context.state.inRoom = true
        context.state.isMyTurn = true
        context.state.playerColor = 1
        router.push(`/room/${roomId}`)
      })
    },
    joinRoom: (context, roomId) => {
      socket.emit('joinRoom', roomId, (reponse) => {
        if (reponse) {
          context.state.roomId = roomId
          context.state.inRoom = true
          context.state.isMyTurn = false
          context.state.isJoinningRoom = true
          context.state.playerColor = 0
          router.push(`/room/${roomId}`)

        } else {
          alert('error Room')
        }
      })
    },
    leaveRoom: (context) => {
      socket.emit('leaveRoom', (response) => {
        if (response) {
          router.push('/rooms')
          context.state.inRoom = false
          context.state.roomId = ""
          context.state.isJoinningRoom = false
          context.state.playerColor = 2
          context.state.isGameOver = false
          context.state.isGameWon = false
        }
      })
    },
    generateBoard: (context) => {
      context.commit("createBoard")
    },
  },
  modules: {
  }
})
