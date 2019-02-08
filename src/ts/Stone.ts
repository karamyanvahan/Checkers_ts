import { Field } from "./Field";

export class Stone {
    htmlEl = document.createElement('span');
    isDark: boolean;
    isQueen = false;

    constructor(public field: Field) {
        this.htmlEl.classList.add('stone');
    }

    move(newField: Field) {
        this.field.stone = null;
        this.field = newField;
        this.field.stone = this;
        newField.htmlEl.appendChild(this.htmlEl);
        return true;
    }

    canMove(field: Field) {
        return this.getAvailableMoves().indexOf(field) != -1;
    }

    getAvailableMoves() {
        let neighbourBlackFields = this.getNeighbourBlackFields();
        let moves = neighbourBlackFields
                    .filter(field => {
                        if(this.isDark) {
                            return field.y > this.field.y;
                        } else {
                            return field.y < this.field.y;
                        }
                    })
                    .filter(field => !field.stone);
        if(this.field.board.checkers.thereAreCapturableStones()) moves = [];
        return moves;
    }

    getNeighbourBlackFields() {
        let fields = this.field.board.fields;
        let x = this.field.x, y = this.field.y;
        let neighbourBlackFields = [
            fields[y - 1] ? fields[y - 1][x - 1] : undefined,
            fields[y - 1] ? fields[y - 1][x + 1] : undefined,
            fields[y + 1] ? fields[y + 1][x - 1] : undefined,
            fields[y + 1] ? fields[y + 1][x + 1] : undefined
        ].filter(field => field != undefined);
        return neighbourBlackFields;
    }

    getNeighbourEnemyStones() {
        let neighbourBlackFields = this.getNeighbourBlackFields();
        let neighbourEnemyStones = neighbourBlackFields
                                .filter(field => field.stone)
                                .map(field => field.stone)
                                .filter(stone => stone.isDark == !this.isDark);
        return neighbourEnemyStones;
    }

    select() {
        this.field.board.checkers.selectedStone = this;
        this.markAsSelected();
        this.showAvailableMoves();
    }

    showAvailableSteps() {
        if(!this.canCaptureAnyStone()) {
            this.showAvailableMoves();
        }
        this.showCapturableStones();
    }

    canCaptureAnyStone() {
        return this.getCapturableStones().length != 0;
    }

    showAvailableMoves() {
        for(let field of this.getAvailableMoves()) {
            field.markAsAvailableMove();
        }
    }

    getCapturableStones() {
        let capturableStones = this.getNeighbourEnemyStones().filter(stone => this.canCapture(stone));
        return capturableStones;
    }

    showCapturableStones() {
        for(let stone of this.getCapturableStones()) {
            stone.markAsCapturable();
        }
    }

    markAsCapturable() {
        this.field.htmlEl.classList.add('capturable-stone-field');
    }

    unmarkAsCapturable() {
        this.field.htmlEl.classList.remove('capturable-stone-field');
    }

    isItsTurn() {
        return this.isDark ? this.field.board.checkers.isDarksTurn : !this.field.board.checkers.isDarksTurn
    }

    markAsSelected() {
        this.field.htmlEl.classList.add('selected-stone-field');
    }

    unmarkAsSelected() {
        this.field.htmlEl.classList.remove('selected-stone-field');
    }

    canCapture(stone: Stone) {
        if(this.getNeighbourEnemyStones().indexOf(stone) != -1) {
            let dX = (stone.field.x - this.field.x);
            let dY = (stone.field.y - this.field.y);
            let fieldToMove
            if(Math.abs(dX) == 1 && Math.abs(dY) == 1) {
                let fields = this.field.board.fields;
                fieldToMove = fields[this.field.y + dY * 2] ? fields[this.field.y + dY * 2][this.field.x + dX * 2] : undefined;
            }
            return fieldToMove && !fieldToMove.stone;
        } else {
            return false;
        }
    }

    capture(stoneBeingCaptured: Stone) {
            let dX = (stoneBeingCaptured.field.x - this.field.x);
            let dY = (stoneBeingCaptured.field.y - this.field.y);
            let fields = this.field.board.fields;
            let fieldToMove = fields[this.field.y + dY * 2][this.field.x + dX * 2];
            this.field.board.checkers.hideCapturableStones();
            stoneBeingCaptured.field.stone = null;
            stoneBeingCaptured.field.htmlEl.removeChild(stoneBeingCaptured.htmlEl);
            this.move(fieldToMove);
            
            //check if won
            let thereIsStone = false;
            this.field.board.checkers.forEachStone(stone => {
                if(stone.isDark == stoneBeingCaptured.isDark) {
                    thereIsStone = true;
                } 
            });
            if(!thereIsStone) {
                this.win();
            }
            this.win();
    }

    win() {
        let message = this.isDark ? "Darks won" : "Lights won";
        let winMessageBox = document.createElement('div');
        winMessageBox.classList.add('win-message-box');
        winMessageBox.innerHTML = `<span class="message">${message}</span>`
        this.field.board.checkers.htmlEl.appendChild(winMessageBox);
    }

    becomeQueen() {
        this.isQueen = true;
        let fileName = 'queen_' + (this.isDark ? 'dark' : 'light') + '.svg';
        let el = document.createElement('img');
        el.src = 'svg/' + fileName;
        el.classList.add('queen');
        this.field.htmlEl.removeChild(this.htmlEl);
        this.htmlEl = el;
        this.field.htmlEl.appendChild(el);
    }
}