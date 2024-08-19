<template>
  <div id="app">
    <Board />
  </div>
</template>

<script>
import Board from "./components/Board.vue";

export default {
  name: "App",
  components: {
    Board,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}
</style>
