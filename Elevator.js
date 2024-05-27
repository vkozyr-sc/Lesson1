class Building {
	floors = [];
	lift;
    constructor(floorsNumber, amountPersons) {
		this.amountPersons = amountPersons;
		this.floorsNumber = floorsNumber;
    }

    startProcess() {
        this.generate();
		for(let fl of this.floors){
			console.log(fl);
		}
		
    }
    generate(){
		let emptyFloor = getRandom(2,8,10);
		console.log(emptyFloor);
		let summ = 0;
		for (let i = 1; i <= this.floorsNumber; i++) {
			// if(i === emptyFloor - 1){
			// 	const floor = new Floor(emptyFloor, 0);
			// 	this.floors.push(floor);
			// }
			// else{
			// 	let j = i + 1;
			// 	let personsOnFloor;
			// 	personsOnFloor = getRandom(0,20,101);
			// 	if(i === this.floorsNumber - 1){
			// 		personsOnFloor = this.amountPersons; 
			// 	}
			// 	this.amountPersons -= personsOnFloor;
			// 	if(this.amountPersons <= 0){
			// 		this.amountPersons = 0;
			// 		personsOnFloor = 0;
			// 	}
			// 	console.log("amountPerson: " + this.amountPersons);
			// 	console.log("pesonOnFloor: " + personsOnFloor);
			// 	const floor = new Floor(j, personsOnFloor);		
			// 	this.floors.push(floor);	
			// }
			let personsOnFloor = getRandom(0,20);
			if(i === emptyFloor){
				personsOnFloor = 0;
			}
			if(i === this.floorsNumber){
				personsOnFloor = this.amountPersons;
			}
			this.amountPersons -= personsOnFloor;
			summ += personsOnFloor;
			console.log("amountPerson: " + this.amountPersons);
			console.log("pesonOnFloor: " + personsOnFloor);
			const floor = new Floor(i, personsOnFloor);
			this.floors.push(floor);
		}
		console.log("personOn: " + summ);
		this.lift = new Elevator(6, 'up', 0, 1);
		console.log(this.lift);
	}
}

class Elevator {
	constructor(capacity, direction, personsInLift, currentFloor) {
		this.capacity = capacity;
		this.direction = direction;
		this.personsInLift = personsInLift;
		this.currentFloor = currentFloor;
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
    constructor(currentFloor, desiredFloor) {
		this.currentFloor = currentFloor;
		this.desiredFloor = desiredFloor;
	}
}

function getRandom(min, max, ecxept) {
    min = Math.ceil(min);
    max = Math.floor(max);
	let randNum = Math.floor(Math.random() * (max - min + 1)) + min;
	while(randNum === ecxept){
		randNum = Math.floor(Math.random() * (max - min + 1)) + min;
		return randNum;
	}
	return randNum;
}


const building = new Building(9, 100);
building.startProcess();
console.log(building);