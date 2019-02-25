import { Board } from './Board'
import { Stone } from './Stone';
import { Options } from './Options';

export class Checkers {
    board: Board;
    htmlEl = document.createElement('div');
    selectedStone: Stone;
    isDarksTurn = false;
    capturing = false;
    options:Options;

    constructor(className?: string) {
        this.htmlEl.classList.add('checkers');
        if(className) this.htmlEl.classList.add(className);
        this.board = new Board(this);
        this.createPerspective();
        this.options = new Options(this);
    }

    createPerspective() {
        let perspective = document.createElement('div');
        perspective.classList.add('perspective');
        perspective.appendChild(this.board.htmlEl);
        this.htmlEl.appendChild(perspective);
    }

    forEachStone(f: (stone: Stone) => void) {
        for(let fieldsRow of this.board.fields) {
            for(let field of fieldsRow) {
                if(field.stone) {
                    f(field.stone);
                }
            }
        }
    }
    
    appendTo(el: HTMLElement) {
        el.appendChild(this.htmlEl);
    }

    deSelect() {
        this.hideAvailableMoves();
        this.selectedStone = null;
        this.unmarkSelected();
    }

    hideAvailableMoves() {
        for(let fieldRow of this.board.fields) {
            for(let field of fieldRow) {
                field.unmarkAsAvailableMove();
            }
        }
    }

    unmarkSelected() {
        this.forEachStone(stone => stone.unmarkAsSelected());
    }

    showCapturableStones() {
        for(let fieldRow of this.board.fields) {
            for(let field of fieldRow) {
                if(field.stone && field.stone.isDark == this.isDarksTurn) {
                    field.stone.getCapturableStones().forEach(stone => stone.markAsCapturable());
                }
            }
        }
    }

    hideCapturableStones() {
        for(let fieldRow of this.board.fields) {
            for(let field of fieldRow) {
                if(field.stone) field.stone.unmarkAsCapturable();
            }
        }
    }

    switchTurn() {
        this.hideCapturableStones();
        this.isDarksTurn = !this.isDarksTurn;
        this.showCapturableStones();
    }

    capturableStonesExist() {
        let capturableStonesExist = false;
        this.forEachStone(stone => {
            if(stone.isDark == this.isDarksTurn && stone.canCaptureAnyStone()) {
                capturableStonesExist = true;
            }
        });
        return capturableStonesExist;
    }
}