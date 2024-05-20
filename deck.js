function setAmount(amount){
    return amount;
}

let amount = setAmount();
amount = 5;
function giveCard(amount){
    let deck = [];
    let ranks = ['пика', 'черви', 'бубна', 'крести'];
    let suits = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    for (let rank of ranks) {
        for(let suit of suits){
            let card = suit + " " + rank;
            deck.push(card);
        }
    }
    console.log(deck);
    return function(amount){
        let cardsInHands = [];
        for(let i = 0; i < amount; i++){
            cardsInHands.push(deck[i]);
        }
        deck.splice(0, amount);
        console.log(deck);
        return cardsInHands;
    }
}

let cards = giveCard();
function giveCards(amount){
    console.log(cards(amount));
}