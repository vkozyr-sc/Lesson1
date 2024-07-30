<!-- Game.vue -->
<template>
  <div>
    <button class="btn" v-bind:class="{active: isActive}" @click="startGame" >Start</button>
    <Board v-if="cells.length" :cells="cells" @cellClick="handleCellClick" />
  </div>
</template>

<script>
import { ref } from "vue";
import Board from "./Board.vue";

export default {
  data (){
    return {isActive : false}
  },
  components: { Board },
  setup() {
    const cells = ref([]);

    const generate = () => {
      const newCells = [];
      for (let i = 0; i < 8; i++) {
        const row = [];
        for (let j = 0; j < 8; j++) {
          const isChecker = (i + j) % 2 !== 0 && (i < 3 || i > 4);
          const checker = isChecker
            ? { color: i < 3 ? "black" : "white" }
            : null;
          row.push({ position: [i, j], checker });
        }
        newCells.push(row);
      }
      cells.value = newCells;
      console.log("Cells generated with checkers:", cells.value);
    };

    const startGame = () => {
      this.isActive = !this.isActive;
      console.log("Game started");
      generate();
    };

    const handleCellClick = (position) => {
      console.log("Cell clicked:", position);
      // Обработка кликов по ячейкам
    };

    return { cells, startGame, handleCellClick };
  },
};
</script>

<style>
.btn {
  margin-bottom: 20px;
}
.active {
  display: none;
}

</style>
