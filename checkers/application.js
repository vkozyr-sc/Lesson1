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

// TODO
// Проблема с синхронизацией:
// 	шашки есть у юзера и доски
// 	доска есть у правил и партии
// Ход назад через бой

class Game {
  board;
  user;
  bot;

  startGame() {
    this.generateHTML()
      .then(() => {
        console.log("Игра началась");
        this.user.move();
        console.log(this.user);
        console.log(this.board);
      })
      .catch((error) => {
        console.error("Ошибка при инициализации игры:", error);
      });
  }
  constructor() {}
  // set user(user){
  // 	this._user = user;
  // }

  generateHTML() {
    return new Promise((resolve, reject) => {
      document.addEventListener("DOMContentLoaded", () => {
        const fields = document.getElementById("fields");
        if (!fields) {
          reject(new Error("Элемент 'fields' не найден"));
          return;
        }

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
        let rules = new Rules(board);
        const user = new User(whiteCheckers, rules);
        const bot = new Bot(blackCheckers, rules);
        this.board = board;
        this.user = user;
        this.bot = bot;

        console.log("Инициализация завершена");
        // console.table(this.board);
        // console.table(this.user);

        resolve();
      });
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

  getAvailableMove(checkers, state) {
    console.log(state);
    let result = [];
    let color;
    color = state === "firstClick" ? checkers.color : checkers[0].color;
    let direction = color === "white" ? -1 : 1;
    console.log(color);
    //onsole.log(direction);

    if (state === "noClick")
      result = this.getAvailableMove_NoClick(checkers, direction);
    else if (state === "firstClick")
      result = this.getAvailableMove_FirstClick(checkers, direction);
    return result;
  }

  getAvailableMove_NoClick(checkers, direction) {
    let availableMove = [];
    // this.board.cells[6][3].checker = false;
    // this.board.cells[6][5].checker = false;

    console.log(this.board.cells);
    for (let i = 0; i < checkers.length; i++) {
      let newI = checkers[i].positions[0] + direction;
      let newJ = checkers[i].positions[1];
      let newJRight, newJLeft;
      if (newJ === 0) {
        if (this.board.cells[newI][newJ + 1].checker) continue;
        else {
          availableMove.push([newI - direction, newJ]);
          continue;
        }
      } else if (newJ === 7) {
        if (this.board.cells[newI][newJ - 1].checker) continue;
        else {
          availableMove.push([newI - direction, newJ]);
          continue;
        }
      }
      console.log(`newI: ${newI} newJ: ${newJ}`);
      if (!this.board.cells[newI][newJ + 1].checker) {
        availableMove.push([newI - direction, newJ]);
      } else if (!this.board.cells[newI][newJ - 1].checker) {
        availableMove.push([newI - direction, newJ]);
      }
    }
    return availableMove;
  }

  getAvailableMove_FirstClick(checkers, direction) {
    let availableMove = [];
    let newI = checkers.positions[0] + direction;
    let newJ = checkers.positions[1];
    if (newJ === 0) {
      if (!this.board.cells[newI][newJ + 1].checker) {
        availableMove.push([newI, newJ + 1]);
				return availableMove;
      }
    }
    if (newJ === 7) {
      if (!this.board.cells[newI][newJ - 1].checker) {
        availableMove.push([newI, newJ - 1]);
				return availableMove;
      }
    }

    if (!this.board.cells[newI][newJ + 1].checker) {
      availableMove.push([newI, newJ + 1]);
    } 
		if (!this.board.cells[newI][newJ - 1].checker) {
      availableMove.push([newI, newJ - 1]);
    }

		return availableMove;
    // if(newJ === 0) {
    //   if(this.board.cells[newI][newJ + 1].checker) return;
    //   else {
    //     availableMove.push([newI - direction, newJ]);
    //     return;
    //   }
    // }
    // else if(newJ === 7){
    //   if(this.board.cells[newI][newJ - 1].checker) return;
    //   else {
    //     availableMove.push([newI - direction, newJ]);
    //     return;
    //   }
    // }
    // console.log(`newI: ${newI} newJ: ${newJ}`);
    // if(!this.board.cells[newI][newJ + 1].checker){
    //   availableMove.push([newI - direction, newJ]);
    // }
    // else if(!this.board.cells[newI][newJ - 1].checker){
    //   availableMove.push([newI - direction, newJ]);
    // }
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
  clickStates = {
    noClick: "noClick",
    firstClick: "firstClick",
    secondClick: "secondClick",
  };
  currentState = this.clickStates.noClick;

  constructor(whiteCheckers, rules) {
    this.whiteCheckers = whiteCheckers;
    this.rules = rules;
  }
  move() {
    this.currentState = this.clickStates.noClick;
    // this.whiteCheckers.splice(5,2);
    // console.log(this.whiteCheckers);

    const fields = document.getElementById("fields");
    let avMove = this.rules.getAvailableMove(
      this.whiteCheckers,
      this.currentState
    );
    console.log(avMove);
    this.highlight(avMove, this.currentState);
    fields.addEventListener("click", (event) => {
      let target = event.target;
      let checkType = convert(target, "index");
      let check = false;
      if (!checkType) return;
      for (let one of avMove) {
        if (one[0] === checkType[0] && one[1] === checkType[1]) {
          check = true;
          break;
        }
      }
      if (!check) return;
      this.currentState = this.clickStates.firstClick;
      let index = this.whiteCheckers.find(
        (item) =>
          item.positions[0] === checkType[0] &&
          item.positions[1] === checkType[1]
      );
      // let hype = [6,5];
      // let megaHype = this.whiteCheckers.find(item => item.positions[0] === hype[0] && item.positions[1] === hype[1]);
      console.log(index);
      let move = this.rules.getAvailableMove(index, this.currentState);
      console.log(move);
			this.highlight(move, this.currentState);
    });
  }

  highlight(moves, state) {
    // console.log(fields);
    switch (state) {
      case this.clickStates.noClick:
        let field;
        for (let i = 0; i < moves.length; i++) {
          field = moves[i];
          const elem = document.getElementById(`field_${field[0]}_${field[1]}`);
          elem.style.backgroundColor = "yellow";
        }
        break;
      case this.clickStates.firstClick:
				for (let i = 0; i < 8; i++) {
					for (let j = 0; j < 8; j++) {
						const elem = document.getElementById(`field_${i}_${j}`);
						if(elem.style.backgroundColor === "yellow"){
							elem.style.backgroundColor = "gray";
						}
					}					
				}
				let fieldss;
        for (let i = 0; i < moves.length; i++) {
          fieldss = moves[i];
          const elem = document.getElementById(`field_${fieldss[0]}_${fieldss[1]}`);
          elem.style.backgroundColor = "yellow";
        }

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

function convert(target, option) {
  const regex = /^(\w+)_+(\d+)_+(\d+)$/;
  // const regex = /field_(\d+)_(\d+)/;

  const match = target.id.match(regex);

  if (match) {
    let firstWord;
    switch (option) {
      case "word":
        firstWord = match[1];
        const i = parseInt(match[2], 10);
        const j = parseInt(match[3], 10);
        return firstWord;
      case "index":
        firstWord = match[1];
        if (firstWord === "checker") {
          const i = parseInt(match[2], 10);
          const j = parseInt(match[3], 10);
          return [i, j];
        } else return false;
      default:
        break;
    }
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

const game = new Game();
game.startGame();
//console.log(game.board);
