'use strict';

import { Employee } from './Employee.js';
import { InterviewPrompt } from './InterviewPrompt.js';
import { LoadJson } from './utils/JsonUtils.js';
import { CreateButton } from './utils/HTMLUtils.js';

const endLine = "\n";

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
    let information = "Information:" + endLine;

    prompts.forEach(prompt => {
        information += prompt.GetInformationText() + endLine;
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

    currentEmployees.unshift(new Employee(clientName, "Junior IT Employee"));
    currentEmployees.forEach(employee => {
        employee.CreateHTMLEmployeeDisplay();
    });

    alert("Great! You are now part of the team!");
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
    InterviewPrompt.ClearActiveQuestionPrompts();
    const getJobButton = document.getElementById("get-job-button");
    getJobButton.remove();
}

const applyForJobButton = document.getElementById("job-apply-button");
applyForJobButton.addEventListener("click", (eventData) => {
    applyForJobButton.disabled = true;

    if (!IsEmployee())
    {
        ApplyForJob();
    }
    else
    {
        alert("You are already an employee.");
    }
});

const clearCacheButton = document.getElementById("clear-cache-button");

clearCacheButton.addEventListener("click", (eventData) => {
    localStorage.clear();
    applyForJobButton.disabled = false;
    Employee.ClearEmployeeDisplays();
    InterviewPrompt.ClearActiveQuestionPrompts();
});