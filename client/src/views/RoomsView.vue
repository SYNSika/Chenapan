<template>
  <div class="room-list">
    <h4>{{ $t('roomList') }}</h4>
    <SingleRoom v-for="(room, index) in roomList" :key="index" :roomId="room.roomId" :isAvailable="room.isAvailable" />
  </div>
  <button class="button" @click="createRoom">{{ $t('createRoomButton') }}</button>
</template>
<script>
import SingleRoom from "@/components/Room.vue";
import { mapState, mapActions } from "vuex";
import socket from "@/socket";
import store from "@/store";

export default {
  name: "RoomsView",
  components: {
    SingleRoom,
  },
  computed: {
    ...mapState(["roomList"]),
  },
  methods: {
    ...mapActions(["createRoom"]),
  },
  beforeCreate() {
    socket.emit("getRooms",(rooms) => {
      store.dispatch("updateRoomList",rooms)
    })
  }
};
</script>
<style lang="scss">
.room-list {
  margin:0 auto;
  border: 2px;
  border-radius: 5px;
  text-align: center;
  font-size: large;
  vertical-align: auto;
}
</style>
