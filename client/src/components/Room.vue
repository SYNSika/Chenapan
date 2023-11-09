<template>
  <div class="single-room" @click="joinRoom(roomId)" :style="{color: isRoomAvailableColor}">
    <p>{{ roomId }}</p>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "SingleRoom",
  props: {
    roomId: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    isRoomAvailableColor(){
      if(this.isAvailable) {
        return "green"
      }
      return "red"
    }
  },
  methods: {
    ...mapActions(["joinRoom"]),
  },
};
</script>
<style lang="scss">
.single-room {
  border: 2px black;
  border-radius: 5px;
  text-align: center;
}
</style>
