const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

function isChecker(index) {
  return (
    (Math.floor(index / 8) % 2 === 0 ? index % 2 === 1 : index % 2 === 0) &&
    (index < 24 || index >= 40)
  );
}

function setColor(index){
  if(!isChecker(index)){
    return null
  }
  else if(index < 24 && isChecker(index)){
    return "black-checker"
  }
  else if(index >= 40 && isChecker(index)){
    return "white-checker"
  }
}


let boardStart = Array.from({ length: 64 }, (_, index) => ({
  id: [Math.floor(index / 8), index % 8],
  index: index,
  color: (Math.floor(index / 8) + index) % 2 === 0 ? "white" : "black",
  hasChecker: isChecker(index),
  checkerColor: setColor(index),
}));


let board = Array.from({ length: 64 }, (_, index) => ({
  id: [Math.floor(index / 8), index % 8],
  index: index,
  color: (Math.floor(index / 8) + index) % 2 === 0 ? "white" : "black",
  hasChecker: isChecker(index),
  checkerColor: setColor(index),
}));

let validCheckers = [];
let moves = [];
let player = 'white-checker';
let randBlack, randMove;

app.get('/board', (req, res) => {
  res.json(board);
});

app.get('/restart', (req, res) => {
  res.json(boardStart);
});

app.get('/move', (req, res) => {
  res.json(moves);
});

app.get('/state', (req, res) => {
  res.json(player);
})

app.get('/bot', (req, res) => {
  const [randBlackChecker, randMove] = setTimeout(botAI, 2000, validCheckers) ;
  // setValid(validCheckers);
  res.json(
    [randBlackChecker, randMove]
    // setTimeout(botAI, 1000)
  );
})

app.post('/state', (req, res) => {
  player = req.body;
  res.sendStatus(200);
});

app.post('/board', (req, res) => {
  board = req.body;
  res.sendStatus(200);
});

app.post('/move', (req,res) => {
  moves = req.body;
  res.sendStatus(200);
})

app.post('/botPost', (req,res)=>{
  validCheckers = req.body;
  res.sendStatus(200);
})
// app.post('/restart', (req,res) => {
//   boardStart = req.body;
//   res.sendStatus(200);
// })

function botAI(validCheckers) {
  console.log(validCheckers);
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
}


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});