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
  :exitFunction="leaveRoom"/>
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
    <div class="board-info" :class="[isMyTurn ? '' : 'is-turn_not']">
      <p v-if="isMyTurn">{{ $t('yourTurn') }}</p>
      <p v-else>{{ $t('opponentTurn') }}</p>
    </div>
  </div>
  <button class="button" @click="leaveRoom"><p>{{ $t('leaveRoomButton') }}</p></button>
</template>
<script>
import BoardCell from "./BoardCell.vue";
import PopUp from "./PopUp.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "GameBoard",
  components: {
    BoardCell,
    PopUp,
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
      "haveOtherPlayerJoin"
    ]),
  },
  methods: {
    ...mapActions(["leaveRoom", "updateSwapCells"]),
  }
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
.board-info {
  margin-left: 10px;
  margin-right: 10px;
  width: 125px;
  height: 40px;
  text-align: center;
  line-height: 50%;
  border-radius: 5px;
  background-color: #BBDDE8;
  color: white;
}
.is-turn_not {
  background-color: gray;
}
</style>
