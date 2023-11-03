<template>
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
      <p v-if="isMyTurn">A votre tour</p>
      <p v-else>A l'adversaire</p>
    </div>
  </div>
  <button class="leave-room-button" @click="leaveRoom">Quitter la room</button>
</template>
<script>
import BoardCell from "./BoardCell.vue";
import { mapState, mapActions } from "vuex";
import store from "@/store";

export default {
  name: "GameBoard",
  components: {
    BoardCell,
  },
  computed: {
    ...mapState([
      "cells",
      "cellsColor",
      "cellsBackColor",
      "isMyTurn",
      "roomId",
    ]),
  },
  methods: {
    ...mapActions(["leaveRoom", "updateSwapCells"]),
  },
  beforeCreate() {
    store.dispatch("generateBoard");
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
.board-info {
  width: 100px;
  height: 40px;
  text-align: center;
  line-height: 50%;
  border-radius: 5px;
  background-color: black;
  color: white;
}
.leave-room-button {
  margin-top: 10px;
  width: 150px;
  height: 40px;
  line-height: 50%;
  text-align: center;
  border-radius: 5px;
  background-color: gold;
}
.leave-room-button:hover {
  background-color: goldenrod;
}

.is-turn_not {
  background-color: gray;
}
</style>
