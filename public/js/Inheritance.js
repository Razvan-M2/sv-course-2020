class Person {

    constructor(name = 'John Doe', age = 28, height = 1.80) {
        this.name = name;
        this.age = age;
        this.height = height;
    }

    info() {
        console.log(`Name: ${this.name}`);
        console.log(`Age: ${this.age}`);
        console.log(`Height: ${this.height}`);
    }

    greet() {
        console.log(`Hi! My name is ${this.name}`);
    }

}

class Employee extends Person {

    constructor(name, age, height, company, job, working, hoursWorked, complaint, workPlaceOpinion) {
        super(name, age, height);
        this.company = company;
        this.job = job;
        this.working = working;
        this.hoursWorked = hoursWorked;
        this.complaint = complaint;
        this.workPlaceOpinion = workPlaceOpinion;
    }

    info() {
        console.log(`\nName: ${this.name}`);
        console.log(`Age: ${this.age}`);
        console.log(`Height: ${this.height}`);
        console.log(`I work at ${this.company} as a ${this.job}`);
    }

    greet() {
        console.log(`\nHi! My name is ${this.name} and i'm an employee at ${this.company}`);
    }

    isWorking() {
        console.log((this.working) ? `\nI'm kinda busy right now` : `\nNot really. I'm watching some TV.`);
    }

    haveDoneWork() {
        console.log((this.working) ? `\nToday i worked ${this.hoursWorked}` : `\nI had no work today.`);
    }

    complain() {
        console.log(`\n${this.name} says '${this.complaint}'`);
    }

    howIsWorking() {
        console.log(`\n${this.name} says '${this.workPlaceOpinion}'`);
    }

}