<template>
    <h4>Vous êtes sur la page d'accueil</h4>
    <button @click="goToBoard">Accéder à liste des rooms</button>
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