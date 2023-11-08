<template>
  <h1>Chenapan en ligne</h1>
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
  text-align: center;
  border-radius: 5px;
  background-color: #bbdde8;
  border: none;
}
.button:hover {
  background-color: #c5e7f2;
  cursor: pointer;
}
</style>
