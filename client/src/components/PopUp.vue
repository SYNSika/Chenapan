<template>
  <Transition name="fade" appear>
    <div class="popUp-overlay" v-if="bool1" @click="exitFunction"></div>
  </Transition>
  <Transition name="fade" appear>
    <div class="popUp" v-if="bool1" @click="exitFunction">
      <h3>{{ title }}</h3>
      <hollow-dots-spinner class="spinner"
        v-if="loading"
        :animation-duration="1000"
        :dot-size="15"
        :dots-num="3"
        :color="'#ff1d5e'"
      />
      <p v-if="bool2">{{ subtitle1 }}</p>
      <p v-else>{{ subtitle2 }}</p>
      <p>{{ exitMessage }}</p>
    </div>
  </Transition>
</template>
<script>
import { HollowDotsSpinner } from "epic-spinners";
export default {
  name: "PopUp",
  components: {
    HollowDotsSpinner,
  },
  props: {
    bool1: {
      type: Boolean,
      required: true,
    },
    bool2: {
      type: Boolean,
    },
    loading: {
      type: Boolean,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle1: {
      type: String,
    },
    subtitle2: {
      type: String,
    },
    exitMessage: {
      type: String,
      required: true,
    },
    exitFunction: {
      type: Function,
    },
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
.spinner {
  margin: auto;
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
