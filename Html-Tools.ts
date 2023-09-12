class HtmlTools {

    public static init(): void {
        const selects = document.getElementsByTagName('select-expanded');
        for (let index = 0; index < selects.length; index++) {
            const select = selects[index] as HTMLDivElement;
            new SelectExpanded(select);
        }
    }
    
}

class SelectExpanded {

    private select: HTMLDivElement;
    private selectContainer: HTMLDivElement;
    private actionsContainer: HTMLDivElement;
    private optionsContainer: HTMLDivElement;

    public constructor(select: HTMLDivElement) {
        this.implementStyles(); 

        this.select = select;
        this.selectContainer = this.createSelectContainer();
        this.actionsContainer = this.createActionsContainer();
        this.optionsContainer = this.createOptionsContainer();

        this.buildActionsContainer();
        this.buildOptionsContainer();

        select.append(this.selectContainer);
        this.selectContainer.append(this.actionsContainer);
        this.selectContainer.append(this.optionsContainer);
    }

    private implementStyles() {
        const style = document.createElement('style');
        style.innerHTML = css;
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    private createSelectContainer() {
        const selectContainer = document.createElement("div");
        selectContainer.classList.add("select-container");
        return selectContainer;
    }

    private createActionsContainer() {
        const actionsContainer = document.createElement("div");
        actionsContainer.classList.add("select-actions-container");
        return actionsContainer;
    }

    private createOptionsContainer() {
        const optionsContainer = document.createElement("div");
        optionsContainer.classList.add("select-options-container");
        optionsContainer.classList.add("hidden")
        return optionsContainer;
    }

    private buildActionsContainer() {
        this.buildActionInput();
        this.buildActionButton();
    }

    private buildActionInput() {
        const input = document.createElement("input");
        input.onkeyup = (event: any) => this.filterOptions(event.target.value);
        this.actionsContainer.appendChild(input);
    }

    private buildActionButton() {        
        const button = document.createElement("button");
        button.innerText = "V"
        button.onclick = () => this.expandSelect();
        this.actionsContainer.appendChild(button);
    }

    private buildOptionsContainer() {
        const innerOptionsContainer = document.createElement("div");
        innerOptionsContainer.classList.add("select-options");

        const options = this.getOptions();
        if(options.length > 0) {
            const input = this.getInput();
            while(options.length > 0) {
                const option = options[0] as HTMLOptionElement;
                option.onclick = (event) => this.selectOption(event, input);
                innerOptionsContainer.appendChild(option);
            }
        }

        this.optionsContainer.appendChild(innerOptionsContainer);
    }

    private getOptions() {
        return this.select.getElementsByTagName("option-expanded");
    }

    private getInput() {
        return this.actionsContainer.getElementsByTagName("input")[0];
    }

    private expandSelect() {
        if(this.optionsContainer.classList.contains("hidden"))
            this.optionsContainer.classList.remove("hidden")
        else
            this.optionsContainer.classList.add("hidden")
    }

    private selectOption(event: any, input: HTMLInputElement) {
        input.value = event.target.innerText
        input.setAttribute("value", event.target.innerText)
        this.filterOptions(input.value)
    }

    private filterOptions(value: any) {
        const options = this.optionsContainer.getElementsByTagName("option-expanded");
        for (let index = 0; index < options.length; index++) {
            const option = options[index] as HTMLOptionElement;
            option.style.display = option.innerText.toLowerCase().includes(value.toLowerCase()) ? "initial" : "none";
        }
    }

}

const css: string = `
    select-expanded {
        display: inline-block;
    }

    .select-container {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
    }

    .select-actions-container {
        display: flex;
        border: 1px solid black;
    }

    .select-actions-container input {
        border: 0px;
        width: 0px;
        flex: 1 1 auto;
    }

    .select-actions-container button {
        border: 0px;
        border-left: 1px solid black;
    }

    .select-options-container {
        display: flex;
        height: 0px;
    }

    .select-options {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        position: relative;
        height: max-content;
        border: 1px solid black;
        padding: 10px;
        padding-right: 25px;
        background-color: white;
    }

    .hidden {
        display: flex;
        visibility: hidden;
        height: 0px;
    }
`;

window.onload = HtmlTools.init;