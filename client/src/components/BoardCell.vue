<template>
    <div class="board-cell" @click="updateSwapCells(index)"
        :style="{ background: translateBackColor, color: translateColor }">
        {{ value }}
    </div>
</template>
<script>

export default {
    name: 'BoardCell',
    props: {
        value: {
            type: String,
            required: true
        },
        index: {
            type: Number,
            required: true
        },
        color: {
            type: Number,
            required: true
        },
        backColor: {
            type: Number,
            required: true
        },
        updateSwapCells: {
            type: Function,
            required: true
        }
    },
    computed: {
        translateColor() {
            if (this.color === 0) {
                return "black"
            } else if (this.color === 1) {
                return "red"
            } else {
                return "green"
            }
        },
        translateBackColor() {
            if (this.backColor === 0) {
                return "white"
            } else if (this.backColor === 1) {
                return "lightblue"
            } else {
                return "lightgreen"
            }
        },
    }
}
</script>
<style lang="scss">
.board-cell {
    width: 100%;
    height: 100%;
    border: 1px solid black;
    border-radius: 5px;
    text-align: center;
    line-height: 250%;
}
</style>