<template>
  <h1>{{ $t('title') }}</h1>
  <div class="locale-changer">
    <select v-model="$i18n.locale">
      <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">{{ locale }}</option>
    </select>
  </div>
  <router-view />
</template>

<style lang="scss">
#app {
  margin: auto;
  display: flex;
  flex-direction: column;
  width: 75%;
  height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: black;
  text-align: center;
  background-color: #f8f5e9;
}
.button {
  margin: auto;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 150px;
  height: 40px;
  line-height: normal;
  font-weight: bold;
  text-align: center;
  border-radius: 5px;
  background-color: #bbdde8;
  color: white;
  border: none;
}
.button:hover {
  background-color: #c5e7f2;
  cursor: pointer;
}
.locale-changer {
  position: absolute;
  top: 4%;
  right: 20%;
  appearance: none;
}
</style>
