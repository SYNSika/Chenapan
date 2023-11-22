<template>
  <div class="home-login">
    <form id="username" action="">
      <input type="text" v-model="username" placeholder="username" />
    </form>
    <button class="button" type="submit" form="username" @click.prevent="logIn" :disabled="!username">{{ $t('homeButton') }}</button>
  </div>
</template>
<script>
import router from '@/router';
import store from '@/store';

export default {
  name: "LoginUser",
  data() {
    return {
      username: "",
    }
  },
  methods : {
    logIn() {
        store.dispatch("logIn", this.username)
        this.username = ""
        router.push('/rooms')
    }
  }
};
</script>
<style lang="scss">
button:disabled{
    background-color: gray;
    &:hover {
        background-color: gray;
        cursor: auto;
    }
}
</style>
