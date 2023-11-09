<template>
  <div class="single-room" @click="joinRoom(this.roomId)" :style="{color: isRoomAvailableColor}">
    <p v-if="isAvailable">{{ roomId }}</p>
    <p v-else>{{roomId + $t('joinSpectator')}}</p>
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
