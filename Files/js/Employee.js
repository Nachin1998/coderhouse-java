export class Employee{
    constructor(name, currentJob) {
        this.name = name;
        this.currentJob =  currentJob;
    }

    GetJobInformation(){
        return this.name + ": " + this.currentJob + "\n";
    }
}