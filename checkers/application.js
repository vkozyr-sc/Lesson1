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
// сделать смену состояний в партии для бота и игрока
// добавить функционал для кнопки start


// сделать рефакторинг кода
class Game {
  board;
  user;
  bot;
  rules;

  //whiteCheckerAmount

  gameState = {
    user: 'user',
    bot: 'bot',
  }
  currentState = this.gameState.user;
  startGame() {
    this.generate()
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
    .then((pos) => {
      let desiredBlack;
      if (pos) {
        console.log(pos);
        desiredBlack = this.bot.blackCheckers.find(
          (item) => item.positions[0] === pos[0] && item.positions[1] === pos[1]
        );

        for (let i = 0; i < this.bot.blackCheckers.length; i++) {
          if (desiredBlack === this.bot.blackCheckers[i]) {
            //console.log("succes2");
            this.bot.blackCheckers.splice(i, 1);
          }
        }
      }

      let whitePos = this.bot.move();
      if(whitePos){
        let desiredWhite;
        console.log(whitePos);
        desiredWhite = this.user.whiteCheckers.find(
          (item) => item.positions[0] === whitePos[0] && item.positions[1] === whitePos[1]
        );
  
        for (let i = 0; i < this.user.whiteCheckers.length; i++) {
          if (desiredWhite === this.user.whiteCheckers[i]) {
            //console.log("succes2");
            this.rules.board.cells[whitePos[0]][whitePos[1]].checker = false;
            this.user.whiteCheckers.splice(i, 1);
          }
        }  
      }
      this.nextMove();
    })
    .catch((error) => {
      console.error("Ошибка во время хода:", error);
    });
  }

  constructor() {}

  generate() {
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

  // checkIfUnderAttack(checkers) {
  //   return checkers.some(checker => {
  //     const possibleMoves = this.getPossibleAttacks(checker);
  //     return possibleMoves;
  //   });
  // }

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

  beat(state, checker, clickPositions){
    let underAttack = [];

    switch (state) {
      case this.clickStates.noClick:
        for(let checker of this.whiteCheckers){
          let move = this.rules.getPossibleAttacks(checker, this.currentState);
          //console.log(move);
          if(move) underAttack = underAttack.concat(move);
        }    
        // console.log(underAttack);
        if(underAttack.length > 0) {
          // console.log('if'); 
          this.highlight(underAttack, this.clickStates.noClick);
          return underAttack;
        }    
        break;
      case this.clickStates.firstClick:
        let move = this.rules.getPossibleAttacks(checker, this.currentState);
        if(move) underAttack = underAttack.concat(move);
        if(underAttack.length > 0) {
          this.highlight(underAttack, this.clickStates.firstClick);
        }    
        return underAttack;
        break;
      case this.clickStates.secondClick:
        const averagePos = [(clickPositions[0] + checker.positions[0]) / 2, (clickPositions[1] + checker.positions[1]) / 2];
        console.log("Черная шашка находится в: \n");
        // console.log(averagePos);

        let field, checker2;
        const currentBlackChecker = new CommonChecker("black", averagePos);
        // console.log(currentBlackChecker.positions);
        // console.log(this.rules.board.cells[averagePos[0]][averagePos[1]].checker.positions);
        for (let i = 0; i < this.rules.board.cells.length; i++) {
          for (let j = 0; j < this.rules.board.cells.length; j++) {
            if (this.rules.board.cells[i][j].checker &&
              currentBlackChecker.positions[0] === this.rules.board.cells[i][j].checker.positions[0] &&
              currentBlackChecker.positions[1] === this.rules.board.cells[i][j].checker.positions[1] 
            ) {
              // console.log("Succes");
              this.rules.board.cells[i][j].checker = false;
              field = document.getElementById(`field_${i}_${j}`);
              checker2 = document.getElementById(`checker_${i}_${j}`);
              field.removeChild(checker2);
              
            }
          }
        }
        return averagePos;
        break;
      default:
        break;
    }    
  }

  move() {
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


            let blackCheckerPosition;
            if(availableMoveAttack){
              blackCheckerPosition = this.beat(this.currentState, currentChecker, clickPositions);
            }
            this.updateBoard(currentChecker, clickPositions);

            this.currentState = this.clickStates.noClick;

            fields.removeEventListener("click", handleClick);
            resolve(blackCheckerPosition);
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
    desiredChecker.positions[0] = clickPositions[0];
    desiredChecker.positions[1] = clickPositions[1];
    
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
      // Проверить необходимость второго кейса
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
  clickStates = {
    noClick: "noClick",
    firstClick: "firstClick",
    secondClick: "secondClick",
  };
  currentState = this.clickStates.noClick;


  constructor(blackCheckers, rules) {
    this.blackCheckers = blackCheckers;
    this.rules = rules;
  }
  
  beat(underAttack){
    const randomMoveIndex = Math.floor(Math.random() * underAttack.length);
    const [i,j] = underAttack[randomMoveIndex];
    const checker = this.blackCheckers.find(
      (c) => c.positions[0] === i && c.positions[1] === j
    );

    const getPossibleAttack = this.rules.getPossibleAttacks(checker, "firstClick");
    const randomPossibleAttackIndex = Math.floor(Math.random() * getPossibleAttack.length);
    const [newI, newJ] = getPossibleAttack[randomPossibleAttackIndex];

    const defeatedWhiteChecker = [(i + newI) / 2, (j + newJ) / 2];

    checker.positions = [newI, newJ];
    console.log(checker);
    this.rules.board.cells[i][j].checker = false;
    this.rules.board.cells[newI][newJ].checker = checker;

    const oldField = document.getElementById(`field_${i}_${j}`);
    const checkerElement = document.getElementById(`checker_${i}_${j}`);
    oldField.removeChild(checkerElement);

    const newField = document.getElementById(`field_${newI}_${newJ}`);
    checkerElement.id = `checker_${newI}_${newJ}`;
    newField.appendChild(checkerElement);

    const whiteElem = document.getElementById(`checker_${defeatedWhiteChecker[0]}_${defeatedWhiteChecker[1]}`);
    const whiteField = document.getElementById(`field_${defeatedWhiteChecker[0]}_${defeatedWhiteChecker[1]}`);
    whiteField.removeChild(whiteElem);
    
    return defeatedWhiteChecker;
  }

  beatRec(i,j){
    const checker = this.blackCheckers.find(
      (c) => c.positions[0] === i && c.positions[1] === j
    );

    const getPossibleAttack = this.rules.getPossibleAttacks(checker, "firstClick");
    const randomPossibleAttackIndex = Math.floor(Math.random() * getPossibleAttack.length);
    const [newI, newJ] = getPossibleAttack[randomPossibleAttackIndex];

    const defeatedWhiteChecker = [(i + newI) / 2, (j + newJ) / 2];

    checker.positions = [newI, newJ];
    console.log(checker);
    this.rules.board.cells[i][j].checker = false;
    this.rules.board.cells[newI][newJ].checker = checker;

    const oldField = document.getElementById(`field_${i}_${j}`);
    const checkerElement = document.getElementById(`checker_${i}_${j}`);
    oldField.removeChild(checkerElement);

    const newField = document.getElementById(`field_${newI}_${newJ}`);
    checkerElement.id = `checker_${newI}_${newJ}`;
    newField.appendChild(checkerElement);

    const whiteElem = document.getElementById(`checker_${defeatedWhiteChecker[0]}_${defeatedWhiteChecker[1]}`);
    const whiteField = document.getElementById(`field_${defeatedWhiteChecker[0]}_${defeatedWhiteChecker[1]}`)
    whiteField.removeChild(whiteElem);

    let check = this.rules.getPossibleAttacks(checker, "firstClick");
    console.log(checker);
    if(check){
      return this.beatRec(newI, newJ);
    }
    else return defeatedWhiteChecker;
  }

  move() {
    // let checkAttack = false;
    // for(let state in this.clickStates){
    //   let underAttack = this.rules.getPossibleAttacks(this.blackCheckers, state);
    //   if(underAttack) checkAttack = true;
    // }
    //let underAttack = this.rules.getPossibleAttacks(this.blackCheckers, "noClick");
    let underAttack = [];
    for(let checker of this.blackCheckers){
      let move = this.rules.getPossibleAttacks(checker, "noClick");
      if(move) underAttack = underAttack.concat(move);
    }
    
    if(underAttack.length > 0){
      let whitePos = this.beat(underAttack);
      return whitePos;
    }
    console.log("move");
    const availableMoves = this.rules.getAvailableMove(this.blackCheckers, "noClick");
    const randomMoveIndex = Math.floor(Math.random() * availableMoves.length);
    const [i, j] = availableMoves[randomMoveIndex];

    const checker = this.blackCheckers.find(
      (c) => c.positions[0] === i && c.positions[1] === j
    );

    const moves = this.rules.getAvailableMove_FirstClick(checker, 1);
    const [newI, newJ] = moves[Math.floor(Math.random() * moves.length)];

    checker.positions = [newI, newJ];
    this.rules.board.cells[i][j].checker = false;
    this.rules.board.cells[newI][newJ].checker = checker;

    const oldField = document.getElementById(`field_${i}_${j}`);
    const checkerElement = document.getElementById(`checker_${i}_${j}`);
    oldField.removeChild(checkerElement);

    const newField = document.getElementById(`field_${newI}_${newJ}`);
    checkerElement.id = `checker_${newI}_${newJ}`;
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

const game = new Game();
game.startGame();
//console.log(game.board);
