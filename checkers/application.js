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


// сделать рефакторинг кода
class Game {
  board;
  user;
  bot;
  rules;

  whiteCheckerAmount

  gameState = {
    user: 'user',
    bot: 'bot',
  }
  currentState = this.gameState.user;
  startGame() {
    this.generateHTML()
      .then(() => {
        // console.log("Игра началась");
        // const fields = document.getElementById("fields");
        // fields.addEventListener("click", this.nextMove());
        this.nextMove();
        // let check = this.rules.checkWin();
        // console.log(this.user);
        // console.log(this.board);
      })
      .catch((error) => {
        console.error("Ошибка при инициализации игры:", error);
      });
  }

  nextMove(){
    //console.log("nextMove");
    this.user.move()
    .then((board) => {
      // if (board) {
      //   // this.board = board;
      //   // this.rules.board = board;
      //   // this.bot.rules.board = board;
      // }
      //console.log(game);
      this.bot.move();
      // .then((board) => {
      //   if (board) {
      //     this.board = board;
      //     this.rules.board = board;
      //     this.user.rules.board = board;
      //   }
      //   this.nextMove();
      // })
      // .catch((error) => {
      //   console.error("Ошибка во время хода бота:", error);
      // });
      this.nextMove();
    })
    .catch((error) => {
      console.error("Ошибка во время хода:", error);
    });
  }

  constructor() {}

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

  checkIfUnderAttack(checkers) {
    return checkers.some(checker => {
      const possibleMoves = this.getPossibleAttacks(checker);
      return possibleMoves;
    });
  }

  getPossibleAttacks(checker, state) {
    const [i, j] = checker.positions;
    const directions = [
      [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];
    let possibleAttacks = [];

    for (let [dx, dy] of directions) {
      const newI = i + dx * 2;
      const newJ = j + dy * 2;
      const middleI = i + dx;
      const middleJ = j + dy;

      if (this.isValidPosition(newI, newJ) &&
          this.board.cells[middleI][middleJ].checker &&
          this.board.cells[middleI][middleJ].checker.color !== checker.color &&
          !this.board.cells[newI][newJ].checker) {
        if(state === "noClick") possibleAttacks.push([i,j]);    
        else if(state === "firstClick") possibleAttacks.push([newI, newJ]);
        else if(state === "secondClick") possibleAttacks.push([middleI, middleJ]);
      }
    }
    //console.log(possibleAttacks);
    if(possibleAttacks.length > 0) return possibleAttacks;
  }

  isValidPosition(x, y) {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
  }

}


class Checker {
  constructor(color, positions) {
    this.color = color;
    this.positions = positions;
  }

  //beat() {}
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

  beat(state, checker){
    let underAttack = [];
    //underAttack.push([3,2]);

    switch (state) {
      case this.clickStates.noClick:
        for(let checker of this.whiteCheckers){
          let move = this.rules.getPossibleAttacks(checker, this.currentState);
          //console.log(move);
          if(move) underAttack = underAttack.concat(move);
        }    
        // console.log(underAttack);
        if(underAttack.length > 0) {
          console.log('if'); 
          this.highlight(underAttack, this.clickStates.noClick);
          return underAttack;
        }    
        break;
      case this.clickStates.firstClick:
        let move = this.rules.getPossibleAttacks(checker, this.currentState);
        //console.log(move);
        if(move) underAttack = underAttack.concat(move);
        // console.log(underAttack);
        if(underAttack.length > 0) {
          console.log('if'); 
          this.highlight(underAttack, this.clickStates.firstClick);
        }    
        return underAttack;
        break;
      case this.clickStates.secondClick:
        let blackPos = this.rules.getPossibleAttacks(checker, this.currentState);
        console.log("move");
        console.log(checker.positions);
        console.log(blackPos);

        // if (blackPos.length > 1) {
        //   blackPos.slice(1, blackPos.length)
        // }
        let blackPosCh = checker;
        blackPosCh.positions = blackPos;
        console.log(blackPosCh);
        // let field, fieldDesired, checker;
        // let pos;
        // for (let i = 0; i < this.rules.board.cells.length; i++) {
        //   for (let j = 0; j < this.rules.board.cells.length; j++) {
        //     if (currentChecker === this.rules.board.cells[i][j].checker) {
        //       this.rules.board.cells[i][j].checker = false;
        //       field = document.getElementById(`field_${i}_${j}`);
        //       checker = document.getElementById(`checker_${i}_${j}`);
        //       field.removeChild(checker);
        //     }
        //     if (i === clickPositions[0] && j === clickPositions[1]) {
        //       this.rules.board.cells[i][j].checker = desiredChecker;
        //       fieldDesired = document.getElementById(`field_${i}_${j}`);
        //       pos = [i,j];
        //     }
        //   }
        // }
        // checker.id = `checker_${pos[0]}_${pos[1]}`;
        // fieldDesired.appendChild(checker);
    

        break;
      default:
        break;
    }    
  }

  move() {
    // this.currentState = this.clickStates.noClick;
    // this.whiteCheckers.splice(5,2);
    // console.log(this.whiteCheckers);
    // return new Promise((resolve, reject) => {
      
    // });
    return new Promise((resolve) => {
      const fields = document.getElementById("fields");
      let availableMove = this.rules.getAvailableMove(
      this.whiteCheckers,
      this.currentState
      );
      let availableMove2;
      let currentChecker;
      // console.log(availableMove);
      this.highlight(availableMove, this.currentState);
      let availableMoveAttack = this.beat(this.currentState);
      if(availableMoveAttack){
        availableMove = availableMoveAttack;
      }
      const handleClick = (event) => {
        let target = event.target;
        let clickPositions = convert(target, "index");
        if (!clickPositions) return;

        switch (this.currentState) {
          case this.clickStates.noClick:
            let check = availableMove.some(
              (one) => one[0] === clickPositions[0] && one[1] === clickPositions[1]
            );
            if (!check) return;

            this.currentState = this.clickStates.firstClick;
            currentChecker = this.whiteCheckers.find(
              (item) =>
                item.positions[0] === clickPositions[0] &&
                item.positions[1] === clickPositions[1]
            );

            if(availableMoveAttack){
              availableMove2 = this.beat(this.currentState, currentChecker);
              return;
            }
            
            availableMove2 = this.rules.getAvailableMove(currentChecker, this.currentState);
            this.highlight(availableMove2, this.currentState);
            break;

          case this.clickStates.firstClick:
            let check2 = availableMove2.some(
              (one) => one[0] === clickPositions[0] && one[1] === clickPositions[1]
            );
            if (!check2) return;

            this.currentState = this.clickStates.secondClick;


        
            if(availableMoveAttack){
              this.beat(this.currentState, currentChecker);
            }
            this.updateBoard(currentChecker, clickPositions);

            // console.log(`clickState: ${this.currentState}`);
            // this.highlight(availableMove, this.clickStates.noClick);
            this.currentState = this.clickStates.noClick;

            // this.currentState = this.clickStates.noClick;

            fields.removeEventListener("click", handleClick);
            resolve(this.rules.board);
            break;
          default:
            break;
        }
      };
      
      fields.addEventListener("click", handleClick);

    })
  }

  updateBoard(currentChecker, clickPositions){
    let desiredChecker = currentChecker;
    // console.log(currentChecker.positions);
    desiredChecker.positions[0] = clickPositions[0];
    desiredChecker.positions[1] = clickPositions[1];
    // console.log(desiredChecker.positions);

    for (let i = 0; i < this.whiteCheckers.length; i++) {
      if (currentChecker === this.whiteCheckers[i]) {
        this.whiteCheckers[i].positions[0] = clickPositions[0];
        this.whiteCheckers[i].positions[1] = clickPositions[1];
      }
    }

    let field, fieldDesired, checker;
    let pos;
    for (let i = 0; i < this.rules.board.cells.length; i++) {
      for (let j = 0; j < this.rules.board.cells.length; j++) {
        if (currentChecker === this.rules.board.cells[i][j].checker) {
          this.rules.board.cells[i][j].checker = false;
          field = document.getElementById(`field_${i}_${j}`);
          checker = document.getElementById(`checker_${i}_${j}`);
          field.removeChild(checker);
        }
        if (i === clickPositions[0] && j === clickPositions[1]) {
          this.rules.board.cells[i][j].checker = desiredChecker;
          fieldDesired = document.getElementById(`field_${i}_${j}`);
          pos = [i,j];
        }
      }
    }
    checker.id = `checker_${pos[0]}_${pos[1]}`;
    fieldDesired.appendChild(checker);
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
  constructor(blackCheckers, rules) {
    this.blackCheckers = blackCheckers;
    this.rules = rules;
  }

  move() {
    const availableMoves = this.rules.getAvailableMove(
      this.blackCheckers,
      "noClick"
    );

    const randomMoveIndex = Math.floor(Math.random() * availableMoves.length);
    const [checkerX, checkerY] = availableMoves[randomMoveIndex];

    const checker = this.blackCheckers.find(
      (c) => c.positions[0] === checkerX && c.positions[1] === checkerY
    );

    const moves = this.rules.getAvailableMove_FirstClick(checker, 1);

    const [newX, newY] = moves[Math.floor(Math.random() * moves.length)];

    checker.positions = [newX, newY];

    this.rules.board.cells[checkerX][checkerY].checker = false;
    this.rules.board.cells[newX][newY].checker = checker;

    const oldField = document.getElementById(`field_${checkerX}_${checkerY}`);
    const checkerElement = document.getElementById(
      `checker_${checkerX}_${checkerY}`
    );
    oldField.removeChild(checkerElement);

    const newField = document.getElementById(`field_${newX}_${newY}`);
    checkerElement.id = `checker_${newX}_${newY}`;
    newField.appendChild(checkerElement);

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
