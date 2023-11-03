<template>
  <Transition name="fade" appear>
    <div class="popUp-overlay" v-if="isGameOver" @click="leaveRoom"></div>
  </Transition>
  <Transition name="fade" appear>
    <div class="popUp" v-if="isGameOver" @click="leaveRoom">
      <h3>Partie Terminé</h3>
      <p v-if="isGameWon">Vous avez gagné</p>
      <p v-else>Vous avez perdu</p>
      <p>Cliquez pour quitter la room</p>
    </div>
  </Transition>
</template>
<script>
import { mapActions } from 'vuex';
export default {
  name: "PopUp",
  props: {
    isGameOver: {
      type: Boolean,
      required: true,
    },
    isGameWon: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
        ...mapActions(["leaveRoom"])
    },
};
</script>
<style lang="scss">
.popUp-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 98;
  background-color: rgba(0, 0, 0, 0.5);
}
.popUp {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  z-index: 99;
  width: 100%;
  max-width: 400px;
  background-color: #fff;
  border-radius: 16px;

  padding: 25px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
