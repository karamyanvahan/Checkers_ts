import { Checkers } from "./Checkers";

export class Options {
    htmlEl = document.createElement('div');
    is3d = false;
    captureRequired = false;
    checkers:Checkers;

    constructor(checkers:Checkers) {
        this.checkers = checkers;
        this.htmlEl.classList.add('options');
        this.createIs3dCheckbox();
        this.createCaptureRequiredCheckbox();
        checkers.htmlEl.appendChild(this.htmlEl);
    }

    private createIs3dCheckbox() {
        //container
        let container = document.createElement('div');
        container.classList.add('option-container');
        this.htmlEl.appendChild(container);

        //label
        let label = document.createElement('label');
        label.htmlFor = 'is3d';
        label.innerText = '3d/2d';
        container.appendChild(label);

        //checkbox
        let checkbox = document.createElement('input');
        checkbox.id = 'is3d';
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', (event) => {
            let checked = (event.target as HTMLInputElement).checked;
            this.set3d(checked);
        });
        container.appendChild(checkbox);
    }

    private createCaptureRequiredCheckbox() {
        //container
        let container = document.createElement('div');
        container.classList.add('option-container');
        this.htmlEl.appendChild(container);

        //label
        let label = document.createElement('label');
        label.htmlFor = 'captureRequired';
        label.innerText = 'Require to capture';
        container.appendChild(label);

        //checkbox
        let checkbox = document.createElement('input');
        checkbox.id = 'captureRequired';
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', (event) => {
            let checked = (event.target as HTMLInputElement).checked;
            this.captureRequired = checked;
        });
        container.appendChild(checkbox);
    }

    private set3d(checked:boolean) {
        this.is3d = checked;
        if(checked)
            this.checkers.htmlEl.classList.add('checkers-3d');
        else
            this.checkers.htmlEl.classList.remove('checkers-3d');
    }
}