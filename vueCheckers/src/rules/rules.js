export function getValidAttacks(index, board) {
  const moves = [];
  const direction =
    board[index].checkerColor === "white-checker" ? -1 : 1;
  const potentialAttacks = [
    index + direction * 14,
    index + direction * 18,
    index + direction * -14,
    index + direction * -18,
  ];
  potentialAttacks.forEach((move) => {
    if (isValidMove(index, move, board)) {
      moves.push(move);
    }
  });

  return moves;
}

export function getValidMoves(index, board) {
  const moves = [];
  const direction =
    board[index].checkerColor === "white-checker" ? -1 : 1;
  const potentialMoves = [index + direction * 7, index + direction * 9];
  const potentialAttacks = [
    index + direction * 14,
    index + direction * 18,
    index + direction * -14,
    index + direction * -18,
  ];
  potentialAttacks.forEach((move) => {
    if (isValidMove(index, move, board)) {
      moves.push(move);
    }
  });

  if (moves.length <= 0) {
    potentialMoves.forEach((move) => {
      if (isValidMove(index, move, board)) {
        moves.push(move);
      }
    });
  }

  return moves;
}

export function isValidMove(startIndex, endIndex, board) {
  if (endIndex < 0 || endIndex >= 64) return false;
  if (board[endIndex].hasChecker) return false;

  const rowDiff = Math.floor(endIndex / 8) - Math.floor(startIndex / 8);
  const colDiff = (endIndex % 8) - (startIndex % 8);
  const direction =
    board[startIndex].checkerColor === "white-checker" ? -1 : 1;
  if (
    Math.abs(rowDiff) === 1 &&
    Math.abs(colDiff) === 1
    // && rowDiff === direction
  ) {
    return true;
  } else if (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2) {
    const middleIndex = (endIndex + startIndex) / 2;
    if (
      board[middleIndex].hasChecker &&
      board[middleIndex].checkerColor !==
        board[startIndex].checkerColor
    ) {
      return true;
    }
  }
  return false;
}

export function isUnderAttack(board) {
  const blackCheckers = [];
  const whiteCheckers = [];
  for (let i = 0; i < board.length; i++) {
    if (
      board[i].checkerColor === "black-checker" &&
      board[i].hasChecker
    ) {
      blackCheckers.push(board[i]);
    } else if (
      board[i].checkerColor === "white-checker" &&
      board[i].hasChecker
    ) {
      whiteCheckers.push(board[i]);
    }
  }

  const validBlackCheckers = [];
  const validWhiteCheckers = [];

  for (let i = 0; i < blackCheckers.length; i++) {
    if (getValidAttacks(blackCheckers[i].index, board).length > 0) {
      validBlackCheckers.push(blackCheckers[i].index);
    }
  }
  for (let i = 0; i < whiteCheckers.length; i++) {
    if (getValidAttacks(whiteCheckers[i].index, board).length > 0) {
      //validWhiteCheckers = validWhiteCheckers.concat()
      validWhiteCheckers.push(whiteCheckers[i].index);
    }
  }

  // console.log(validBlackCheckers);
  // console.log(validWhiteCheckers);
  return [validBlackCheckers, validWhiteCheckers];
}
