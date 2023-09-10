'use strict';

import { Employee } from './Employee.js';
import { InterviewPrompt } from './InterviewPrompt.js';
import { CreateButton } from './utils/HTMLUtils.js';
import { CommonLocalStorage } from './utils/CommonLocalStorage.js';

function HireClient(clientName, currentEmployees) {
    CommonLocalStorage.SetIsEmployee(true);

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
    const currentEmployees = await Employee.LoadEmployees();
    const prompts = await InterviewPrompt.LoadPrompts();
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

    if (!CommonLocalStorage.GetIsEmployee())
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
    CommonLocalStorage.Clear();
    applyForJobButton.disabled = false;
    Employee.ClearEmployeeDisplays();
    InterviewPrompt.ClearActiveQuestionPrompts();
});