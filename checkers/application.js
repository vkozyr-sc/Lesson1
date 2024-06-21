class Deck{

}

class Game{

}

class Rules{

}

class Checker{
	
}

const fieldsHandler = (event) => {
  let target = event.target;
  target.innerHTML = "X";
};

// TODO:
// логика и взаимодействие классов
// какое будет поле(через дом элементы или массив)
// если массив подумать про синхронизацию
// шашка(дамка/простая) как это реализовать в классах
// раскидать функцию по методам класса(в основном в Game в generate())

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const fields = document.getElementById("fields");
    for (let i = 0; i < 8; i++) {
      const row = document.createElement("div");
      row.id = `row_${i}`;
      row.className = "row";
      fields.append(row);
			
      for (let j = 0; j < 8; j++) {
        const field = document.createElement("div");
				const checker = document.createElement("div");
        field.id = `field_${i}_${j}`;
        field.className = `field`;
        field.innerHTML = "";
        row.append(field);

				if(i % 2 === 0){
					if(j % 2 !== 0){ 
						field.style.backgroundColor = 'gray';
						if(i !== 4){
							checker.id = `checker_${i}_${j}`;
							checker.className = 'checker';
							if(i < 3) checker.style.backgroundColor = 'black';
							else checker.style.backgroundColor = 'white';
							field.append(checker);	
						}
					}
				}
				else if (i % 2 !== 0){
					if(j % 2 === 0) {
						field.style.backgroundColor = 'gray';
						if(i !== 3){
							checker.id = `checker_${i}_${j}`;
							checker.className = 'checker';
							if(i < 3) checker.style.backgroundColor = 'black';
							else checker.style.backgroundColor = 'white';
							field.append(checker);	
						}
					};
				}
        // field.addEventListener("click", () => {
        //   handleClickField(i, j);
        // });
        //field.removeEventListener;
      }
    }
    fields.addEventListener("click", fieldsHandler);
		let deck = [[]];
		for (let i = 0; i < 8; i++) {
			let row = [];
			for (let j = 0; j < 8; j++) {
				row.push("");
			}
			deck.push(row)
		}
		console.log(deck);
  });
})();
