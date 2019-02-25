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
        if((this.isDark && this.field.y == 7) || (!this.isDark && this.field.y == 0))
            this.becomeQueen();
    }

    canMove(field: Field) {
        return this.getAvailableMoves().indexOf(field) != -1;
    }

    getAvailableMoves() {
        if(this.isQueen)
            return this.getQueenAvailableMoves();

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
        if(this.field.board.checkers.options.captureRequired && this.field.board.checkers.capturableStonesExist()) moves = [];
        return moves;
    }

    private getQueenAvailableMoves() {
        let moves: Field[] = [];
        let fields = this.field.board.fields;
        for(let d = 1; d <= 8; d++) {
            let field = fields[this.field.y - d]? fields[this.field.y - d][this.field.x - d] : undefined;
            if(field) {
                if(field.stone)
                    break;
                moves.push(field);
            }
        }
        for(let d = 1; d <= 8; d++) {
            let field = fields[this.field.y - d]? fields[this.field.y - d][this.field.x + d] : undefined;
            if(field) {
                if(field.stone)
                    break;
                moves.push(field);
            }
        }
        for(let d = 1; d <= 8; d++) {
            let field = fields[this.field.y + d]? fields[this.field.y + d][this.field.x + d] : undefined;
            if(field) {
                if(field.stone)
                    break;
                moves.push(field);
            }
        }
        for(let d = 1; d <= 8; d++) {
            let field = fields[this.field.y + d]? fields[this.field.y + d][this.field.x - d] : undefined;
            if(field) {
                if(field.stone)
                    break;
                moves.push(field);
            }
        }
        return moves;
    }

    private getQueenCaptruableCandidates() {
        let stones: Stone[] = [];
        let fields = this.field.board.fields;
        for(let d = 1; d <= 8; d++) {
            let field = fields[this.field.y - d]? fields[this.field.y - d][this.field.x - d] : undefined;
            if(field && field.stone) {
                stones.push(field.stone);
                break;                    
            }
        }
        for(let d = 1; d <= 8; d++) {
            let field = fields[this.field.y - d]? fields[this.field.y - d][this.field.x + d] : undefined;
            if(field && field.stone) {
                stones.push(field.stone);
                break;                    
            }
        }
        for(let d = 1; d <= 8; d++) {
            let field = fields[this.field.y + d]? fields[this.field.y + d][this.field.x + d] : undefined;
            if(field && field.stone) {
                stones.push(field.stone);
                break;                    
            }
        }
        for(let d = 1; d <= 8; d++) {
            let field = fields[this.field.y + d]? fields[this.field.y + d][this.field.x - d] : undefined;
            if(field && field.stone) {
                stones.push(field.stone);
                break;                    
            }
        }
        let capturableCandidates = stones.filter(stone => stone.isDark != this.isDark);
        return capturableCandidates;
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

    getCaptruableCandidates() {
        if(this.isQueen)
            return this.getQueenCaptruableCandidates();

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
        let capturableStones = this.getCaptruableCandidates().filter(stone => this.canCapture(stone));
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
        this.htmlEl.classList.add('selected-stone');
    }

    unmarkAsSelected() {
        this.htmlEl.classList.remove('selected-stone');
    }

    canCapture(stone: Stone) {
        if(this.getCaptruableCandidates().indexOf(stone) != -1) {
            let dX = (stone.field.x - this.field.x) / Math.abs(stone.field.x - this.field.x);
            let dY = (stone.field.y - this.field.y) / Math.abs(stone.field.y - this.field.y);
            let fieldToMove: Field;
            let fields = this.field.board.fields;
            fieldToMove = fields[stone.field.y + dY] ? fields[stone.field.y + dY][stone.field.x + dX] : undefined;
            return fieldToMove && !fieldToMove.stone;
        } else {
            return false;
        }
    }

    capture(stoneBeingCaptured: Stone) {
            let dX = (stoneBeingCaptured.field.x - this.field.x) / Math.abs(stoneBeingCaptured.field.x - this.field.x);
            let dY = (stoneBeingCaptured.field.y - this.field.y) / Math.abs(stoneBeingCaptured.field.y - this.field.y);
            let fields = this.field.board.fields;
            let fieldToMove = fields[stoneBeingCaptured.field.y + dY][stoneBeingCaptured.field.x + dX];
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