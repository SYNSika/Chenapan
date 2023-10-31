<template>
    <div class="room-list">
        <SingleRoom v-for="(room,index) in roomsList"
            :key="index"
            :roomId="room"/>
    </div>
    <div class="create-room-button">
        <button @click="createRoom">Créer une room</button>
    </div>
</template>
<script>
import SingleRoom from '@/components/Room.vue'
import { mapState,mapActions } from 'vuex';
import socket from '@/socket';
import store from '@/store';

export default {
    name: "RoomsView",
    components : {
        SingleRoom
    },
    computed: {
        ...mapState(["roomsList"])
    },
    methods: {
        ...mapActions(["createRoom"])
    },
    beforeMount() {
        socket.emit("getRooms",(response) => {
            store.dispatch("updateRoomList",response)
        })
    }
}
</script>