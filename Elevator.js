class Building {
	floors = [];
	lift;
    constructor(floorsNumber, amountPersons) {
		this.amountPersons = amountPersons;
		this.floorsNumber = floorsNumber;
    }

    startProcess() {
        this.generate();
		// for(let fl of this.floors){
		// 	console.table(fl.persons);
		// }
		while(this.amountPersons > 0){
			for(let i = 0; i < this.floors.length; i++){
				let fl = this.floors[i];
				console.log('\n');
				console.log(fl.persons);
				this.lift.fillLift(fl.persons, fl.floorNumber);
				console.log(`МЫ НА ${this.lift.currentFloor} ЭТАЖЕ`);
				this.amountPersons -= this.lift.move();
				this.lift.fillLift(fl.persons, fl.floorNumber);
				console.table(this.lift.personsInLift);
			}
			console.log("ЕДЕМ ВНИЗ");
			for(let i = this.floors.length - 1; i >= 0; i--){
				let fl = this.floors[i];
				console.log('\n');
				console.log(fl.persons);
				this.lift.fillLift(fl.persons, fl.floorNumber);
				console.log(`МЫ НА ${this.lift.currentFloor} ЭТАЖЕ`);
				this.amountPersons -= this.lift.move();
				this.lift.fillLift(fl.persons, fl.floorNumber);
				console.table(this.lift.personsInLift);
			}
			console.log('allPers: ' + this.amountPersons);
		}

		console.log('-----------');
		for(let fl of this.floors){
			console.log(fl);
		}
		console.log(this.lift.personsInLift);
		console.log(this.lift);
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
		console.log(`необходимое количество в лифт ${amountDesired}`);
		console.log(`необходимое люди:\n`);
		console.log(desiredPersons);
		this.personsInLift = this.personsInLift.concat(desiredPersons);
		console.log('в лифте: ');
		console.log(this.personsInLift);
		this.currentFloor = cFloor;
	}

	move(){
		let remove = [];
		for (let i = this.personsInLift.length - 1; i >= 0; i--) {
			if(this.currentFloor === this.personsInLift[i].desiredFloor){
				remove = remove.concat(this.personsInLift.splice(i, 1));
			}
		}
		console.log(`deleted amount ${remove.length},\n кто вышел: `);
		console.log(remove);
		return remove.length;
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