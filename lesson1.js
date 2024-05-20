
// let speedKmph = 90;
// let speedMps = 20;

// speedKmph /= 3.6;

// if(speedKmph > speedMps){
//     alert("км/ч больше");
// }
// else{
//     alert("м/с больше");
// }


// let a = [" пика", " трефы",  " бубна", " червы"];
// let b = ["двойка", "тройка", "четверка", "пятерка", "шесть", "семь", "восемь", "девять", "десять", "валет", "дама", "король", "туз"];
// let m = 4;
// let k = 7;
// let cardName;
// switch (k) {
//     case 2:
//         cardName = b[0];
//         break;
//     case 3:
//         cardName = b[1];
//         break;
//     case 4:
//         cardName = b[2];
//         break;
//     case 5:
//         cardName = b[3];
//         break;
//     case 6:
//         cardName = b[4];
//         break;
//     case 7:
//         cardName = b[5];
//         break;
//     case 8:
//         cardName = b[6];
//         break;
//     case 9:
//         cardName = b[7];
//         break;
//     case 10:
//         cardName = b[8];
//         break;
//     case 11:
//         cardName = b[9];
//         break;
//     case 12:
//         cardName = b[10];
//         break;
//     case 13:
//         cardName = b[11];
//         break;
//     case 14:
//         cardName = b[12];
//         break;

//     default:
//         break;
// }
// switch (m) {
//     case 1:
//         cardName += a[0];
//         break;
//     case 2:
//         cardName += a[1];
//         break;
//     case 3:
//         cardName += a[2];
//         break;
//     case 4:
//         cardName += a[3];
//         break;

//     default:
//         break;
// }

// //alert(cardName);

// let n = 6;
// let star = "\n";

// for (let i = 0; i < n; i++) {
//     for (let j = 0; j < n; j++) {
//         if(i % 2 === 0){
//             star += "* ";
//         }
//         else{
//             if(j === n - 1)
//                 break;
//             star += " *";
//         }
//     }
//     star += "\n";
// }


let a, b, c = 0;
// a^2x + bx + c = 0 
a = 4;
b = -16;
c = 10;
let D = b**2 - 4*a*c; // 256 - (4*10*4) 160 == 96
let x1, x2, x = 0;
if(D > 0){
    x1 = (-b - Math.sqrt(D))/(2*a);
    x2 = (-b + Math.sqrt(D))/(2*a);
    //alert(x1);
    //alert(x2);
}
else{
    x = (-b)/(2*a);
   // alert(x);
}

// монеты в центы и рубли
let coins = 100;
if(coins < 100){
    alert("0 р. " + coins + " к.");
}
else{
    let rubles, cents;
    cents = coins % 100;
    rubles = (coins - cents)/100;
    let string = rubles + " р. " + cents + " к.";
    alert(string);
}

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
alert(arr);
console.log(arr);
// console.log(star);
// alert(star);