<template>
  <div id="app">
    <CheckerBoard />
  </div>
</template>

<script>
import CheckerBoard from "./components/CheckerBoard.vue";

export default {
  name: "App",
  components: {
    CheckerBoard,
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
