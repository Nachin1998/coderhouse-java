'use strict';

import { Employee } from './Employee.js';
import { InterviewPrompt } from './InterviewPrompt.js';
import { CreateButton } from './utils/HTMLUtils.js';
import { CommonLocalStorage } from './utils/CommonLocalStorage.js';

function HireClient(clientName, currentEmployees) {
    CommonLocalStorage.SetIsEmployee(true);

    const label = document.createElement("label");
    label.textContent = "FireStudios gang:";
    document.body.appendChild(label);
    currentEmployees.unshift(new Employee(clientName, "Junior IT Employee"));
    currentEmployees.forEach(employee => {
        employee.CreateHTMLEmployeeDisplay();
    });    
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
        Swal.fire({
            title: "Do you want to get the job?",
            showDenyButton: true,
            confirmButtonText: "Yes!",
            denyButtonText: "Had second thoughts...",
          }).then((result) => {
            if (result.isConfirmed) {
                ClearInterviewRelatedElements();
                HireClient(name, currentEmployees);
              Swal.fire("Great!", "You are now part of the team!", "success")
            } else if (result.isDenied) {
              Swal.fire("No problem, you'll come around!", "", "info")
            }
          })
        
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
        Swal.fire({
            title: "You are already an employee.",
            icon: "warning",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Okay"
          });
    }
});

const clearCacheButton = document.getElementById("clear-cache-button");
clearCacheButton.addEventListener("click", (eventData) => {
    CommonLocalStorage.Clear();
    applyForJobButton.disabled = false;
    Employee.ClearEmployeeDisplays();
    InterviewPrompt.ClearActiveQuestionPrompts();
});