class HtmlTools {

    public static init(): void {
        HtmlTools.buildSelectExpanded();
        HtmlTools.buildInputClean();
    }

    private static buildSelectExpanded(): void {
        const selects = document.getElementsByTagName('select-expanded');
        for (let index = 0; index < selects.length; index++) {
            const select = selects[index] as HTMLSelectElement;
            new SelectExpanded(select);
        }
    }

    private static buildInputClean(): void {
        const inputs = document.getElementsByTagName('input-clean');
        for (let index = 0; index < inputs.length; index++) {
            const input = inputs[index] as HTMLInputElement;
            new InputClean(input);
        }
    }
    
}

class SelectExpanded {

    private select: HTMLSelectElement;
    private selectContainer: HTMLDivElement;
    private actionsContainer: HTMLDivElement;
    private optionsContainer: HTMLDivElement;

    public constructor(select: HTMLSelectElement) {
        this.implementStyles(); 
        this.implementBaseEvents();
        
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
        if(document.getElementById("select-expanded") == undefined) {
            const style = document.createElement('style');
            style.id = "select-expanded";
            style.innerHTML = SelectExpandedCss;
            document.getElementsByTagName('head')[0].appendChild(style);
        }
    }

    private implementBaseEvents() {
        document.addEventListener('click', this.clickOutside.bind(this));
    }

    private clickOutside(event: MouseEvent) {
        if (this.isExpanded() && this.select !== event.target && !this.select.contains(event.target as Node)) {    
            this.expandSelect();
        }
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
        
        const name = this.select.getAttribute("name");
        if(name != undefined)
            input.setAttribute("name", name);

        let selected = this.getSelectedOption();
        if(selected == undefined) {
            const options = this.getOptions();
            if(options.length > 0) {
                selected = options[0];
            }
        } 
        
        if(selected != undefined) {
            const selectValue = selected.getAttribute("value");
            const value = selectValue != null ? selectValue : "";
            selected.classList.add("hover");
            input.value = value;
        }

        this.actionsContainer.appendChild(input);
    }

    private buildActionButton() {        
        const button = document.createElement("button");
        button.innerText = "▾"
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

    private getOptions(): HTMLCollectionOf<HTMLOptionElement> {
        return this.select.getElementsByTagName("option-expanded") as HTMLCollectionOf<HTMLOptionElement>;
    }

    private getSelectedOption(): HTMLOptionElement | undefined {
        const options = this.getOptions();
        for (let index = 0; index < options.length; index++) {
            const option = options[index];
            if(option.attributes.getNamedItem("selected"))
                return option;
        }
        return undefined;
    }

    private getInput() {
        return this.actionsContainer.getElementsByTagName("input")[0];
    }

    private isExpanded() {
        return !this.optionsContainer.classList.contains("hidden");
    }

    private expandSelect() {
        if(this.isExpanded())
            this.optionsContainer.classList.add("hidden")
        else
            this.optionsContainer.classList.remove("hidden")
    }

    private selectOption(event: any, input: HTMLInputElement) {
        input.value = event.target.getAttribute("value");
        this.expandSelect();
        this.filterOptions("");
    }

    private filterOptions(value: any) {
        const options = this.optionsContainer.getElementsByTagName("option-expanded");
        for (let index = 0; index < options.length; index++) {
            const option = options[index] as HTMLOptionElement;
            const optionValue = option.getAttribute("value");
            if(optionValue != null){
                if(optionValue.toLowerCase().includes(value.toLowerCase()))
                    option.classList.remove("hidden-keep-width");
                else
                    option.classList.add("hidden-keep-width");
            }
            if(optionValue == this.getInput().value)
                option.classList.add("hover");
            else 
                option.classList.remove("hover");
        }
    }

}

const SelectExpandedCss: string = `

    select-expanded {
        display: inline-block;
        border: 1px solid black;
    }

    .select-container {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
    }

    .select-actions-container {
        display: flex;
    }

    .select-actions-container:focus-within {
        outline: auto;
    }

    .select-actions-container input {
        border: 0px;
        width: 0px;
        flex: 1 1 auto;
    }

    .select-actions-container button {
        border: 0px;
        border-left: 1px solid black;
        font-weight: bold;
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
        background-color: white;
    }

    .select-options option-expanded {
        padding-left: 5px;
        padding-right: 30px;
    }

    .select-options option-expanded:hover {
        background-color: dodgerblue;
    }

    .hidden {
        display: flex;
        visibility: hidden;
        height: 0px;
    }

    .hover {
        background-color: lightgray;
    }

    .hidden-keep-width {
        visibility: hidden;
        height: 0px;
    }

`;

class InputClean {

    private inputClean: HTMLInputElement;
    private inputContainer: HTMLDivElement;

    public constructor(inputClean: HTMLInputElement) {
        this.implementStyles();

        this.inputClean = inputClean;
        this.inputContainer = this.createInputContainer();

        this.buildInputContainer();

        inputClean.append(this.inputContainer);
    }

    private implementStyles() {
        if(document.getElementById("input-clean") == undefined) {
            const style = document.createElement('style');
            style.id = "input-clean";
            style.innerHTML = InputCleanCss;
            document.getElementsByTagName('head')[0].appendChild(style);
        }
    }

    private createInputContainer() {
        const inputContainer = document.createElement("div");
        inputContainer.classList.add("input-container");
        return inputContainer;
    }

    private buildInputContainer() {
        this.buildInput();
        this.buildButton();
    }

    private buildInput() {
        const value = this.inputClean.getAttribute("value");
        const name = this.inputClean.getAttribute("name");
        const type = this.inputClean.getAttribute("type");

        const input = document.createElement("input");

        if(value != undefined)
            input.value = value;

        if(name != undefined)
            input.setAttribute("name", name);

        if(type != undefined)
            input.setAttribute("type", type);

        this.inputContainer.append(input);
    }

    private buildButton() {
        const button = document.createElement("button");

        button.innerHTML = "✖";

        button.onclick = this.cleanInput.bind(this);

        this.inputContainer.append(button);
    }

    private cleanInput() {
        const input = this.getInput();
        if(input != undefined) {
            switch (this.getInputType()) {
                case "number":
                    input.value = "0";
                break;
                default:
                    input.value = "";
                break;
            }
        }
    }

    private getInput() {
        return this.inputContainer.getElementsByTagName("input")[0];
    }

    private getInputType() {
        const input = this.getInput();
        if(input != undefined) {
            return input.getAttribute("type");
        }
        return "";
    }

}

const InputCleanCss: string = `

    input-clean {
        display: inline-block;
        border: 1px solid;
    }

    input-clean:focus-within {
        outline: auto;
    }

    input-clean input {
        border: 0px;
        flex: 1 1 auto;
    }

    input-clean input:focus {
        outline: none;
    }

    input-clean button {
        border: 0px;
        border-left: 1px solid;
    }

    .input-container {
        display: flex;
    }

`;

window.onload = HtmlTools.init;