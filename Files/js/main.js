'use strict';

import { Employee } from './Employee.js';
import { InterviewPrompt } from './InterviewPrompt.js';

async function LoadPrompts() {
    const response = await fetch("./json/prompts.json");
    if (!response.ok) {
        console.error("Failed to load prompts");
        return null;
    }
    
    const data = await response.json();

    const prompts = new Array();
    for (let index = 0; index < data.prompts.length; index++) {
        const element = data.prompts[index];
        prompts.push(new InterviewPrompt(element.prompt, element.promptId));
    }

    return prompts;
}

async function LoadEmployees() {
    const response = await fetch("./json/employees.json");
    if (!response.ok) {
        console.error("Failed to load employees");
        return null;
    }

    const data = await response.json();

    const employees = new Array();
    for (let index = 0; index < data.employees.length; index++) {
        const element = data.employees[index];
        employees.push(new Employee(element.name, element.currentJob));
    }

    return employees;
}

function CheckForNameSimilarities(currentEmployees, prompts) {
    for (const employee of currentEmployees) {
        for (const promptItem of prompts) {
            if (employee.name === promptItem.response) {
                return true;
            }
        }
    }

    return false;
}

function GenerateFinalMessage(prompts) {
    const endLine = "\n";
    let information = "Information:" + endLine;

    prompts.forEach(prompt => {
        information += prompt.GetInformationText();
        information += endLine;
    });

    information += endLine;
    information += "Thank you!";
    alert(information);
}

function GreetClient() {
    const userKey = "user";

    const user = localStorage.getItem(userKey);

    if (user != null) {
        alert("welcome back " + user + "!");
    }
    else {
        const name = prompt("Please input your nickname.");
        localStorage.setItem(userKey, name);
        alert("welcome " + name + "!");
    }
}

function IsEmployee() {
    const acceptedJobKey = "acceptedJob";
    const isEmployee = localStorage.getItem(acceptedJobKey);
    return isEmployee;
}

function HireClient(clientName, currentEmployees) {
    const acceptedJobKey = "acceptedJob";
    localStorage.setItem(acceptedJobKey, true);

    let info = "Great! You are now part of the team! \n";

    currentEmployees.unshift(new Employee(clientName, "Junior IT Employee"));
    currentEmployees.forEach(employee => {
        info += employee.GetJobInformation();
    });

    return info;
}

async function HandleMainFlow(){
    const currentEmployees = await LoadEmployees();
    const prompts = await LoadPrompts();
    const namePrompt = prompts[0];
    
    prompts.forEach(element => {
        element.SetResponse(prompt(element.prompt));
    })

    if (CheckForNameSimilarities(currentEmployees, prompts)) {
        alert("What a coincidence, we got someone working with your name already!");
    }
    
    GenerateFinalMessage(prompts);
    
    if (true) ///does client want to apply
    {
        const info = HireClient(namePrompt.response, currentEmployees);
        alert(info);
    }
    else
    {
        alert("What a shame. Feel free to contact us if you change your mind!");
    }
}

GreetClient();

const applyForJobButton = document.getElementById("job-apply-button");

applyForJobButton.addEventListener("click", (eventData) => {
    if (IsEmployee())
    {
        alert("You are already an employee.");
    }
    else
    {
        HandleMainFlow();
    }
});

const clearCacheButton = document.getElementById("clear-cache-button");

clearCacheButton.addEventListener("click", (eventData) => {
    localStorage.clear();
});