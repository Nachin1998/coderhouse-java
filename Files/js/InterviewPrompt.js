import { CreateButton } from './utils/HTMLUtils.js';

export class InterviewPrompt{
    constructor(prompt, promptId) {
        this.prompt = prompt;
        this.promptId = promptId;
        this.response;
        this.button;
    }

    SetResponse(response) {
        this.response = response;
    }

    SetButton(button) {
        this.button = button;
    }

    ToggleButtonInteraction(status) {
        this.button.disabled = !status;
    }

    GetInformationText(){
        return this.promptId + ": " + this.response;
    }

    CreateHTMLQuestionPrompt(onSubmit) {
        const containerDiv = document.createElement("div");
        containerDiv.className = "question";
    
        const label = document.createElement("label");
        label.textContent = this.prompt;
        label.for = "inputElement";
    
        const input = document.createElement("input");
        input.type = "text";
        input.id = "inputElement";
    
        const button = CreateButton("Submit", () => { 
            console.log(input.value.length);
            if (input.value.length !== 0) {
                onSubmit(input.value);
            }
        });

        this.SetButton(button);
    
        containerDiv.appendChild(label);
        containerDiv.appendChild(input);
        containerDiv.appendChild(button);
    
        document.body.appendChild(containerDiv);
    }
}