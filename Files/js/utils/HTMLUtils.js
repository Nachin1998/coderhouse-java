export function CreateButton(text, onClick, appendChild = false){
    const button = document.createElement("button");
    button.textContent = text;
    button.addEventListener("click", onClick);
    if(appendChild)
    {
        document.body.appendChild(button);
    }
    return button;
}