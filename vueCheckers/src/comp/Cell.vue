<!-- Cell.vue -->
<template>
  <div class="cell" :style="cellStyle" @click="onClick">
    <Checker v-if="cell.checker" :checker="cell.checker" />
  </div>
</template>

<script>
import Checker from "../comp/Checker.vue";

export default {
  components: { Checker },
  props: {
    cell: {
      type: Object,
      required: true,
    },
  },
  computed: {
    cellStyle() {
      const [row, col] = this.cell.position;
      return {
        backgroundColor: row % 2 === col % 2 ? "white" : "gray",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      };
    },
  },
  methods: {
    onClick() {
      this.$emit("click");
    },
  },
};
</script>

<style>
.cell {
  box-sizing: border-box;
  border: 1px solid #000;
}
</style>
