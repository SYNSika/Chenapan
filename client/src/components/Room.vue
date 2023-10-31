<template>
    <div class="single-room" @click="joinRoom">
        <p>{{ roomId }}</p>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
export default {
    name: 'SingleRoom',
    props: {
        roomId: {
            type: String,
            required: true,
        },
    },
    methods: {
        ...mapActions(["joinRoom"])
    }
}
</script>
<style lang="scss">
.single-room {
    border: 2px black;
    border-radius: 5px;
}
</style>