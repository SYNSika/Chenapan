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

    isMyTurn: false,
    inRoom: false,
    coinJoinRoom: true,
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
            let newIndexNeg = index - arr[i]
            if (newIndexPos < len && (index + arr[i]) % 5 >= index % 5 && !str2.includes(state.cells.at(newIndexPos))) {
              state.cellsBackColor[index + arr[i]] = 2
            }
            if (newIndexNeg >= 0 && (index - arr[i]) % 5 <= index % 5 && !str2.includes(state.cells.at(newIndexNeg))) {
              state.cellsBackColor[index - arr[i]] = 2
            }
          }
          break;
        case "V":
          arr = [3, 7, 9, 11]
          str2["A", "R", "D", "0"]
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
    }
  },
  actions: {
    updateSwapCells: (context, index) => {
      if (context.state.isMyTurn) {
        context.commit("addCellIndex", index)
        context.commit("changeCellBack", index)
        context.commit("changeAdjacentCellBack", index)

        if (context.state.selectedCells.length === 2) {
          if (context.getters.isSwapPossible) {
            context.commit("swapCells")
            socket.emit('play', context.state.selectedCells)
            context.state.isMyTurn = false
          }
          context.state.selectedCells = []
          context.commit("refreshCellBack")
        }
      }
    },
    otherPlayerMove: (context, move) => {
      context.state.selectedCells = move
      context.commit("swapCells")
      context.state.selectedCells = []
    },
    updateRoomList: (context, rooms) => {
      context.state.roomsList = rooms
      console.log(`the rooms ${context.state.roomsList} are available`)
    },
    createRoom: (context) => {
      socket.emit("createRoom", (roomId) => {
        context.state.roomId = roomId
        context.state.inRoom = true
        router.push(`/room/${roomId}`)
      })
    },
    joinRoom: (context, roomId) => {
      socket.emit('joinRoom', roomId, (reponse) => {
        if(reponse) {
          router.push(`/room/${roomId}`)
          context.state.inRoom = true
          context.state.isMyTurn = false
        }
      })
    },
    leaveRoom: (context) => {
      socket.emit('leaveRoom', (response) => {
        if(response) {
          router.push('/rooms')
          context.state.inRoom = false
          context.state.roomId = ""
        }
      })

    }
  },
  modules: {
  }
})
