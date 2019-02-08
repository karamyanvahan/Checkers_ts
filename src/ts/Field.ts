import { Stone } from "./Stone";
import { Board } from "./Board";

export class Field {
    htmlEl = document.createElement('div');
    isDark: boolean;
    stone: Stone;
    
    constructor(public x: number, public y: number, public board: Board) {
        this.htmlEl.classList.add('field');
        this.htmlEl.addEventListener('click', this.onClick);
    }

    onClick = () => {
        let selectedStone = this.board.checkers.selectedStone;
        if(selectedStone) {
            if(this.stone) {
                if(this.stone.isItsTurn()) {
                    if(!this.board.checkers.capturing) {
                        this.board.checkers.deSelect();
                        this.stone.select();
                    }
                } else if(selectedStone.canCapture(this.stone)) {
                        selectedStone.capture(this.stone);
                        if(selectedStone.canCaptureAnyStone()) {
                            this.board.checkers.capturing = true;
                            this.board.checkers.showCapturableStones();
                        } else {
                            this.board.checkers.switchTurn();
                            this.board.checkers.deSelect();
                            this.board.checkers.capturing = false;
                        }
                }
            } else if(!this.board.checkers.capturing) {
                if(selectedStone.canMove(this)) {
                    selectedStone.move(this);
                    this.board.checkers.switchTurn();
                }
                this.board.checkers.deSelect();
            }
        } else if(this.stone && this.stone.isItsTurn()) {
                this.stone.select();
        }
    }

    markAsAvailableMove() {
        this.htmlEl.classList.add('available-move-field');
    }

    unmarkAsAvailableMove() {
        this.htmlEl.classList.remove('available-move-field');
    }
}