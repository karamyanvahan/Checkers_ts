import { Stone } from "./Stone";
import { Field } from "./Field";
import { Checkers } from "./Checkers";

export class Board {
    htmlEl = document.createElement('div');
    fields: Field[][] = [];

    constructor(public checkers: Checkers) {
        this.htmlEl.classList.add('board');
        this.populate();
    }

    populate() {
        for(let y = 0; y < 8; y++) {
            this.fields[y] = [];
            for(let x = 0; x < 8; x++) {
                let field = new Field(x, y, this);
                if((x + y) % 2 == 1) {
                    field.isDark = true;
                    field.htmlEl.classList.add('dark-field');
                    if(y < 3 || y > 4) {
                        let stone = new Stone(field);
                        stone.isDark = y < 3;
                        let className = stone.isDark ? 'dark-stone' : 'light-stone';
                        stone.htmlEl.classList.add(className);
                        field.stone = stone;
                        field.htmlEl.appendChild(stone.htmlEl);
                    }
                } else {
                    field.isDark = false;
                    field.htmlEl.classList.add('light-field');
                }
                this.fields[y][x] = field;
                this.htmlEl.appendChild(field.htmlEl);
            }
        }
    }
}