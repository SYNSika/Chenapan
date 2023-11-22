<template>
  <PopUp
    :bool1="isGameOver"
    :bool2="isGameWon"
    :title="$t('PopUpGameOver')"
    :subtitle1="$t('PopUpGameWon')"
    :subtitle2="$t('PopUpGameLost')"
    :exitMessage="$t('PopUpLeaving')"
    :exitFunction="leaveRoom"
  />
  <PopUp
    :bool1="!haveOtherPlayerJoin"
    :title="$t('PopUpWaiting')"
    :loading="true"
    :exitMessage="$t('PopUpLeaving')"
    :exitFunction="leaveRoom"
  />
  <div class="board">
    <div class="board-info">
      <p>{{ roomId }}</p>
    </div>
    <div class="board-game">
      <BoardCell
        v-for="(cell, index) in cells"
        :key="index"
        :index="index"
        :value="cell"
        :color="cellsColor[index]"
        :backColor="cellsBackColor[index]"
        :updateSwapCells="updateSwapCells"
      />
    </div>
    <div class="board-chat">
      <div class="board-chat_text">
        <div v-for="(message, index) in messages" :key="index">
          <b :style="{ color: colorPlayer(message.user) }">
            {{ message.user }}
          </b>
          : {{ message.text }}
        </div>
      </div>
      <div class="board-chat_input">
        <form @submit.prevent="sendMessage">
          <input type="text" v-model="text" />
          <input type="submit" value="Send" class="board-chat_input_button" />
        </form>
      </div>
    </div>
    <div
      class="board-info"
      :style="{ backgroundColor: 'gray' }"
      v-if="isSpectator"
    >
      <p>{{ $t("spectator") }}</p>
    </div>
    <div class="board-info" :class="[isMyTurn ? '' : 'is-turn_not']" v-else>
      <p v-if="isMyTurn">{{ $t("yourTurn") }}</p>
      <p v-else>{{ $t("opponentTurn") }}</p>
    </div>
  </div>
  <button class="button" @click="leaveRoom">
    <p>{{ $t("leaveRoomButton") }}</p>
  </button>
</template>
<script>
import BoardCell from "./BoardCell.vue";
import PopUp from "./PopUp.vue";
import { mapState, mapActions } from "vuex";
import store from "@/store";

export default {
  name: "GameBoard",
  components: {
    BoardCell,
    PopUp,
  },
  data() {
    return {
      text: "",
    };
  },
  computed: {
    ...mapState([
      "cells",
      "cellsColor",
      "cellsBackColor",
      "isMyTurn",
      "roomId",
      "isGameOver",
      "isGameWon",
      "haveOtherPlayerJoin",
      "isSpectator",
      "messages",
    ]),
  },
  methods: {
    ...mapActions(["leaveRoom", "updateSwapCells"]),
    sendMessage() {
      let message = {
        user: store.state.currentUser,
        text: this.text,
      };
      store.dispatch("sendMessage", message);
      this.text = "";
    },
    colorPlayer(user) {
      switch (user) {
        case store.state.currentUser :
          if (store.state.playerColor == 0) {
            return "black"
          } else {
            return "red"
          }
        case store.state.opponentUser :
          if(store.state.playerColor == 0) {
            return "red"
          } else {
            return "black"
          }
        default :
          return "gray"
      }
    },
  },
};
</script>

<style lang="scss">
.board {
  display: flex;
  margin: auto;
}

.board-game {
  display: grid;
  margin: auto;
  height: 300px;
  width: 300px;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 10px 10px;
  text-align: center;
}
.board-chat {
  margin-left: 10px;
  max-width: 250px;
  max-height: 300px;
  text-align: left;
  border: 1px black;
  scroll-behavior: auto;
  &_text {
    overflow-y: auto;
    height: 95%;
    background-color: white;
  }
  &_input {
    display: inline-block;
    border: 1px color;
    &_button {
      margin-left: 2px;
      color: white;
      background-color: #bbdde8;
      border: none;
      &:hover {
        background-color: #c5e7f2;
        cursor: pointer;
      }
    }
  }
}
.board-info {
  margin-left: 10px;
  margin-right: 10px;
  width: 125px;
  height: 40px;
  text-align: center;
  line-height: 50%;
  border-radius: 5px;
  background-color: #bbdde8;
  color: white;
}
.is-turn_not {
  background-color: gray;
}
</style>
