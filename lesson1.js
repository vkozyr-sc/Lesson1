
let suits = [" пика", " трефы",  " бубна", " червы"];
let ranks = ["двойка", "тройка", "четверка", "пятерка", "шесть", "семь", "восемь", "девять", "десять", "валет", "дама", "король", "туз"];
let m = 4;
let k = 7;
let cardName;
switch (k) {
      case 2:
        cardName = b[0];
        break;
      case 3:
        cardName = b[1];
        break;
      case 4:
        cardName = b[2];
        break;
      case 5:
        cardName = b[3];
        break;
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

console.log(cardName);
//звездочка в консоли
let n = 6;
let star = "\n";
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

let a, b, c = 0;
// a^2x + bx + c = 0 
a = 4;
b = -16;
c = 10;
let D = b**2 - 4*a*c; 
let x1, x2, x = 0;
if(D > 0){
    x1 = (-b - Math.sqrt(D))/(2*a);
    x2 = (-b + Math.sqrt(D))/(2*a);
    console.log("x1: " + x1);
    console.log("x2: " + x2);
}
else{
    x = (-b)/(2*a);
    console.log("x: " + x);
}

// монеты в копейки и рубли
let string;
let coins = 1001;
let rubles, cents;
cents = coins % 100;
rubles = (coins - cents) / 100;
let rublesRus = rubles % 10;
let centsRus = cents % 10;
console.log(rublesRus, centsRus);
switch (rublesRus) {
    case 0:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    string = rubles + " рублей ";
    break;
    case 1:
    string = rubles + " рубль ";
    break;
    case 2:
    case 3:
    case 4:
    string = rubles + " рубля ";
    break;
}
switch (centsRus) {
    case 0:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    string += cents + " копеек";
    break;
    case 1:
    string += cents + " копейка";
    break;
    case 2:
    case 3:
    case 4:
    string += cents + " копейки";
    break;
}
console.log(string);

//шейкерная сорт
let arr = [6,1,3,2,2,9,12];

let left = 0;
let right = arr.length - 1;

while(left <= right){
    for (let i = right; i > left; i--) {
        if(arr[i - 1] > arr[i]){
            let temp = arr[i - 1];
            arr[i - 1] = arr[i];
            arr[i] = temp 
        }
    }
    left++;
    for (let i = left; i < right; i++) {
        if(arr[i] > arr[i + 1]){
            let temp = arr[i];
            arr[i] = arr[i + 1];
            arr[i + 1] = temp 
        }
    }
    right--;
}
console.log(arr);
