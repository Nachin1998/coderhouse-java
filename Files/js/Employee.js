export class Employee{
    constructor(name, currentJob) {
        this.name = name;
        this.currentJob =  currentJob;
    }

    CreateHTMLEmployeeDisplay() {
        const containerDiv = document.createElement("div");
        containerDiv.className = "employee-display";
    
        const nameP = document.createElement("p");
        nameP.textContent = this.name;

        const currentJobP = document.createElement("p");
        currentJobP.textContent = this.currentJob;

        containerDiv.appendChild(nameP);
        containerDiv.appendChild(currentJobP);
    
        document.body.appendChild(containerDiv);
    }

    static ClearEmployeeDisplays(){
        const elements = document.getElementsByClassName("employee-display");
        const copyOfElements = Array.from(elements);
        for (let index = 0; index < copyOfElements.length; index++) {
            const element = copyOfElements[index];
            element.remove();
        }
    }
}