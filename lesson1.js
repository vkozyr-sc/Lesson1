
// var speedKmph = 90;
// var speedMps = 20;

// speedKmph /= 3.6;

// if(speedKmph > speedMps){
//     alert("км/ч больше");
// }
// else{
//     alert("м/с больше");
// }


// var a = [" пика", " трефы",  " бубна", " червы"];
// var b = ["двойка", "тройка", "четверка", "пятерка", "шесть", "семь", "восемь", "девять", "десять", "валет", "дама", "король", "туз"];
// var m = 4;
// var k = 7;
// var cardName;
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

// var n = 6;
// var star = "\n";

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

var a, b, c = 0;
a = 4;
b = -16;
c = 10;
var D = b**2 - 4*a*c; // 256 - (4*10*4) 160 == 96
var x1, x2, x = 0;
if(D > 0){
    x1 = (-b - Math.sqrt(D))/(2*a);
    x2 = (-b + Math.sqrt(D))/(2*a);
    alert(x1);
    alert(x2);
}
else{
    x = (-b)/(2*a);
    alert(x);
}

// console.log(star);
// alert(star);