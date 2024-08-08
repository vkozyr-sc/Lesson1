<template>
  <div
    :class="['cell', cellColor, { highlight: isHighlighted }]"
    @click="movePiece"
  >
    <CheckerPiece
      v-if="hasChecker"
      :pieceColor="checkerColor"
      :isSelected="isSelected"
      :pieceIndex="cellIndex"
      @select="selectPiece"
    />
  </div>
</template>

<script>
import CheckerPiece from "./CheckerPiece.vue";

export default {
  components: {
    CheckerPiece,
  },
  props: {
    cellColor: String,
    hasChecker: Boolean,
    checkerColor: String,
    isSelected: Boolean,
    isHighlighted: Boolean,
    cellIndex: Number,
  },
  methods: {
    movePiece() {
      this.$emit("move", this.cellIndex);
    },
    selectPiece(index) {
      this.$emit("select", index);
    },
  },
};
</script>

<style>
.cell {
  width: 70px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cell.white {
  background-color: #fff;
}

.cell.black {
  background-color: #808080; 
}

.cell.highlight {
  background-color: yellow; 
}
</style>
