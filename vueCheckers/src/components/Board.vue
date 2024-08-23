<template>
  <div class="board-container">
    <div>
      <h3 class="curr-player">Current player: {{ $store.state.currentPlayer }}</h3>
      <h3 class="curr-player">Black player: {{ currentBlackCheckers }}</h3>
      <h3 class="curr-player">White player: {{ currentWhiteCheckers }}</h3>
      <button class="btn" @click="restartGame()">Restart</button>
    </div>
    <div class="board">
      <Cell
        v-for="(cell, index) in board"
        :key="index"
        :board="board"
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
    <textarea name="text" id="text" class="text-area">{{
      currentMove
    }}</textarea>
  </div>
</template>

<script>
import Cell from "./Cell.vue";
import axios from "axios";
import {getValidAttacks, getValidMoves, isValidMove, isUnderAttack} from "@/rules/rules.js"

export default {
  components: {
    Cell,
  },
  data() {
    return {
      board: [],
      selectedChecker: null,
      // currentPlayer: this.$store.state.currentPlayer,
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
    //console.log(this.$store.state.currentPlayer);
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
    // console.log(store.state.currentPlayer)
    // console.log(amountBlack);
    this.currentWhiteCheckers = amountWhite;
    this.currentBlackCheckers = amountBlack;
  },

  methods: {
    async getBotMove(){
      const [randBlackChecker, randMove] = await axios.get(`http://localhost:3000/bot`);
      return [randBlackChecker, randMove];
    },
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
      this.$store.state.currentPlayer = response.data;
    },
    async restartBoard() {
      const response = await axios.get(`http://localhost:3000/restart`);
      this.board = response.data;
    },
    // async postValidChecker(validCheckers){
    //   await axios.post("http://localhost:3000/bot", validCheckers);
    // },
    async saveBoard() {
      await axios.post("http://localhost:3000/board", this.board);
    },
    async saveMove() {
      await axios.post("http://localhost:3000/move", this.currentMove);
    },
    async saveState() {
      await axios.post("http://localhost:3000/state", this.$store.state.currentPlayer);
    },
    async restartGame() {
      await this.restartBoard();
      this.selectedChecker = null;
      this.$store.state.currentPlayer = "white-checker";
      this.validMoves = [];
      this.currentMove = [];
      // this.isUnderAttack();
    },

    selectChecker({validMoves, selectedChecker}) {
      console.log(validMoves, selectedChecker);
      this.validMoves = validMoves
      this.selectedChecker = selectedChecker;
    },
    async moveChecker(index) {
      let isBite = false;
      if (this.selectedChecker !== null && this.validMoves.includes(index)) {
        // console.log("move:" + index);
        this.currentMove.push(this.$store.state.currentPlayer, this.selectedChecker, index);
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
        this.validMoves = getValidAttacks(index, this.board);
        let changeState = true;
        if (this.validMoves.length > 0 && isBite) {
          console.log("current: " + this.convert(index));
          // this.selectedChecker = index;

          const randomValidAttackIndex = Math.floor(
            Math.random() * this.validMoves.length
          );
          const randValidAttack = this.validMoves[randomValidAttackIndex];
          console.log("desired: " + this.convert(randValidAttack));
          // this.selectedChecker = index;
          // this.moveChecker(randValidAttack);

          changeState = false;
        }
        this.validMoves = [];

        if(changeState) {
          this.$store.commit('changeState');
        }
        if (this.$store.state.currentPlayer === "black-checker") this.botMove();
        //console.log(this.currentState);
        await this.saveBoard();
        await this.saveMove();
        await this.saveState();
      }
    },

    isHighlighted(index) {
      return this.validMoves.includes(index);
    },
    async botMove() {
      //if(this.$store.state.currentPlayer = "black-checker");
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
        if (getValidAttacks(blackCheckers[i].index, this.board).length > 0) {
          validCheckers.push([
            blackCheckers[i].index,
            getValidAttacks(blackCheckers[i].index, this.board),
          ]);
        }
      }
      
      if (validCheckers.length <= 0) {
        for (let i = 0; i < blackCheckers.length; i++) {
          if (getValidMoves(blackCheckers[i].index, this.board).length > 0) {
            validCheckers.push([
              blackCheckers[i].index,
              getValidMoves(blackCheckers[i].index, this.board),
            ]);
          }
        }
      }

      let randomBlackChecker = 0;
      let randomMove = 0;
      await axios.post("http://localhost:3000/botPost", validCheckers);
      [randomBlackChecker, randomMove] = await this.getBotMove(validCheckers);

      this.validMoves = [randomMove];
      this.selectedChecker = randomBlackChecker;
      this.moveChecker(randomMove);

    },

    // botAI(validCheckers) {

    //   const randomBlackCheckerIndex = Math.floor(
    //     Math.random() * validCheckers.length
    //   );
    //   const randBlackChecker = validCheckers[randomBlackCheckerIndex];

    //   const randomBotMoveIndex = Math.floor(
    //     Math.random() * randBlackChecker[1].length
    //   );
    //   const randMove = randBlackChecker[1][randomBotMoveIndex];

    //   const newRandBlackChecker = randBlackChecker[0];

    //   return [newRandBlackChecker, randMove];
    // },

    convert(index) {
      const id = [Math.floor(index / 8), index % 8];
      return id;
    }
  },

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
