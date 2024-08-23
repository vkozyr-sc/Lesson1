<!-- Board.vue -->
<template>
  <div class="board">
    <div v-for="(row, rowIndex) in cells" :key="rowIndex" class="row">
      <Cell v-for="(cell, colIndex) in row" :key="colIndex" :cell="cell" @click="handleClick(rowIndex, colIndex)" />
    </div>
  </div>
</template>

<script>
import Cell from './Cell.vue';

export default {
  components: { Cell },
  props: {
    cells: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    const handleClick = (rowIndex, colIndex) => {
      emit('cellClick', [rowIndex, colIndex]);
    };

    return { handleClick };
  },
};
</script>

<style>
.board {
  display: grid;
  grid-template-rows: repeat(8, 1fr);
  grid-template-columns: repeat(8, 1fr);
  width: 400px;
  height: 400px;
  margin: 0 auto;
}
.row {
  display: contents;
}
</style>
