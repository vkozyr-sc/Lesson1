let board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let victoryCombination = [
  //по горизонтали
  [
    [0, 0],
    [0, 1],
    [0, 2],
  ],
  [
    [1, 0],
    [1, 1],
    [1, 2],
  ],
  [
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  //по вертикали
  [
    [0, 0],
    [1, 0],
    [2, 0],
  ],
  [
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  [
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  //по диагонали
  [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  [
    [0, 2],
    [1, 1],
    [2, 0],
  ],
];

function put(a, b, sign) {
  const field = document.getElementById(`field_${a}_${b}`);
  const infoArea = document.getElementById("info");
  if (board[a][b] !== "") {
    // infoArea.innerHTML += 'Эта клетка уже занята';
    return false;
  } else {
    board[a][b] = sign;
    field.innerHTML = sign;
    return true;
  }
}

function checkVictory(currentSign) {
  // let currentSign;
  // if(currentState === states.Player1){
  //     currentSign = 'X';
  // }
  // else{
  //     currentSign = 'O';
  // }
  for (let i = 0; i < victoryCombination.length; i++) {
    let [a, b, c] = victoryCombination[i];
    if (
      board[a[0]][a[1]] === currentSign &&
      board[b[0]][b[1]] === currentSign &&
      board[c[0]][c[1]] === currentSign
    ) {
      result("win", currentSign);
      return true;
    }
  }
  let count = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] !== "") {
        count++;
      }
    }
  }
	console.log(count + " " + currentSign);
  if (count === 9) {
		console.log("попало");
    result("draw", currentSign);
    return true;
  }
}

function result(res, currentSign) {
  const infoArea = document.getElementById("info");
  const fields = document.getElementById("fields");
  //let check;
  if (res === "win") {
    infoArea.innerHTML += `${currentSign} win`;
    //check = confirm(`${currentSign} win`,'')
  } else {
    infoArea.innerHTML += `НИЧЬЯ`;
    //check = confirm("НИЧЬЯ",'')
  }
  //if(check) fields.innerHTML = "";
  //restart();
  // console.log(board);
  // currentState = states.Player1;
}

function restart() {
  board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  const infoArea = document.getElementById("info");
	const fields = document.getElementById("fields");

	infoArea.innerHTML = '';
	// fields.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const field = document.getElementById(`field_${i}_${j}`);
      field.innerHTML = "";
      // infoArea.innerHTML = "";
    }
  }
}

function victory(sign, check) {
  let count = 0;
  for (let i = 0; i < victoryCombination.length; i++) {
    let [a, b, c] = victoryCombination[i];
    let pos = [];
    if (board[a[0]][a[1]] === sign) {
      count++;
    } else {
      pos = a;
    }
    if (board[b[0]][b[1]] === sign) {
      count++;
    } else {
      pos = b;
    }
    if (board[c[0]][c[1]] === sign) {
      count++;
    } else {
      pos = c;
    }

    if (count === 2) {
      //console.log(pos);
      if (put(pos[0], pos[1], "O")) {
        // if(sign === 'X'){
        //     console.log("Не дало победить");
        // }
        // if(sign === 'O'){
        //     console.log("Победило");
        // }
        count = 0;
        if (sign === "O") {
          return 1;
        }
        if (sign === "X") {
          return 2;
        }
      }
    }
    if (count === 1 && check === "!center" && i >= 6) {
      if (put(pos[0], pos[1], "O")) {
        // console.log("тыкнуло куда-нибудь");
        count = 0;
        if (sign === "O" && check === "!center") {
          return 3;
        }
        if (sign === "X" && check === "!center") {
          return 3;
        }
      }
    }
    if (count === 1 && check === "center" && (i === 1 || i === 4)) {
      if (put(pos[0], pos[1], "O")) {
        // console.log("тыкнуло ферзевый гамбит");
        count = 0;
        if (sign === "O" && check === "center") {
          return 3;
        }
        if (sign === "X" && check === "center") {
          return 3;
        }
      }
    }

    count = 0;
  }
  return 0;
}

function setRand() {
  let corner = [
    [0, 0],
    [0, 2],
    [2, 0],
    [2, 2],
  ];
  for (let i = 0; i < corner.length; i++) {
    if (board[corner[i][0]][corner[i][1]] !== "") {
      corner.splice(i, 1);
    }
  }

  while (true) {
    let randNum = getRandom(0, corner.length - 1);
    let cell = corner[randNum];
    //console.log(randNum);
    if (board[cell[0]][cell[1]] === "") {
      put(cell[0], cell[1], "O");
      // console.log("поставило ранд");
      break;
    }
  }
}

function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function bot() {
  let check = 0;
  let center;
  if (board[1][1] === "") {
    put(1, 1, "O");
    return;
  }
  if (board[1][1] === "O") {
    center = true;
  } else {
    center = false;
  }
  // else if(board[0][0] === ''){
  //     put(0,0,'O');
  //     check = 1;
  // }
  // console.log("check: " + check);
  if (check === 0) {
    //console.log("Ставит третий знак");
    check = victory("O");
  }
  if (check === 0) {
    //console.log("Не дает победить противнику");
    check = victory("X");
  }
  if (check === 0 && center) {
    //console.log("ферзевый гамбит");
    check = victory("O", "center");
  }
  if (check === 0) {
    //console.log("Куда-нибудь от 'O'");
    check = victory("O", "z");
  }
  if (check === 0) {
    //console.log("Куда-нибудь от 'X'");
    setRand();
    // console.log("check: " + check);
  }
}

// const handleClickField = (i, j) => {
//   const field = document.getElementById(`field_${i}_${j}`);
//   const infoArea = document.getElementById("info");
//   if (board[i][j] === "") {
//     put(i, j, "X");

//     checkVictory("X");
//     bot();
//     checkVictory("O");
//   } else {
//     infoArea.innerHTML += "Эта клетка уже занята<br/>";
//   }
// };

function setX(target) {
  target.innerHTML = "X";
	let check;
	const regex = /field_(\d+)_(\d+)/;

	const match = target.id.match(regex);
	if (match) {
		const i = parseInt(match[1], 10);
		const j = parseInt(match[2], 10);
		board[i][j] = "X";
	} 
  check = checkVictory("X");
	if(check) {
		fields.removeEventListener('click', fieldsHandler);
		return
	}
  bot();
  check = checkVictory("O");
	if(check){
		fields.removeEventListener('click', fieldsHandler);
		return
	}

}

const fieldsHandler = (event) => {
	let target = event.target;
	if(target.innerHTML !== '') return;
	// for (let i = 0; i < 3; i++) {
	// 	for (let j = 0; j < 3; j++) {
	// 		if (target.id !== `field_${i}_${j}`) return;
	// 	}
	// }		
	setX(target);
}


(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const fields = document.getElementById("fields");
    const button = document.getElementById("event-button");
    // let withEventHandler = false;
    // button.addEventListener("click", () => {
    // });
    for (let i = 0; i < 3; i++) {
      const row = document.createElement("div");
      row.id = `row_${i}`;
      row.className = "row";
      fields.append(row);

      for (let j = 0; j < 3; j++) {
        const field = document.createElement("div");
        field.id = `field_${i}_${j}`;
        // field.id = `field`;
        field.className = `field`;
        field.innerHTML = "";
        row.append(field);

        // field.addEventListener("click", () => {
        //   handleClickField(i, j);
        // });
        //field.removeEventListener;
      }
    }
    button.addEventListener("click", () => {
			restart();
			fields.addEventListener("click", fieldsHandler);
    });
    fields.addEventListener("click", fieldsHandler);
  });
})();
