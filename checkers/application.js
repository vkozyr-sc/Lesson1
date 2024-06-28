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

// TODO
// Проблема с синхронизацией:
// 	шашки есть у юзера и доски(не напрямую, в доске есть клетки, в клетке шашки)
// 	доска есть у правил и партии +-
// Ход назад через бой

// сделать смену состояний в партии для бота и игрока
// переделать вызов .move()
// добавить функционал для кнопки start

class Game {
  board;
  user;
  bot;
  rules;

  whiteCheckerAmount

  gameState = {
    user : 'user',
    bot: 'bot',
  }
  currentState = this.gameState.user;
  startGame() {
    this.generateHTML()
      .then(() => {
        console.log("Игра началась");
        let board = this.user.move();
        if(board){
          this.board = board;
          this.rules.board = board;
        }

        // let check = this.rules.checkWin();
        // console.log(this.user);
        // console.log(this.board);
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

        const whiteCheckers = [];
        const blackCheckers = [];
        const cells = [];

        for (let i = 0; i < 8; i++) {
          const row = document.createElement("div");
          row.id = `row_${i}`;
          row.className = "row";
          fields.append(row);

          const rows = [];
          for (let j = 0; j < 8; j++) {
            const field = document.createElement("div");
            const checker = document.createElement("div");
            field.id = `field_${i}_${j}`;
            field.className = "field";
            row.append(field);

            const cell = new Cell([i, j], false);

            if ((i % 2 === 0 && j % 2 !== 0) || (i % 2 !== 0 && j % 2 === 0)) {
              field.style.backgroundColor = "gray";
              if (i < 3 || i > 4) {
                checker.id = `checker_${i}_${j}`;
                checker.className = "checker";
                checker.style.backgroundColor = i < 3 ? "black" : "white";
                const commonChecker = new CommonChecker(i < 3 ? "black" : "white", [i, j]);
                if (i < 3) blackCheckers.push(commonChecker);
                else whiteCheckers.push(commonChecker);
                cell.checker = commonChecker;
                field.append(checker);
              }
            }

            rows.push(cell);
          }
          cells.push(rows);
        }

        const board = new Board(cells);
        const rules = new Rules(board);
        this.rules = rules;
        this.board = board;
        this.user = new User(whiteCheckers, rules);
        this.bot = new Bot(blackCheckers, rules);

        console.log("Инициализация завершена");
        resolve();
      });
    });
  }
}

class Rules {
  constructor(board) {
    this.board = board;
  }
  checkWin() {}

  isCorrect() {}

  getAvailableMove(checkers, state) {
    const color = state === "firstClick" ? checkers.color : checkers[0].color;
    const direction = color === "white" ? -1 : 1;

    return state === "noClick"
      ? this.getAvailableMove_NoClick(checkers, direction)
      : this.getAvailableMove_FirstClick(checkers, direction);
  }

  getAvailableMove_NoClick(checkers, direction) {
    return checkers.reduce((availableMove, checker) => {
      const [i, j] = checker.positions;
      const newI = i + direction;
      const moves = [
        [newI, j + 1],
        [newI, j - 1]
      ].filter(([x, y]) => x >= 0 && x < 8 && y >= 0 && y < 8 && !this.board.cells[x][y].checker);

      return availableMove.concat(moves.map(([x, y]) => [x - direction, j]));
    }, []);
  }
  
  getAvailableMove_FirstClick(checker, direction) {
    const [i, j] = checker.positions;
    const newI = i + direction;
    const moves = [
      [newI, j + 1],
      [newI, j - 1]
    ].filter(([x, y]) => x >= 0 && x < 8 && y >= 0 && y < 8 && !this.board.cells[x][y].checker);

    return moves;
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
    // this.currentState = this.clickStates.noClick;
    // this.whiteCheckers.splice(5,2);
    // console.log(this.whiteCheckers);
    // return new Promise((resolve, reject) => {
      
    // });
    const fields = document.getElementById("fields");
    let availableMove = this.rules.getAvailableMove(
    this.whiteCheckers,
    this.currentState
    );
    let availableMove2;
    let index;
    // console.log(availableMove);
    this.highlight(availableMove, this.currentState);
    fields.addEventListener("click", (event) => {
      let target = event.target;
      let checkType = convert(target, "index");
      if (!checkType) return;  
      
      switch (this.currentState) {
        case this.clickStates.noClick:
          let check = false;
          for (let one of availableMove) {
            if (one[0] === checkType[0] && one[1] === checkType[1]) {
              check = true;
              break;
            }
          }
          if (!check) return;    

          this.currentState = this.clickStates.firstClick;
          index = this.whiteCheckers.find(
            (item) =>
              item.positions[0] === checkType[0] &&
              item.positions[1] === checkType[1]
          );
          console.log(index);
          availableMove2 = this.rules.getAvailableMove(index, this.currentState);
          console.log(availableMove2);
          this.highlight(availableMove2, this.currentState);
          break;
        case this.clickStates.firstClick:
          let check2 = false;
          for (let one of availableMove2) {
            if (one[0] === checkType[0] && one[1] === checkType[1]) {
              check2 = true;
              break;
            }
          }
          if (!check2) return;
    
          this.currentState = this.clickStates.secondClick;

          console.log('--------');
          console.log(checkType);
          console.log(index);
          console.log('--------');
          let indexDesired = index;
          indexDesired.positions[0] = checkType[0];
          indexDesired.positions[0] = checkType[1];

          for (let i = 0; i < this.whiteCheckers.length; i++) {
            if(index === this.whiteCheckers[i]){
              this.whiteCheckers[i].positions[0] = checkType[0];
              this.whiteCheckers[i].positions[1] = checkType[1];
            }            
          }
          let field, fieldDesired, checker;
          let pos = [];
          for (let i = 0; i < this.rules.board.cells.length; i++) {
            for (let j = 0; j < this.rules.board.cells.length; j++) {
              if(index === this.rules.board.cells[i][j].checker){
                this.rules.board.cells[i][j].checker = false;
                field = document.getElementById(`field_${i}_${j}`);
                checker = document.getElementById(`checker_${i}_${j}`);
                field.removeChild(checker);
              }
              if(i === checkType[0] && j === checkType[1]){
                this.rules.board.cells[i][j].checker = indexDesired;
                fieldDesired = document.getElementById(`field_${i}_${j}`);
                pos = [i,j];
              }
            }
          }
          console.log(checker);
          checker.id = `checker_${pos[0]}_${pos[1]}`;
          fieldDesired.appendChild(checker);

          console.log(this.rules.board);
          // изменить положение шашки у юзера
          // изменить положение на доске (через return)
          // изменить доску в партии и правилах
          // изменить верстку

          console.log('--------');

          this.currentState = this.clickStates.noClick;
          availableMove = this.rules.getAvailableMove(
            this.whiteCheckers,
            this.currentState
          );
          console.log(this.currentState);
          console.log(availableMove);
          this.highlight(availableMove, this.currentState);
          return this.rules.board;
          break;
        default:
          break;
      }
  
    });
  }

  highlight(moves, state) {
    // console.log(fields);
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const elem = document.getElementById(`field_${i}_${j}`);
        if(elem.style.backgroundColor === "aqua"){
          elem.style.backgroundColor = "gray";
        }
      }					
    }
    switch (state) {
      case this.clickStates.noClick:
        let field;
        for (let i = 0; i < moves.length; i++) {
          field = moves[i];
          const elem = document.getElementById(`field_${field[0]}_${field[1]}`);
          elem.style.backgroundColor = "aqua";
        }
        break;
      case this.clickStates.firstClick:
				let fieldss;
        for (let i = 0; i < moves.length; i++) {
          fieldss = moves[i];
          const elem = document.getElementById(`field_${fieldss[0]}_${fieldss[1]}`);
          elem.style.backgroundColor = "aqua";
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

  move(){
    console.log('Бот походил');
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
        if (firstWord === "checker" || firstWord === "field") {
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
