<template>
  <div class="board-container">
    <div class="board">
      <CheckerCell
        v-for="(cell, index) in board"
        :key="index"
        :cellColor="cell.color"
        :hasChecker="cell.hasChecker"
        :checkerColor="cell.checkerColor"
        :isSelected="selectedChecker === index"
        :isHighlighted="isHighlighted(index)"
        :cellIndex="index"
        @move="moveChecker"
        @select="selectChecker"
      />
    </div>
  </div>
</template>

<script>
import CheckerCell from "./CheckerCell.vue";

export default {
  components: {
    CheckerCell,
  },
  data() {
    return {
      board: this.initializeBoard(),
      selectedChecker: null,
      currentPlayer: "white-checker",
      validMoves: [],
    };
  },
  methods: {
    initializeBoard() {
      return Array.from({ length: 64 }, (_, index) => ({
        id: [Math.floor(index / 8),index % 8],
        index: index,
        color: (Math.floor(index / 8) + index) % 2 === 0 ? "white" : "black",
        hasChecker:
          (Math.floor(index / 8) % 2 === 0
            ? index % 2 === 1
            : index % 2 === 0) &&
          (index < 24 || index >= 40),
        checkerColor:
          index < 24 ? "black-checker" : index >= 40 ? "white-checker" : null,
      }));
    },
    selectChecker(index) {
      if (
        this.board[index].hasChecker 
        //&& this.board[index].checkerColor === "white-checker"
      ) {
        this.selectedChecker = index;
        console.log(this.selectedChecker);
        let selChecker =  this.board.find(
          (item) => item.index === index
        );
        selChecker.id[0] = 3;
        console.log(selChecker.id);

        // console.log(this.board);
        this.validMoves = this.getValidMoves(index);
      } else {
        this.selectedChecker = null;
        this.validMoves = [];
      }
    },
    moveChecker(index) {
      if (this.selectedChecker !== null && this.validMoves.includes(index)) {
        this.board[index].hasChecker = true;
        this.board[index].checkerColor = this.board[this.selectedChecker].checkerColor;
        this.board[this.selectedChecker].hasChecker = false;
        this.board[this.selectedChecker].checkerColor = null;

        if ( 
          Math.abs(
            Math.floor(index / 8) - Math.floor(this.selectedChecker / 8)
          ) === 2
        ) {
          const middleIndex = (index + this.selectedChecker) / 2;
          this.board[middleIndex].hasChecker = false;
          this.board[middleIndex].checkerColor = null;
        }

        this.selectedChecker = null;
        this.validMoves = [];

        this.currentPlayer =
          this.currentPlayer === "white-checker"
            ? "black-checker"
            : "white-checker";
        this.botMove();
      }
    },
    getValidMoves(index) {
      const moves = [];
      const direction =
        this.board[index].checkerColor === "white-checker" ? -1 : 1;
      const potentialMoves = [
        index + direction * 7,
        index + direction * 9,
        index + direction * 14,
        index + direction * 18,
      ];

      potentialMoves.forEach((move) => {
        if (this.isValidMove(index, move)) {
          moves.push(move);
        }
      });

      return moves;
    },
    isValidMove(startIndex, endIndex) {
      if (endIndex < 0 || endIndex >= 64) return false;
      if (this.board[endIndex].hasChecker) return false;

      const rowDiff = Math.floor(endIndex / 8) - Math.floor(startIndex / 8);
      const colDiff = (endIndex % 8) - (startIndex % 8);
      const direction =
        this.board[startIndex].checkerColor === "white-checker" ? -1 : 1;

      if (
        Math.abs(rowDiff) === 1 &&
        Math.abs(colDiff) === 1 &&
        rowDiff === direction
      ) {
        return true;
      } else if (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2) {
        const middleIndex = (endIndex + startIndex) / 2;
        if (
          this.board[middleIndex].hasChecker &&
          this.board[middleIndex].checkerColor !==
            this.board[startIndex].checkerColor
        ) {
          return true;
        }
      }
      return false;
    },
    isHighlighted(index) {
      return this.validMoves.includes(index);
    },
    botMove(){
      const blackCheckers = [];
      for (let i = 0; i < this.board.length; i++) {
        if(this.board[i].checkerColor === "black-checker" && this.board[i].hasChecker) blackCheckers.push(this.board[i]);  
      }
      console.log("бот сделал ход");
      const validCheckers = [];
      console.log(blackCheckers);
      for (let i = 0; i < blackCheckers.length; i++) {
        if(this.getValidMoves(blackCheckers[i].index).length > 0){
          validCheckers.push(this.getValidMoves(blackCheckers[i].index));    
        }
      }
      console.log(validCheckers);
      // console.log(blackCheckers);
      // blackCheckers[1].hasChecker = false;
      // blackCheckers[1].checkerColor = null;
    }
  },
  mounted() {
    if (this.currentPlayer === "black-checker") {
      this.makeAIMove();
    }
  },
};
</script>

<style>
.board-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.board {
  display: grid;
  grid-template-columns: repeat(8, 70px);
  grid-template-rows: repeat(8, 70px);
  gap: 2px;
  border: 5px solid #000;
  padding: 10px;
  box-sizing: border-box;
  background-color: #000;
}
</style>
