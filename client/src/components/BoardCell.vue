<template>
  <div
    class="board-cell"
    @click="updateSwapCells(index)"
    :style="{ backgroundColor: translateBackColor, color: translateColor }"
    :class="{ 'board-cell_fading': valueChanged }"
  >
    {{ value }}
  </div>
</template>
<script>
export default {
  name: "BoardCell",
  props: {
    value: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    color: {
      type: Number,
      required: true,
    },
    backColor: {
      type: Number,
      required: true,
    },
    updateSwapCells: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      valueChanged: false,
    };
  },
  watch: {
    value: function (oldValue, newValue) {
      if (oldValue != newValue) {
        this.valueChanged = true;
      }
      setTimeout(() => {
        this.valueChanged = false;
      }, 1000);
    },
  },
  computed: {
    translateColor() {
      switch (this.color) {
        case 0:
          return "black";
        case 1:
          return "red";
        default:
          return "green";
      }
    },
    translateBackColor() {
      if (this.valueChanged) {
        return "rgba(216,251,48,0.8050070369944853)";
      } else {
        switch (this.backColor) {
          case 1:
            return "lightblue";
          case 2:
            return "lightgreen";
          default:
            return "white";
        }
      }
    },

  },
};
</script>
<style lang="scss">
.board-cell {
  width: 100%;
  height: 100%;
  border: 1px solid black;
  border-radius: 5px;
  text-align: center;
  line-height: 300%;
  transition: background-color 0.5s;
}
</style>
