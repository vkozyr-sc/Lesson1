<!-- Checker.vue -->
<template>
  <div :class="['checker', checker.color]"></div>
</template>

<script>
export default {
  props: {
    checker: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style>
.checker {
  width: 80%;
  height: 80%;
  border-radius: 50%;
  box-sizing: border-box;
}

.checker.black {
  background-color: black;
}

.checker.white {
  background-color: white;
}
</style>
