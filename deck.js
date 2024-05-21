function setAmount(amount) {
    return amount;
}

let amount = setAmount();
amount = 5;
function giveCard() {
    let deck = [];
    let ranks = ["пика", "черви", "бубна", "крести"];
    let suits = ["6", "7", "8", "9", "10", "J", "Q", "K", "A"];

    for (let rank of ranks) {
        for (let suit of suits) {
            let card = suit + " " + rank;
            deck.push(card);
        }
    }
    console.log(deck);
    return function (amount) {
        // for(let i = 0; i < amount; i++){
        //         cardsInHands.push(deck[i]);
        // }
        let cardsInHands = deck.splice(0, amount);
        console.log(deck);
        return cardsInHands;
    };
}

let cards = giveCard();
let cards2 = giveCard();
function giveCards(amount) {
    console.log(cards(amount));
    console.log(cards(amount));
}

function giveCards2(amount) {
    console.log(cards2(amount));
    console.log(cards2(amount));
}

function setCounter() {
    let count = 0;
    console.log("внутри ф-ии " + count);
    return function () {
        console.log("внутри return: " + count);
        ++count;
        return count;
    };
}
const counter1 = setCounter();
const counter2 = setCounter();

console.log(counter1());
console.log(counter1());
console.log(counter1());

console.log(counter2());
console.log(counter2());


function fibCounter(){
        let count = 0;
        return function fibo(n) {
            ++count;
                if(n <= 2){
                    console.log("кол-во итераций " + count);
                    return 1;
                }
                else{
                    return fibo(n - 1) + fibo(n - 2);
                }
        };
}

const fibb = fibCounter();
console.log(fibb(8));

function Summ() {
    let num = 0;
    function arr(...args) {
        if (args[0] != undefined) {
            num += args[0];
            return arr;
        } else return num;
    }
    return arr;
}

const res = Summ()(2)(3)(4)();
