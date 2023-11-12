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
        let audio = new Audio(require("@/assets/move-self.mp3"));
        audio.play();
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
        return "rgba(176,167,200,0.805)";
      } else {
        switch (this.backColor) {
          case 1:
            return "rgba(183,209,178,0.805)";
          case 2:
            return "rgba(126,117,150,0.805)";
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
  border-radius: 5px;
  text-align: center;
  line-height: 300%;
  transition: background-color 0.5s;
  &:hover {
    cursor: pointer;
  }
}
</style>
