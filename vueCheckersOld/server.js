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
  // if(isChecker(index) === true){
  //   return index < 24 && isChecker(index) ? "black-checker" : index >= 40 ? "white-checker" : null;
  // }
  // else{
  //   return null;
  // }
  if(!isChecker(index)){
    return null
  }
  else if(index < 24 && isChecker(index)){
    return "black-checker"
  }
  else if(index >= 40 && isChecker(index)){
    return "white-checker"
  }
  // else if(){
  //   return null
  // }
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

let moves = [];
let player = 'white-checker';

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

// app.post('/restart', (req,res) => {
//   boardStart = req.body;
//   res.sendStatus(200);
// })

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});