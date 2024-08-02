<template>
  <div
    :class="['checker', pieceColor, { selected: isSelected }]"
    @mousedown="selectPiece"
  ></div>
</template>

<script>
export default {
  props: {
    pieceColor: String,
    isSelected: Boolean,
    pieceIndex: Number,
  },
  methods: {
    selectPiece() {
      this.$emit("select", this.pieceIndex);
    },
  },
};
</script>

<style>
.checker {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.black-checker {
  background-color: black;
}

.white-checker {
  background-color: white;
  border: 1px solid black;
}

.checker.selected {
  outline: 2px solid blue;
}
</style>
