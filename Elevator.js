
class Building {
	floors = [];
	lift;
    constructor(floorsNumber, amountPersons) {
		this.amountPersons = amountPersons;
		this.floorsNumber = floorsNumber;
    }

    startProcess() {
        this.generate();
		let iterations = 0;
		let removed = [];
		console.log(`ЛЮДЕЙ ИЗНАЧАЛЬНО: ${this.amountPersons}`);
		while(this.amountPersons > 0){
			for(let fl of this.floors){
				console.log(`на ${fl.floorNumber} этаже: ${fl.persons.length}`);
			}
			for(let i = this.lift.currentFloor - 1; i < this.floors.length; i++){
				//console.log(this.lift.currentFloor);
				console.log("i до: " + i);
				i = this.checkEmptyFloors(this.floors[i], 1);
				// проще не обрабывать граничные значения
				// дело скорее всего в while
				console.log("i после: " + i);
				iterations++;
				removed = this.move(this.floors[i], removed);
			}
			console.log(`Осталось людей: ${this.amountPersons}`);
			console.log(`Люди, которые вышли из лифта: \n`);
			console.log(removed);
			console.log("ЕДЕМ ВНИЗ\n");
			removed = [];
			for(let fl of this.floors){
				console.log(`на ${fl.floorNumber} этаже: ${fl.persons.length}`);
			}
			for(let i = this.lift.currentFloor - 1; i >= 0; i--){
				console.log("i до: " + i);
				i = this.checkEmptyFloors(this.floors[i], -1);
				console.log("i после: " + i);
				iterations++;
				removed = this.move(this.floors[i], removed);
			}
			console.log(`Осталось людей: ${this.amountPersons}`);
			console.log(`Люди, которые вышли из лифта: \n`);
			console.log(removed);
			removed = [];
		}
		console.log(`Количество итераций цикла: ${iterations}`);
		for(let fl of this.floors){
			console.log(fl);
		}
		console.log(this.lift.personsInLift);
		console.log(this.lift);
    }

	move(floor, removed){
		let removedTemp = [];
		let fl = floor;
		// console.log('\n');
		// console.log(fl.persons);
		//this.lift.fillLift(fl.persons, fl.floorNumber);
		// console.log(`МЫ НА ${this.lift.currentFloor} ЭТАЖЕ`);
		// i = this.checkEmptyFloors(this.floors[i], -1);
		// fl = this.floors[i];
		removedTemp = removedTemp.concat(this.lift.exit(fl.floorNumber));
		removed = removed.concat(removedTemp);
		this.amountPersons -= removedTemp.length;
		this.lift.fillLift(fl.persons, fl.floorNumber);
		this.lift.personsInLift.forEach(person =>{console.log(`cur: ${person.currentFloor} des: ${person.desiredFloor}`)});
		console.log(`лифт на ${this.lift.currentFloor}`);
		console.log(removedTemp);
		console.log("\n");
		removedTemp = [];
		return removed;
	}

	checkEmptyFloors(currentFloor, direction){
		let check = true;
		if(currentFloor.floorNumber === 9 && direction === 1){
			return 8;
		}
		else if(currentFloor.floorNumber === 1 && direction === -1){
			return 0;
		}
		console.log("curflor " + currentFloor.floorNumber);
		let nextFloor = this.floors[(currentFloor.floorNumber - 1) + direction];
		console.log("nextCurFlor " + nextFloor.floorNumber);
		if(nextFloor.persons.length === 0 ){
			check = false;
		}
		this.lift.personsInLift.forEach(person => {
			if(nextFloor.floorNumber === person.desiredFloor){
				check = true;
			}
		});
		if(check){ 
			let flNum = currentFloor.floorNumber - 1
			console.log("вернуло " + flNum);
			return flNum; 		
		}
		else{ 
			console.log("рекурсия");
			// infity loop
			return this.checkEmptyFloors(this.floors[nextFloor.floorNumber - 1], direction) 
		}

	}
	
    generate(){
		let emptyFloor = getRandom(2,8,10);
		console.log('emptyFloor: ' + emptyFloor);
		let allPers = this.amountPersons;
		for (let i = 1; i <= this.floorsNumber; i++) {
			let personsOnFloor = getRandom(7,16);
			if(i === emptyFloor){
				personsOnFloor = 0;
			}
			if(i === this.floorsNumber){
				personsOnFloor = allPers;
			}
			allPers -= personsOnFloor;
			const floor = new Floor(i, personsOnFloor);
			this.floors.push(floor);
		}
		this.lift = new Elevator(6, 'up', [], 1);
		console.log(this.lift);
	}
	
}

// function checkEmptyFloor(floor){
// 	if(floor.floorNumber === 9){
// 		return true;
// 	}
// 	let nextFloor = floor.floorNumber + 1;
	
// }
class Elevator {
	personsInLift = [];
	constructor(capacity, direction, personsInLift, currentFloor) {
		this.capacity = capacity;
		this.direction = direction;
		this.personsInLift = personsInLift;
		this.currentFloor = currentFloor;
	}

	fillLift(persons, cFloor){
		let amountDesired = 0;
		let desiredPersons = [];
		if(this.personsInLift !== 0){
			amountDesired = this.capacity - this.personsInLift.length;
			desiredPersons = persons.splice(0, amountDesired);
		}
		else{
			amountDesired = this.capacity;
			desiredPersons = persons.splice(0, amountDesired);
		}
		// console.log(`необходимое количество в лифт ${amountDesired}`);
		// console.log(`необходимое люди:\n`);
		// console.log(desiredPersons);
		this.personsInLift = this.personsInLift.concat(desiredPersons);
		// console.log('в лифте: ');
		// console.log(this.personsInLift);
		this.currentFloor = cFloor;
	}

	exit(cFloor){
		this.currentFloor = cFloor;
		let remove = [];
		for (let i = this.personsInLift.length - 1; i >= 0; i--) {
			if(this.currentFloor === this.personsInLift[i].desiredFloor){
				remove = remove.concat(this.personsInLift.splice(i, 1));
			}
		}
		// console.log(`deleted amount ${remove.length},\n кто вышел: `);
		// console.log(remove);
		return remove;
	}

}

class Floor {
	floorNumber;
	personsOnFloor = [];
	persons = [];
    constructor(floorNumber, personsOnFloor) {
		this.floorNumber = floorNumber;
		this.personsOnFloor = personsOnFloor;
		for (let i = 1; i <= this.personsOnFloor; i++) {
			const randFloor = getRandom(1,9, floorNumber);
			const pers = new Person(floorNumber, randFloor);
			this.persons.push(pers);
		}
	}

}

class Person {
	currentFloor;
	desiredFloor;
	direction;
    constructor(currentFloor, desiredFloor) {
		this.currentFloor = currentFloor;
		this.desiredFloor = desiredFloor;
		if(this.currentFloor - this.desiredFloor > 0){this.direction = "down";}
		else{this.direction = "up";}
	}
}

function getRandom(min, max, ecxept) {
    min = Math.ceil(min);
    max = Math.floor(max);
	let randNum = Math.floor(Math.random() * (max - min + 1)) + min;
	while(randNum === ecxept){
		randNum = Math.floor(Math.random() * (max - min + 1)) + min;
	}
	return randNum;
}


const building = new Building(9, 100);
building.startProcess();
//console.log(building);
