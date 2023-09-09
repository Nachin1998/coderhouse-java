'use strict';

import {
    Employee
} from './Employee.js';

import {
    InterviewPrompt
} from './InterviewPrompt.js';

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

function CheckForNameSimilarities(currentEmployees, prompts){
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

function IsEmployee(){
    const acceptedJobKey = "acceptedJob";
    const isEmployee = localStorage.getItem(acceptedJobKey);

    return isEmployee;
}

function DoesClientWantToApply(){
    return confirm("Would you like to apply for the position?");
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
    
    if (DoesClientWantToApply())
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

if (IsEmployee())
{
    alert("Glad you are enjoying you time at the job!");
}
else
{
    HandleMainFlow();
}

const text = document.getElementsByClassName("header-text");

for (let i = 0; i < text.length; i++) {
    const element = text[i];
    element.addEventListener("click", (eventData) => {
        alert("You have been cursed by the 'i dont know what button to use this event on' curse. All your data has been erased.");
        localStorage.clear();
    });

    element.addEventListener("mouseover", (eventData) => {
        console.log(element.text + " down");
    });

    element.addEventListener("mouseout", (eventData) => {
        console.log(element.text + " out");
    });
}
