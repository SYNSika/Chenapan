<template>
    <div>
        <Board :key="roomId" :roomId="roomId" />
    </div>
</template>
<script>
import { mapState } from 'vuex';
import Board from '@/components/Board.vue';

export default {
    name: BoardView,
    components: {
        Board
    },
    computed: {
        ...mapState(["roomId"])
    }
}
</script>
<style lang="scss">

</style>