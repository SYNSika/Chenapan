import { createStore } from 'vuex'
import router from '@/router'
import socket from '@/socket'

const inArray = (value, arr) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === value) { return true }
  }
  return false
}
const arrForV = (index) => {
  switch (index % 5) {
    case 0:
      return [-9, -3, 7, 11]
    case 1:
      return [-11, -9, -3, 7, 9, 11]
    case 2:
      return [-11, -9, -7, -3, 3, 7, 9, 11]
    case 3:
      return [-11, -9, -7, 3, 9, 11]
    case 4:
      return [-11, -7, 3, 9]
  }
}
const arrForD = (index) => {
  switch (index % 5) {
    case 0:
      if ((index - 10) < 0) {
        return [-5, 2, 10]
      } else if (index + 10 > 25) {
        return [-10, 2, 5]
      } else { return [-10, 2, 10] }
    case 1:
      if ((index - 10) < 0) {
        return [-5, -1, 2, 10]
      } else if (index + 10 > 25) {
        return [-10, -1, 2, 5]
      } else { return [-10, -1, 2, 10] }
    case 2:
      if ((index - 10) < 0) {
        return [-5, -2, 2, 10]
      } else if (index + 10 > 25) {
        return [-10, -2, 2, 5]
      } else { return [-10, -2, 2, 10] }
    case 3:
      if ((index - 10) < 0) {
        return [-5, -2, 1, 10]
      } else if (index + 10 > 25) {
        return [-10, -2, 1, 5]
      } else { return [-10, -2, 1, 10] }
    case 4:
      if ((index - 10) < 0) {
        return [-5, -2, 10]
      } else if (index + 10 > 25) {
        return [-10, -2, 5]
      } else { return [-10, -2, 10] }
  }
}
const arrForRnA = (index) => {
  switch (index % 4) {
    case 0:
      return [-5, -4, 1, 5, 6]
    case 4:
      return [-6, -5, -1, 4, 5]
    default:
      return [-6, -5, -4, -1, 1, 4, 5, 6]
  }
}

export default createStore({
  state: {
    cells: [],
    cellsColor: [],
    cellsBackColor: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    selectedCells: [],
    roomList: [],

    roomId: "",
    playerColor: 2,

    isMyTurn: false,
    haveOtherPlayerJoin: false,

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

      const delta = index2 - index1
      let swap = false
      switch (str1) {
        case "0":
          break;
        case "A":
          if (str2 === "R" && inArray(delta, arrForRnA(index1))) {
            swap = true
          }
          break;
        case "R":
          if (str2 != "A" && str2 != "0" && inArray(delta, arrForRnA(index1))) {
            swap = true
          }
          break;
        case "D":
          if (str2 != "R" && str2 != "0" && str3 != "R" && str3 != "0" && inArray(delta, arrForD(index1))) {
            swap = true
          }
          break;
        case "V":
          if (str2 != "R" && str2 != "0" && str2 != "D" && inArray(delta, arrForV(index1))) {
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
      let tempCell = state.cells.at(index2)
      let tempCellColor = state.cellsColor.at(index2)
      if (state.cells.at(index1) === "D" && (Math.abs(index2 -index1) == 2 ||Math.abs(index2 -index1) == 10 )) {
        let index3 = index1 + (index2 - index1)/2
        state.cells[index2] = state.cells.at(index1)
        state.cells[index1] = state.cells.at(index3)
        state.cells[index3] = tempCell

        state.cellsColor[index2] = state.cellsColor.at(index1)
        state.cellsColor[index1] = state.cellsColor.at(index3)
        state.cellsColor[index3] = tempCellColor
        
      } else {
        state.cells[index2] = state.cells.at(index1)
        state.cells[index1] = tempCell

        state.cellsColor[index2] = state.cellsColor.at(index1)
        state.cellsColor[index1] = tempCellColor
      }
      state.isMyTurn = false
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
          arr = arrForRnA(index)
          str2 = ["R", "D", "V"]
          for (let i = 0; i < arr.length; i++) {
            let newIndex = index + arr[i]
            if (0 <= newIndex < len && str2.includes(state.cells.at(newIndex))) {
              state.cellsBackColor[newIndex] = 2
            }
          }
          break;
        case "R":
          arr = arrForRnA(index)
          str2 = ["A", "0"]
          for (let i = 0; i < arr.length; i++) {
            let newIndex = index + arr[i]
            if (0 <= newIndex < len && !str2.includes(state.cells.at(newIndex))) {
              state.cellsBackColor[newIndex] = 2
            }
          }
          break;
        case "D":
          arr = arrForD(index)
          str2 = ["A", "R", "0"]
          for (let i = 0; i < arr.length; i++) {
            let newIndex = index + arr[i]
            if (Math.abs(arr[i]) === 2 || Math.abs(arr[i]) === 10) {
              let newIndexDelta = index + (arr[i] / 2)
              
              if (!str2.includes(state.cells.at(newIndex)) && !str2.includes(state.cells.at(newIndexDelta))) {
                state.cellsBackColor[newIndex] = 2
              }
            } else {
              if (!str2.includes(state.cells.at(newIndex))) {
                state.cellsBackColor[newIndex] = 2
              }
            }
          }
          break;
        case "V":
          arr = arrForV(index)
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
                state.cellsBackColor[newIndexPos] = 2
              }
            }
            if (newIndexNeg >= 0 && newIndexNeg % 5 <= index % 5 && !str2.includes(state.cells.at(newIndexNeg))) {
              if (parseInt(str1) >= parseInt(state.cells.at(newIndexNeg)) || state.cells.at(newIndexNeg) === "A") {
                state.cellsBackColor[newIndexNeg] = 2
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
    generateBoard: (state, roomId) => {
      state.roomId = roomId
    },
    createBoard: state => {
      state.isMyTurn = true
      state.cells = ["8", "V", "R", "D", "9", "7", "4", "A", "6", "5", "3", "2", "0", "2", "3", "5", "6", "A", "4", "7", "9", "D", "R", "V", "8"]
      state.playerColor = (Math.floor(Math.random() * 2))
      switch (state.playerColor) {
        case 0:
          state.cellsColor = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          break;
        case 1:
          state.cellsColor = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
          break;
      }
    },
    joinBoard: (state, data) => {
      state.isMyTurn = false
      state.haveOtherPlayerJoin = true
      if (data.color === 0) {
        state.playerColor = 1
      } else {
        state.playerColor = 0
      }
      state.cells = data.board.reverse()
      state.cellsColor = data.boardColor.reverse()

    },
    leaveRoom: state => {
      state.roomId = ""
      state.isGameOver = false
      state.isGameWon = false
      state.haveOtherPlayerJoin = false
      state.playerColor = 2
    },
    invertePlayerMove: (state, moves) => {
      let invertedMove = []
      moves.forEach((move) => {
        invertedMove.push(24 - move)
      })
      state.selectedCells = invertedMove
    },
    isGameOver: (state) => {
      let pos = [0, 1, 2, 3, 4, 20, 21, 22, 23, 24]
      for (let i = 0; i < pos.length; i++) {
        if (state.cells.at(pos[i]) === "0") {
          state.isGameOver = true
          if (pos[i] <= 4) {
            state.isGameWon = true
          }
          break;
        }
      }
    },
    updateRoomList: (state, rooms) => {
      state.roomList = rooms
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
      context.commit("updateRoomList", rooms)
    },
    createRoom: (context) => {
      socket.emit("createRoom", (roomId) => {
        context.commit("generateBoard", roomId)
        context.commit("createBoard")
        router.push(`/room/${roomId}`)
      })
    },
    joinRoom: (context, roomId) => {
      socket.emit('joinRoom', roomId, (response) => {
        if (response) {
          context.commit("generateBoard", roomId)
          socket.timeout(3000).emit("getBoard", roomId, (err, data) => {
            if (err) {
              alert('error room server')
            } else {
              context.commit("joinBoard", data[0])
              router.push(`/room/${roomId}`)
            }
          })

        } else {
          alert('error full Room')
        }
      })
    },
    leaveRoom: (context) => {
      socket.emit('leaveRoom', (response) => {
        if (response) {
          context.commit("leaveRoom")
          router.push('/rooms')
        }
      })
    },
  },
  modules: {
  }
})
