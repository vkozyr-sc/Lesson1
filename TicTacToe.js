let board = [
    ['#', '#', '#'],
    ['#', '#', '#'],
    ['#', '#', '#'],
];

let victoryCombination = [
    //по горизонтали
    [[0,0], [0,1], [0,2]],
    [[1,0], [1,1], [1,2]],
    [[2,0], [2,1], [2,2]],
    //по вертикали
    [[0,0], [1,0], [2,0]],
    [[0,1], [1,1], [2,1]],
    [[0,2], [1,2], [2,2]],
    //по диагонали
    [[0,0], [1,1], [2,2]],
    [[0,2], [1,1], [2,0]],
]

let states = {
    Player1 : 'Player1',
    Player2 : 'Player2',
}
let currentState = states.Player1;

function set(a,b){
    game(a, b);
}
function win(){
    console.log(currentState + ' win');
    board = [
        ['#', '#', '#'],
        ['#', '#', '#'],
        ['#', '#', '#'],
    ];
    console.log(board);
}
function checkVictory(currentState){
    let currentSign;
    if(currentState === states.Player1){
        currentSign = 'x';
    }
    else{
        currentSign = 'o';
    }
    for (let i = 0; i < victoryCombination.length; i++) {
        let [a,b,c] = victoryCombination[i];
        if(board[a[0]][a[1]] === currentSign && board[b[0]][b[1]] === currentSign && board[c[0]][c[1]] === currentSign) {
            win();
            return true;
        }
    }
}
function game(a, b){
    if(currentState === states.Player1){
        board[a][b] = "x";
    }
    else{
        board[a][b] = "o";
    }
    console.table(board);
    let check = checkVictory(currentState);
    switch (currentState) {
        case states.Player1:
            currentState = states.Player2;
            break;
        case states.Player2:
            currentState = states.Player1;
            break;
        default:
            break;
    }
    if(check){
        currentState = states.Player1;
    }
}

set(1,0)
set(0,0)
set(2,0)
set(1,1)
set(0,2)
set(2,2)
console.log("Второй раунд");
set(0,0)
set(1,0)
set(1,1)
set(2,0)
set(2,2)
console.log("Третий раунд");
set(0,0)
set(1,0)
set(1,1)
set(2,0)
set(2,2)

function test(){
    for (let i = 0; i < victoryCombination.length; i++) {
        let [a,b,c] = victoryCombination[i];
        console.log("comb: " + victoryCombination[i]);
        console.log('a: ' + a);
        console.log('b: ' + b);
        console.log('c: ' + c);
    }
}
