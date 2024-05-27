let board = [
    ['?', '?', '?'],
    ['?', '?', '?'],
    ['?', '?', '?'],
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
    if(put(a,b,"x")){
        let check = checkVictory(currentState);
        if(check){
            currentState = states.Player1;
            return;
        }        
        currentState = changeState(currentState);
        bot();
        console.table(board);
        check = checkVictory(currentState);
        currentState = changeState(currentState);
        if(check){
            currentState = states.Player1;
        }
    }
}

function changeState(currentState){
    switch (currentState) {
        case states.Player1:
            currentState = states.Player2;
            return currentState;
        case states.Player2:
            currentState = states.Player1;
            return currentState;
        default:
            break;
    }
}

function put(a,b, sign){
    if((a < 0 || a >= 3) || (b < 0 || b >= 3)){
        console.log("Вы ввели слишком большое число");
        return false;
    }
    else if(board[a][b] !== '?'){
        console.log("Эта клетка уже занята");
        return false;
    }
    else{
        board[a][b] = sign;
        return true;
    }

}

function result(res){
    if(res === "win"){
        console.log(currentState + ' win');
    }
    else{
        console.log('НИЧЬЯ!');
    }
    board = [
        ['?', '?', '?'],
        ['?', '?', '?'],
        ['?', '?', '?'],
    ];
    console.log(board);
    currentState = states.Player1;
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
            result("win");
            return true;
        }
    }
    let count = 0
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if(board[i][j] !== '?'){
                count++;
            }
        }
    }
    if(count === 9){
        result("draw");
        return true;
    }
}

function victory(sign, check){
    let count = 0;
    for (let i = 0; i < victoryCombination.length; i++) {
        let [a,b,c] = victoryCombination[i];
        let pos = [];
        if(board[a[0]][a[1]] === sign){
            count++;
        }
        else{ pos = a; }
        if(board[b[0]][b[1]] === sign){
            count++;
        }
        else{ pos = b; }
        if(board[c[0]][c[1]] === sign){
            count++;
        }
        else{ pos = c; }

        if(count === 2){
            //console.log(pos);
            if(put(pos[0], pos[1], "o")){
                if(sign === "x"){
                    console.log("Не дало победить");
                }
                if(sign === "o"){
                    console.log("Победило");
                }
                count = 0;
                if(sign === "o"){ return 1;}
                if(sign === "x"){ return 2;}    
            }
        }
        if(count === 1 && check === "!center" && i >= 6){
            if(put(pos[0], pos[1], "o")){
                console.log("тыкнуло куда-нибудь");
                count = 0;
                if(sign === "o" && check === "!center"){ return 3;}    
                if(sign === "x" && check === "!center"){ return 3;}    
            }
        }
        if(count === 1 && check === "center" && (i === 1 || i === 4)){
            if(put(pos[0], pos[1], "o")){
                console.log("тыкнуло ферзевый гамбит");
                count = 0;
                if(sign === "o" && check === "center"){ return 3;}    
                if(sign === "x" && check === "center"){ return 3;}    
            }
        }

        count = 0;
    }
    return 0;
}

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setRand(){
    let corner = [[0,0], [0,2], [2,0], [2,2]];
    for (let i = 0; i < corner.length; i++) {
        if(board[corner[i][0]][corner[i][1]] !== '?'){
           corner.splice(i, 1); 
        }        
    }

    while(true){
        let randNum = getRandom(0, corner.length - 1);
        let cell = corner[randNum];
        console.log(randNum);  
        if(board[cell[0]][cell[1]] === '?'){
            put(cell[0], cell[1], "o");
            console.log("поставило ранд");
            break;  
        }
    }
}

// function bot(){
//     let center;
//     let firstMove = true;
//     return function botOptions(){
//         if(board[1][1] === '?' && firstMove){
//             put(1,1,"o");
//             center = true;
//             firstMove = false;
//             //return;
//         }
//         else if(firstMove){
//             setRand();
//             center = false;
//             firstMove = false;
//         }    
//         if(!center && !firstMove){
//             let check = 0;
//             if(check === 0){
//                 console.log("Ставит третий знак");
//                 check = victory("o");
//             }
//             if(check === 0){
//                 console.log("Не дает победить противнику");
//                 check = victory("x");
//             }
//             if(check === 0){ 
//                 console.log("Куда-нибудь от 'o'");
//                 check = victory("o", "!center");
//             }
//             if(check === 0){ 
//                 console.log("Куда-нибудь от 'x'");
//                 setRand();
//                 // console.log("check: " + check);
//             }        
//         }
//         else if(center && !firstMove){
//             let check = 0;
//             if(check === 0){
//                 console.log("Ставит третий знак");
//                 check = victory("o");
//             }
//             if(check === 0){
//                 console.log("Не дает победить противнику");
//                 check = victory("x");
//             }
//             if(check === 0){
//                 console.log("ферзевый гамбит");
//                 check = victory("center");
//             }
//         }
//     }

// }

function bot(){
    let check = 0;
    let center;
    if(board[1][1] === '?'){
        put(1,1,"o");
        return;
    }
    if(board[1][1] === 'o'){ center = true; }
    else{ center = false; }
    // else if(board[0][0] === '?'){
    //     put(0,0,"o");
    //     check = 1;
    // }
    // console.log("check: " + check);
    if(check === 0){
        console.log("Ставит третий знак");
        check = victory("o");
    }
    if(check === 0){
        console.log("Не дает победить противнику");
        check = victory("x");
    }
    if(check === 0 && center){
        console.log("ферзевый гамбит");
        check = victory("o","center");
    }
    if(check === 0){ 
        console.log("Куда-нибудь от 'o'");
        check = victory("o", "z");
    }
    if(check === 0){ 
        console.log("Куда-нибудь от 'x'");
        setRand();
        // console.log("check: " + check);
    }

}


function print(){
    console.table(board);
}

//set(1,1)

function test(){
    for (let i = 0; i < victoryCombination.length; i++) {
        let [a,b,c] = victoryCombination[i];
        console.log("comb: " + victoryCombination[i]);
        console.log('a: ' + a);
        console.log('b: ' + b);
        console.log('c: ' + c);
    }
}
