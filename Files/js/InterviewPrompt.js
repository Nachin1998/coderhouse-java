export class InterviewPrompt{
    constructor(prompt, promptId) {
        this.prompt = prompt;
        this.promptId = promptId;
        this.response;
    }

    SetResponse(response) {
        this.response = response;
    }

    GetInformationText(){
        return this.promptId + ": " + this.response;
    }
}