class Board {
  constructor(cells) {
    this.cells = cells;
  }
}

class Cell {
  constructor(postions, checker) {
    this.postions = postions;
    this.checker = checker;
  }
}

// const i = 2;
// const j = 33;
// const pos = [i,j]
// const cell = new Cell(pos);
// console.log(cell.postions[1]);

class Game {
  board;
  user;
  bot;
  startGame() {
    this.generateHTML();
		console.log("aassaa");
		// this.user.move();
		console.log(this.user);
		console.log(this.board);
  }
	constructor(){}
	// set user(user){
	// 	this._user = user;
	// }

  generateHTML() {
    document.addEventListener("DOMContentLoaded", () => {
      const fields = document.getElementById("fields");
      let whiteCheckers = [];
      let blackCheckers = [];
      let cells = [];
      for (let i = 0; i < 8; i++) {
        const row = document.createElement("div");
        row.id = `row_${i}`;
        row.className = "row";
        fields.append(row);

        let rows = [];

        for (let j = 0; j < 8; j++) {
          const field = document.createElement("div");
          const checker = document.createElement("div");
          field.id = `field_${i}_${j}`;
          field.className = `field`;
          field.innerHTML = "";
          row.append(field);

          let cell = new Cell([i, j], false);

          if (i % 2 === 0) {
            if (j % 2 !== 0) {
              field.style.backgroundColor = "gray";
              if (i !== 4) {
                checker.id = `checker_${i}_${j}`;
                checker.className = "checker";
                if (i < 3) {
                  checker.style.backgroundColor = "black";
                  let blackChecker = new CommonChecker("black", [i, j]);
                  blackCheckers.push(blackChecker);
                  cell.checker = blackChecker;
                } else {
                  checker.style.backgroundColor = "white";
                  let whiteChecker = new CommonChecker("white", [i, j]);
                  whiteCheckers.push(whiteChecker);
                  cell.checker = whiteChecker;
                }
                field.append(checker);
              }
            }
          } else if (i % 2 !== 0) {
            if (j % 2 === 0) {
              field.style.backgroundColor = "gray";
              if (i !== 3) {
                checker.id = `checker_${i}_${j}`;
                checker.className = "checker";
                if (i < 3) {
                  checker.style.backgroundColor = "black";
                  let blackChecker = new CommonChecker("black", [i, j]);
                  blackCheckers.push(blackChecker);
                  cell.checker = blackChecker;
                } else {
                  checker.style.backgroundColor = "white";
                  let whiteChecker = new CommonChecker("white", [i, j]);
                  whiteCheckers.push(whiteChecker);
                  cell.checker = whiteChecker;
                }
                field.append(checker);
              }
            }
          }
          rows.push(cell);
        }
        cells.push(rows);
      }
      const board = new Board(cells);
      let rules = new Rules(this.board);
      const user = new User(whiteCheckers, rules);
      const bot = new Bot(blackCheckers, rules);
			this.board = board;
			this.user = user;
			this.bot = bot;
      console.table(this.board);
			console.table(this.user);
      // fields.addEventListener("click", fieldsHandler);
    });
  }

  generateObjects() {}
}

class Rules {
  constructor(board) {
    this.board = board;
  }
  checkWin() {}

  isCorrect() {}

  getAvailableMove() {
		let availableMove = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {

				if(this.board.cells[i][j].checker){

					if(!this.board.cells[i + 1][j - 1].checker || !this.board.cells[i + 1][j + 1].checker){
						availableMove.push([i,j]);
					}
				}
      }
    }
  }
}

class Checker {
  constructor(color, positions) {
    this.color = color;
    this.positions = positions;
  }

  beat() {}
}

class CommonChecker extends Checker {}

class QueenChecker extends Checker {}

class User {
  rules;
  currentState;
  clickStates = {
    noClick: "noClick",
    firstClick: "firstClick",
    secondClick: "secondClick",
  };
  constructor(whiteCheckers, rules) {
    this.whiteCheckers = whiteCheckers;
    this.rules = rules;
  }
  move() {
    this.currentState = this.clickStates.noClick;
    const fields = document.getElementById("fields");
    this.highlight();
		let avMove = this.rules.getAvailableMove();
		console.log(avMove);
    // fields.addEventListener("click", () => {
    //   this.currentState = this.clickStates.firstClick;
    // });
  }

  highlight() {
    switch (this.currentState) {
      case this.clickStates.noClick:
        break;
      case this.clickStates.firstClick:
        break;
      default:
        break;
    }
  }
}

class Bot {
  constructor(blackCheckers) {
    this.blackCheckers = blackCheckers;
  }
}

// let board = [[]];
// for (let i = 0; i < 8; i++) {
//   let row = [];
//   for (let j = 0; j < 8; j++) {
//     row.push("");
//   }
//   board.push(row);
// }

function convert(target) {
  const regex = /^(\w+)_+(\d+)_+(\d+)$/;
  // const regex = /field_(\d+)_(\d+)/;

  const match = target.id.match(regex);
  if (match) {
    const firstWord = match[1];
    if (firstWord === "checker") {
      const i = parseInt(match[2], 10);
      const j = parseInt(match[3], 10);
      return [i, j];
    } else return false;
    //board[i][j] = "X";
  }
}

const fieldsHandler = (event) => {
  let target = event.target;
  console.log(target.id);
  // target.style.backgroundColor = "yellow";
  const index = convert(target);
  if (index) {
    const [i, j] = index;
    console.log(`i: ${i} j: ${j}`);
  } else console.log("не шашка");
};

// TODO:
// логика и взаимодействие классов
// какое будет поле(через дом элементы или массив)
// если массив подумать про синхронизацию
// шашка(дамка/простая) как это реализовать в классах
// раскидать функцию по методам класса(в основном в Game в generate())

const game = new Game();
game.startGame();
//console.log(game.board);
