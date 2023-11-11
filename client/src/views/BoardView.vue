<template>
  <div>
    <Board />
  </div>
  <div class="board-rules">
    <h4 class="board-rules_title">{{ $t('ruleTitle') }}</h4>
    <p class="board-rules_text">{{ $t('ruleText') }}</p>
  </div>
</template>
<script>
import Board from "@/components/Board.vue";

export default {
  name: "BoardView",
  components: {
    Board,
  },
};
</script>
<style lang="scss">
.board-rules {
  margin-left: 2.5%;
  margin-bottom: 1%;
  width: 95%;
  border-radius: 5px;
  text-align: justify;
  line-height: 150%;
  background-color: #bbdde8;
  &_text {
    overflow: auto;
    word-wrap: break-word;
    margin-left: 10px;
    white-space: pre;
  }
  &_title {
    margin-left: 10px;
  }
}
</style>
