<template>
    <div class="board">
        <div class="board-roomId">
            <p></p>
        </div>
        <div class="board-game">
            <BoardCell v-for="(cell, index) in cells" :key="index" :index="index" :value="cell" :color="cellsColor[index]"
                :backColor="cellsBackColor[index]" :updateSwapCells="updateSwapCells" />
        </div>
        <div class="is-turn" :class="[isMyTurn ? '' : 'is-turn_not']">
            <p v-if="isMyTurn">A votre tour</p>
            <p v-else>A l'adversaire</p>
        </div>
    </div>
    <button class="leave-room-button" @click="leaveRoom">Quitter la room</button>
</template>
<script>
import BoardCell from './BoardCell.vue';
import { mapState, mapActions } from 'vuex';
import store from '@/store';

export default {
    name: "GameBoard",
    components: {
        BoardCell
    },
    computed: {
        ...mapState(["cells", "cellsColor", "cellsBackColor", "isMyTurn"])
    },
    methods: {
        ...mapActions(["leaveRoom", "updateSwapCells"])
    },
    beforeCreate() {
        store.dispatch("generateBoard")

    }
}
</script>

<style lang="scss">
.board {
    display: flex;
}

.board-game {
    display: grid;
    margin: 0 auto;
    height: 250px;
    width: 250px;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 1fr);
    gap: 10px 10px;
}

.is-turn {
    width: 100px;
    height: 40px;
    border-radius: 5px;
    text-align: center;
    line-height: 50%;
    background-color: black;
    color: white;

    &_not {
        background-color: gray;
    }
}
</style>