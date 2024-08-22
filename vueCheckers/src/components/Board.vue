<template>
  <div class="board-container">
    <div>
      <h3 class="curr-player">Current player: {{ currentPlayer }}</h3>
      <h3 class="curr-player">Black player: {{ currentBlackCheckers }}</h3>
      <h3 class="curr-player">White player: {{ currentWhiteCheckers }}</h3>
      <button class="btn" @click="restartGame()">Restart</button>
    </div>
    <div class="board">
      <Cell
        v-for="(cell, index) in board"
        :key="index"
        :cellColor="cell.color"
        :hasChecker="cell.hasChecker"
        :checkerColor="cell.checkerColor"
        :isSelected="selectedChecker === index"
        :isHighlighted="isHighlighted(index)"
        :cellIndex="index"
        :board="board"
        @move="moveChecker"
        @select="selectChecker"
      />
    </div>
    <textarea name="text" id="text" class="text-area">{{
      currentMove
    }}</textarea>
  </div>
</template>

<script>
import Cell from "./Cell.vue";
import axios from "axios";

export default {
  components: {
    Cell,
  },
  data() {
    return {
      board: [],
      selectedChecker: null,
      currentPlayer: "white-checker",
      validMoves: [],
      currentMove: [],
      availableWhiteChecker: [],
      availableBlackChecker: [],
      currentBlackCheckers: 0,
      currentWhiteCheckers: 0,
    };
  },
  async created() {
    await this.loadBoard();
    await this.loadMove();
    // console.log(this.board);
    //await this.loadState();
    //console.log(this.currentPlayer);
  },

  updated(){
    let amountWhite = 0; 
    let amountBlack = 0;
    for (let i = 0; i < this.board.length; i++) {
      if(this.board[i].checkerColor === "white-checker"){
        amountWhite++; 
      }else if(this.board[i].checkerColor === "black-checker"){
        amountBlack++;
      }      
    }
    // console.log(amountBlack);
    this.currentWhiteCheckers = amountWhite;
    this.currentBlackCheckers = amountBlack;
  },

  methods: {
    async loadBoard() {
      const response = await axios.get(`http://localhost:3000/board`);
      this.board = response.data;
      //const responseMove = await axios.get(`http://localhost:3000/move`);
      //this.currentMove = responseMove.data;
    },
    async loadMove() {
      const response = await axios.get(`http://localhost:3000/move`);
      this.currentMove = response.data;
    },
    async loadState() {
      const response = await axios.get(`http://localhost:3000/state`);
      this.currentPlayer = response.data;
    },
    async restartBoard() {
      const response = await axios.get(`http://localhost:3000/restart`);
      this.board = response.data;
    },

    async saveBoard() {
      await axios.post("http://localhost:3000/board", this.board);
    },
    async saveMove() {
      await axios.post("http://localhost:3000/move", this.currentMove);
    },
    async saveState() {
      await axios.post("http://localhost:3000/state", this.currentPlayer);
    },
    async restartGame() {
      await this.restartBoard();
      this.selectedChecker = null;
      this.currentPlayer = "white-checker";
      this.validMoves = [];
      this.currentMove = [];
      // this.isUnderAttack();
    },
    // доделать ход черных шашек: ходить должна шашка, которая находится под атакой
    isUnderAttack() {
      const blackCheckers = [];
      const whiteCheckers = [];

      for (let i = 0; i < this.board.length; i++) {
        if (
          this.board[i].checkerColor === "black-checker" &&
          this.board[i].hasChecker
        ) {
          blackCheckers.push(this.board[i]);
        } else if (
          this.board[i].checkerColor === "white-checker" &&
          this.board[i].hasChecker
        ) {
          whiteCheckers.push(this.board[i]);
        }
      }

      const validBlackCheckers = [];
      const validWhiteCheckers = [];

      for (let i = 0; i < blackCheckers.length; i++) {
        if (this.getValidAttacks(blackCheckers[i].index).length > 0) {
          validBlackCheckers.push(blackCheckers[i].index);
        }
      }
      for (let i = 0; i < whiteCheckers.length; i++) {
        if (this.getValidAttacks(whiteCheckers[i].index).length > 0) {
          //validWhiteCheckers = validWhiteCheckers.concat()
          validWhiteCheckers.push(whiteCheckers[i].index);
        }
      }

      // console.log(validBlackCheckers);
      // console.log(validWhiteCheckers);
      return [validBlackCheckers, validWhiteCheckers];
    },

    selectChecker(index) {
      const [validBlackCheckers, validWhiteCheckers] = this.isUnderAttack();
      // console.log(this.selectedChecker);
      //let test = [index];
      //console.log(test);
      //console.log(validWhiteCheckers.includes(index));

      switch (this.currentPlayer) {
        case "white-checker":
          if (
            validWhiteCheckers.length > 0 &&
            !validWhiteCheckers.includes(index)
          ) {
            return;
          }
          break;
        case "black-checker":
          if (
            validBlackCheckers.length > 0 &&
            !validBlackCheckers.includes(index)
          ) {
            return;
          }
          break;
        default:
          break;
      }

      if (
        this.board[index].hasChecker &&
        this.board[index].checkerColor === this.currentPlayer
        // && this.board[index].checkerColor === "white-checker"
        //&& validWhiteCheckers.includes(index) && validWhiteCheckers.length > 0
      ) {
        this.selectedChecker = index;
        console.log(this.selectedChecker);
        // console.log("selected:" + this.selectedChecker);
        // let selChecker = this.board.find((item) => item.index === index);
        // selChecker.id[0] = 3;

        this.validMoves = this.getValidMoves(index);
      } else {
        this.selectedChecker = null;
        this.validMoves = [];
      }
    },
    async moveChecker(index) {
      let isBite = false;
      if (this.selectedChecker !== null && this.validMoves.includes(index)) {
        // console.log("move:" + index);
        this.currentMove.push(this.currentPlayer, this.selectedChecker, index);
        this.board[index].hasChecker = true;
        this.board[index].checkerColor =
          this.board[this.selectedChecker].checkerColor;
        this.board[this.selectedChecker].hasChecker = false;
        this.board[this.selectedChecker].checkerColor = null;

        if (
          Math.abs(
            Math.floor(index / 8) - Math.floor(this.selectedChecker / 8)
          ) === 2
        ) {
          isBite = true;
          const middleIndex = (index + this.selectedChecker) / 2;
          this.board[middleIndex].hasChecker = false;
          this.board[middleIndex].checkerColor = null;
        }

        this.selectedChecker = null;
        this.validMoves = [];
        // console.log(this.currentMove);
        this.validMoves = this.getValidAttacks(index);
        let changeState = true;
        if (this.validMoves.length > 0 && isBite) {
          console.log("current: " + this.convert(index));
          // this.selectedChecker = index;

          const randomValidAttackIndex = Math.floor(
            Math.random() * this.validMoves.length
          );
          const randValidAttack = this.validMoves[randomValidAttackIndex];
          console.log("desired:" + this.convert(randValidAttack));
          // this.selectedChecker = index;
          // this.moveChecker(randValidAttack);

          changeState = false;
        }
        this.validMoves = [];

        if(changeState) {
          this.currentPlayer =
            this.currentPlayer === "white-checker"
            ? "black-checker"
            : "white-checker";
        }
        // if (this.currentPlayer === "black-checker") this.botMove();
        //console.log(this.currentState);
        await this.saveBoard();
        await this.saveMove();
        await this.saveState();
      }
    },
    getValidMoves(index) {
      const moves = [];
      const direction =
        this.board[index].checkerColor === "white-checker" ? -1 : 1;
      const potentialMoves = [index + direction * 7, index + direction * 9];
      const potentialAttacks = [
        index + direction * 14,
        index + direction * 18,
        index + direction * -14,
        index + direction * -18,
      ];
      potentialAttacks.forEach((move) => {
        if (this.isValidMove(index, move)) {
          moves.push(move);
        }
      });

      if (moves.length <= 0) {
        potentialMoves.forEach((move) => {
          if (this.isValidMove(index, move)) {
            moves.push(move);
          }
        });
      }

      return moves;
    },

    getValidAttacks(index) {
      const moves = [];
      const direction =
        this.board[index].checkerColor === "white-checker" ? -1 : 1;
      const potentialAttacks = [
        index + direction * 14,
        index + direction * 18,
        index + direction * -14,
        index + direction * -18,
      ];
      potentialAttacks.forEach((move) => {
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
        Math.abs(colDiff) === 1
        // && rowDiff === direction
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
    botMove() {
      //if(this.currentPlayer = "black-checker");
      const blackCheckers = [];
      for (let i = 0; i < this.board.length; i++) {
        if (
          this.board[i].checkerColor === "black-checker" &&
          this.board[i].hasChecker
        )
          blackCheckers.push(this.board[i]);
      }
      // this.blackCheckers = blackCheckers;
      console.log("бот сделал ход");
      const validCheckers = [];
      for (let i = 0; i < blackCheckers.length; i++) {
        if (this.getValidAttacks(blackCheckers[i].index).length > 0) {
          validCheckers.push([
            blackCheckers[i].index,
            this.getValidAttacks(blackCheckers[i].index),
          ]);
        }
      }

      if (validCheckers.length <= 0) {
        for (let i = 0; i < blackCheckers.length; i++) {
          if (this.getValidMoves(blackCheckers[i].index).length > 0) {
            validCheckers.push([
              blackCheckers[i].index,
              this.getValidMoves(blackCheckers[i].index),
            ]);
          }
        }
      }

      let randomBlackChecker = 0;
      let randomMove = 0;

      [randomBlackChecker, randomMove] = this.botAI(validCheckers);

      this.validMoves = [randomMove];
      this.selectedChecker = randomBlackChecker;
      this.moveChecker(randomMove);
      // this.currentPlayer =
      // this.currentPlayer === "white-checker"
      //   ? "black-checker"
      //   : "white-checker";
    },

    botAI(validCheckers) {
      const [validBlackCheckers, validWhiteCheckers] = this.isUnderAttack();
      // if (
      //   validBlackCheckers.length > 0 &&
      //   !validBlackCheckers.includes(index)
      // ) {
      //   validCheckers = validBlackCheckers;
      // }

      const randomBlackCheckerIndex = Math.floor(
        Math.random() * validCheckers.length
      );
      const randBlackChecker = validCheckers[randomBlackCheckerIndex];

      const randomBotMoveIndex = Math.floor(
        Math.random() * randBlackChecker[1].length
      );
      const randMove = randBlackChecker[1][randomBotMoveIndex];

      const newRandBlackChecker = randBlackChecker[0];

      return [newRandBlackChecker, randMove];
    },

    dispalyLog() {
      
    },

    convert(index) {
      const id = [Math.floor(index / 8), index % 8];
      return id;
    }
  },

  // mounted() {
  //   if (this.currentPlayer === "black-checker") {
  //     this.makeAIMove();
  //   }
  // },
};
</script>

<style>
.board-container {
  position: relative;
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
.curr-player {
  display: flex;
  flex-direction: column;
  position: relative;
  bottom: 0;
  margin-right: 5px;
  /* /left: 350px; */
  font-size: large;
}

.text-area {
  position: relative;
  width: 170px;
  height: 340px;
}

.btn {
  margin-top: 15px;
  position: relative;
  bottom: 0;
  left: 80px;
  margin-right: 140px;
  /* right: 50px; */
  /* align-self:center; */
  padding: 10px 15px;
  background: none;
  color: gray;
  border: 3px solid gray;
  font-size: larger;
}
</style>
