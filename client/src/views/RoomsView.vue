<template>
  <div class="room-list">
    <p>List des rooms</p>
    <SingleRoom v-for="(room, index) in roomList" :key="index" :roomId="room" />
  </div>
  <button class="create-room-button" @click="createRoom">Créer une room</button>
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
.create-room-button {
  margin: auto;
  margin-top: 10px;
  width: 150px;
  height: 40px;
  line-height: 50%;
  text-align: center;
  border-radius: 5px;
  background-color: gold;
}
.create-room-button:hover {
  background-color: goldenrod;
}
</style>
