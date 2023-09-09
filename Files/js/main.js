'use strict';

import { Employee } from './Employee.js';
import { InterviewPrompt } from './InterviewPrompt.js';
import { LoadJson } from './utils/JsonUtils.js';
import { CreateButton } from './utils/HTMLUtils.js';

async function LoadPrompts() {
    const data = await LoadJson("./json/prompts.json");

    const prompts = new Array();
    for (let index = 0; index < data.prompts.length; index++) {
        const element = data.prompts[index];
        prompts.push(new InterviewPrompt(element.prompt, element.promptId));
    }

    return prompts;
}

async function LoadEmployees() {
    const data = await LoadJson("./json/employees.json");

    const employees = new Array();
    for (let index = 0; index < data.employees.length; index++) {
        const element = data.employees[index];
        employees.push(new Employee(element.name, element.currentJob));
    }

    return employees;
}

function GenerateFinalMessage(prompts) {
    const endLine = "\n";
    let information = "Information:" + endLine;

    prompts.forEach(prompt => {
        information += prompt.GetInformationText();
        information += endLine;
    });

    information += endLine;
    return information
}

function IsEmployee() {
    const isEmployeeKey = "isEmployee";
    const isEmployee = localStorage.getItem(isEmployeeKey);
    return isEmployee;
}

function HireClient(clientName, currentEmployees) {
    const isEmployeeKey = "isEmployee";
    localStorage.setItem(isEmployeeKey, true);

    let info = "Great! You are now part of the team! \n";

    currentEmployees.unshift(new Employee(clientName, "Junior IT Employee"));
    currentEmployees.forEach(employee => {
        info += employee.GetJobInformation();
    });

    return info;
}

function HandleQuestions(prompts, startingIndex, onfinalQuestionAsked) {

    let index = startingIndex;
    const prompt = prompts[index];

    prompt.CreateHTMLQuestionPrompt((value) => {
        prompt.SetResponse(value);
        prompt.ToggleButtonInteraction(false);

        index++;
        if (index < prompts.length) {
            HandleQuestions(prompts, index, onfinalQuestionAsked);
        }
        if (index === prompts.length) {
            onfinalQuestionAsked();
        }
    });
}

async function ApplyForJob() {
    const currentEmployees = await LoadEmployees();
    const prompts = await LoadPrompts();
    const namePrompt = prompts[0];
    
    HandleQuestions(prompts, 0, () => TriggerGetJobButton(namePrompt.response, currentEmployees));
}

function TriggerGetJobButton(name, currentEmployees){
    const button = CreateButton("Get job!", () => {
        ClearInterviewRelatedElements();
        HireClient(name, currentEmployees);
    }, true);
    button.id = "get-job-button";
}

function ClearInterviewRelatedElements(){
    const elements = document.getElementsByClassName("question");
    const copyOfElements = Array.from(elements);
    for (let index = 0; index < copyOfElements.length; index++) {
        const element = copyOfElements[index];
        element.remove();
    }

    const getJobButton = document.getElementById("get-job-button");
    getJobButton.remove();
}

const applyForJobButton = document.getElementById("job-apply-button");
applyForJobButton.addEventListener("click", (eventData) => {
    applyForJobButton.disabled = true;

    if (IsEmployee())
    {
        alert("You are already an employee.");
    }
    else
    {
        ApplyForJob();
    }
});

const clearCacheButton = document.getElementById("clear-cache-button");

clearCacheButton.addEventListener("click", (eventData) => {
    localStorage.clear();
});