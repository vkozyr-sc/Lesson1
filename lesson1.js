
var speedKmph = 90;
var speedMps = 20;

speedKmph /= 3.6;

if(speedKmph > speedMps){
    alert("км/ч больше");
}
else{
    alert("м/с больше");
}


var a = [" пика", " трефы",  " бубна", " червы"];
var b = ["двойка", "тройка", "четверка", "пятерка", "шесть", "семь", "восемь", "девять", "десять", "валет", "дама", "король", "туз"];
var m = 4;
var k = 7;
var cardName;
switch (k) {
    case 6:
        cardName = b[4];
        break;
    case 7:
        cardName = b[5];
        break;
    case 8:
        cardName = b[6];
        break;
    case 9:
        cardName = b[7];
        break;
    case 10:
        cardName = b[8];
        break;
    case 11:
        cardName = b[9];
        break;
    case 12:
        cardName = b[10];
        break;
    case 13:
        cardName = b[11];
        break;
    case 14:
        cardName = b[12];
        break;

    default:
        break;
}
switch (m) {
    case 1:
        cardName += a[0];
        break;
    case 2:
        cardName += a[1];
        break;
    case 3:
        cardName += a[2];
        break;
    case 4:
        cardName += a[3];
        break;

    default:
        break;
}

//alert(cardName);

var n = 6;
var star = "\n";

for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        if(i % 2 === 0){
            star += "* ";
        }
        else{
            if(j === n - 1)
                break;
            star += " *";
        }
    }
    star += "\n";
}

console.log(star);
alert(star);