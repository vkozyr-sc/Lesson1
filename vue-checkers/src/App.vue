<!-- App.vue -->
<template>
  <div id="app">
    <Game />
  </div>
</template>

<script>
import Game from './components/Game.vue';

export default {
  components: {
    Game,
  },
};
</script>

<style>
/* Основные стили приложения */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
