<template>
    <h4>{{ $t('homeText') }}</h4>
    <button class="button" @click="goToBoard">{{ $t('homeButton') }}</button>
</template>

<script>
import router from '@/router';

export default {
    methods: {
        goToBoard() {
            router.push("/rooms")
        }
    }
}
</script>
<style lang="scss">

</style>