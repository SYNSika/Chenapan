<template>
  <div>
    <Board />
  </div>
  <div class="board-rules">
    <h4>{{ $t('ruleTitle') }}</h4>
    <p>{{ $t('ruleText') }}</p>
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
<style lang="scss"></style>
