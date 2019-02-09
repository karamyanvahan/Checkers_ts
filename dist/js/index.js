define("Field", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var Field = /** @class */ (function () {
        function Field(x, y, board) {
            var _this = this;
            this.x = x;
            this.y = y;
            this.board = board;
            this.htmlEl = document.createElement('div');
            this.onClick = function () {
                var selectedStone = _this.board.checkers.selectedStone;
                if (selectedStone) {
                    if (_this.stone) {
                        if (_this.stone.isItsTurn()) {
                            if (!_this.board.checkers.capturing) {
                                _this.board.checkers.deSelect();
                                _this.stone.select();
                            }
                        }
                        else if (selectedStone.canCapture(_this.stone)) {
                            selectedStone.capture(_this.stone);
                            if (selectedStone.canCaptureAnyStone()) {
                                _this.board.checkers.capturing = true;
                                _this.board.checkers.showCapturableStones();
                            }
                            else {
                                _this.board.checkers.switchTurn();
                                _this.board.checkers.deSelect();
                                _this.board.checkers.capturing = false;
                            }
                        }
                    }
                    else if (!_this.board.checkers.capturing) {
                        if (selectedStone.canMove(_this)) {
                            selectedStone.move(_this);
                            _this.board.checkers.switchTurn();
                        }
                        _this.board.checkers.deSelect();
                    }
                }
                else if (_this.stone && _this.stone.isItsTurn()) {
                    _this.stone.select();
                }
            };
            this.htmlEl.classList.add('field');
            this.htmlEl.addEventListener('click', this.onClick);
        }
        Field.prototype.markAsAvailableMove = function () {
            this.htmlEl.classList.add('available-move-field');
        };
        Field.prototype.unmarkAsAvailableMove = function () {
            this.htmlEl.classList.remove('available-move-field');
        };
        return Field;
    }());
    exports.Field = Field;
});
define("Stone", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var Stone = /** @class */ (function () {
        function Stone(field) {
            this.field = field;
            this.htmlEl = document.createElement('span');
            this.isQueen = false;
            this.htmlEl.classList.add('stone');
        }
        Stone.prototype.move = function (newField) {
            this.field.stone = null;
            this.field = newField;
            this.field.stone = this;
            newField.htmlEl.appendChild(this.htmlEl);
            if ((this.isDark && this.field.y == 7) || (!this.isDark && this.field.y == 0))
                this.becomeQueen();
        };
        Stone.prototype.canMove = function (field) {
            return this.getAvailableMoves().indexOf(field) != -1;
        };
        Stone.prototype.getAvailableMoves = function () {
            var _this = this;
            if (this.isQueen)
                return this.getQueenAvailableMoves();
            var neighbourBlackFields = this.getNeighbourBlackFields();
            var moves = neighbourBlackFields
                .filter(function (field) {
                if (_this.isDark) {
                    return field.y > _this.field.y;
                }
                else {
                    return field.y < _this.field.y;
                }
            })
                .filter(function (field) { return !field.stone; });
            if (this.field.board.checkers.thereAreCapturableStones())
                moves = [];
            return moves;
        };
        Stone.prototype.getQueenAvailableMoves = function () {
            var moves = [];
            var fields = this.field.board.fields;
            for (var d = 1; d <= 8; d++) {
                var field = fields[this.field.y - d] ? fields[this.field.y - d][this.field.x - d] : undefined;
                if (field) {
                    if (field.stone)
                        break;
                    moves.push(field);
                }
            }
            for (var d = 1; d <= 8; d++) {
                var field = fields[this.field.y - d] ? fields[this.field.y - d][this.field.x + d] : undefined;
                if (field) {
                    if (field.stone)
                        break;
                    moves.push(field);
                }
            }
            for (var d = 1; d <= 8; d++) {
                var field = fields[this.field.y + d] ? fields[this.field.y + d][this.field.x + d] : undefined;
                if (field) {
                    if (field.stone)
                        break;
                    moves.push(field);
                }
            }
            for (var d = 1; d <= 8; d++) {
                var field = fields[this.field.y + d] ? fields[this.field.y + d][this.field.x - d] : undefined;
                if (field) {
                    if (field.stone)
                        break;
                    moves.push(field);
                }
            }
            return moves;
        };
        Stone.prototype.getQueenCaptruableCandidates = function () {
            var _this = this;
            var stones = [];
            var fields = this.field.board.fields;
            for (var d = 1; d <= 8; d++) {
                var field = fields[this.field.y - d] ? fields[this.field.y - d][this.field.x - d] : undefined;
                if (field && field.stone) {
                    stones.push(field.stone);
                    break;
                }
            }
            for (var d = 1; d <= 8; d++) {
                var field = fields[this.field.y - d] ? fields[this.field.y - d][this.field.x + d] : undefined;
                if (field && field.stone) {
                    stones.push(field.stone);
                    break;
                }
            }
            for (var d = 1; d <= 8; d++) {
                var field = fields[this.field.y + d] ? fields[this.field.y + d][this.field.x + d] : undefined;
                if (field && field.stone) {
                    stones.push(field.stone);
                    break;
                }
            }
            for (var d = 1; d <= 8; d++) {
                var field = fields[this.field.y + d] ? fields[this.field.y + d][this.field.x - d] : undefined;
                if (field && field.stone) {
                    stones.push(field.stone);
                    break;
                }
            }
            var capturableCandidates = stones.filter(function (stone) { return stone.isDark != _this.isDark; });
            return capturableCandidates;
        };
        Stone.prototype.getNeighbourBlackFields = function () {
            var fields = this.field.board.fields;
            var x = this.field.x, y = this.field.y;
            var neighbourBlackFields = [
                fields[y - 1] ? fields[y - 1][x - 1] : undefined,
                fields[y - 1] ? fields[y - 1][x + 1] : undefined,
                fields[y + 1] ? fields[y + 1][x - 1] : undefined,
                fields[y + 1] ? fields[y + 1][x + 1] : undefined
            ].filter(function (field) { return field != undefined; });
            return neighbourBlackFields;
        };
        Stone.prototype.getCaptruableCandidates = function () {
            var _this = this;
            if (this.isQueen)
                return this.getQueenCaptruableCandidates();
            var neighbourBlackFields = this.getNeighbourBlackFields();
            var neighbourEnemyStones = neighbourBlackFields
                .filter(function (field) { return field.stone; })
                .map(function (field) { return field.stone; })
                .filter(function (stone) { return stone.isDark == !_this.isDark; });
            return neighbourEnemyStones;
        };
        Stone.prototype.select = function () {
            this.field.board.checkers.selectedStone = this;
            this.markAsSelected();
            this.showAvailableMoves();
        };
        Stone.prototype.showAvailableSteps = function () {
            if (!this.canCaptureAnyStone()) {
                this.showAvailableMoves();
            }
            this.showCapturableStones();
        };
        Stone.prototype.canCaptureAnyStone = function () {
            return this.getCapturableStones().length != 0;
        };
        Stone.prototype.showAvailableMoves = function () {
            for (var _i = 0, _a = this.getAvailableMoves(); _i < _a.length; _i++) {
                var field = _a[_i];
                field.markAsAvailableMove();
            }
        };
        Stone.prototype.getCapturableStones = function () {
            var _this = this;
            var capturableStones = this.getCaptruableCandidates().filter(function (stone) { return _this.canCapture(stone); });
            return capturableStones;
        };
        Stone.prototype.showCapturableStones = function () {
            for (var _i = 0, _a = this.getCapturableStones(); _i < _a.length; _i++) {
                var stone = _a[_i];
                stone.markAsCapturable();
            }
        };
        Stone.prototype.markAsCapturable = function () {
            this.field.htmlEl.classList.add('capturable-stone-field');
        };
        Stone.prototype.unmarkAsCapturable = function () {
            this.field.htmlEl.classList.remove('capturable-stone-field');
        };
        Stone.prototype.isItsTurn = function () {
            return this.isDark ? this.field.board.checkers.isDarksTurn : !this.field.board.checkers.isDarksTurn;
        };
        Stone.prototype.markAsSelected = function () {
            this.htmlEl.classList.add('selected-stone');
        };
        Stone.prototype.unmarkAsSelected = function () {
            this.htmlEl.classList.remove('selected-stone');
        };
        Stone.prototype.canCapture = function (stone) {
            if (this.getCaptruableCandidates().indexOf(stone) != -1) {
                var dX = (stone.field.x - this.field.x) / Math.abs(stone.field.x - this.field.x);
                var dY = (stone.field.y - this.field.y) / Math.abs(stone.field.y - this.field.y);
                var fieldToMove = void 0;
                var fields = this.field.board.fields;
                fieldToMove = fields[stone.field.y + dY] ? fields[stone.field.y + dY][stone.field.x + dX] : undefined;
                return fieldToMove && !fieldToMove.stone;
            }
            else {
                return false;
            }
        };
        Stone.prototype.capture = function (stoneBeingCaptured) {
            var dX = (stoneBeingCaptured.field.x - this.field.x) / Math.abs(stoneBeingCaptured.field.x - this.field.x);
            var dY = (stoneBeingCaptured.field.y - this.field.y) / Math.abs(stoneBeingCaptured.field.y - this.field.y);
            var fields = this.field.board.fields;
            var fieldToMove = fields[stoneBeingCaptured.field.y + dY][stoneBeingCaptured.field.x + dX];
            this.field.board.checkers.hideCapturableStones();
            stoneBeingCaptured.field.stone = null;
            stoneBeingCaptured.field.htmlEl.removeChild(stoneBeingCaptured.htmlEl);
            this.move(fieldToMove);
            //check if won
            var thereIsStone = false;
            this.field.board.checkers.forEachStone(function (stone) {
                if (stone.isDark == stoneBeingCaptured.isDark) {
                    thereIsStone = true;
                }
            });
            if (!thereIsStone) {
                this.win();
            }
        };
        Stone.prototype.win = function () {
            var message = this.isDark ? "Darks won" : "Lights won";
            var winMessageBox = document.createElement('div');
            winMessageBox.classList.add('win-message-box');
            winMessageBox.innerHTML = "<span class=\"message\">" + message + "</span>";
            this.field.board.checkers.htmlEl.appendChild(winMessageBox);
        };
        Stone.prototype.becomeQueen = function () {
            this.isQueen = true;
            var fileName = 'queen_' + (this.isDark ? 'dark' : 'light') + '.svg';
            var el = document.createElement('img');
            el.src = 'svg/' + fileName;
            el.classList.add('queen');
            this.field.htmlEl.removeChild(this.htmlEl);
            this.htmlEl = el;
            this.field.htmlEl.appendChild(el);
        };
        return Stone;
    }());
    exports.Stone = Stone;
});
define("Board", ["require", "exports", "Stone", "Field"], function (require, exports, Stone_1, Field_1) {
    "use strict";
    exports.__esModule = true;
    var Board = /** @class */ (function () {
        function Board(checkers) {
            this.checkers = checkers;
            this.htmlEl = document.createElement('div');
            this.fields = [];
            this.htmlEl.classList.add('board');
            this.populate();
        }
        Board.prototype.populate = function () {
            for (var y = 0; y < 8; y++) {
                this.fields[y] = [];
                for (var x = 0; x < 8; x++) {
                    var field = new Field_1.Field(x, y, this);
                    if ((x + y) % 2 == 1) {
                        field.isDark = true;
                        field.htmlEl.classList.add('dark-field');
                        if (y < 3 || y > 4) {
                            var stone = new Stone_1.Stone(field);
                            stone.isDark = y < 3;
                            var className = stone.isDark ? 'dark-stone' : 'light-stone';
                            stone.htmlEl.classList.add(className);
                            field.stone = stone;
                            field.htmlEl.appendChild(stone.htmlEl);
                        }
                    }
                    else {
                        field.isDark = false;
                        field.htmlEl.classList.add('light-field');
                    }
                    this.fields[y][x] = field;
                    this.htmlEl.appendChild(field.htmlEl);
                }
            }
        };
        return Board;
    }());
    exports.Board = Board;
});
define("Checkers", ["require", "exports", "Board"], function (require, exports, Board_1) {
    "use strict";
    exports.__esModule = true;
    var Checkers = /** @class */ (function () {
        function Checkers(className) {
            this.htmlEl = document.createElement('div');
            this.isDarksTurn = false;
            this.capturing = false;
            this.htmlEl.classList.add('checkers');
            if (className)
                this.htmlEl.classList.add(className);
            this.board = new Board_1.Board(this);
            this.htmlEl.appendChild(this.board.htmlEl);
        }
        Checkers.prototype.forEachStone = function (f) {
            for (var _i = 0, _a = this.board.fields; _i < _a.length; _i++) {
                var fieldsRow = _a[_i];
                for (var _b = 0, fieldsRow_1 = fieldsRow; _b < fieldsRow_1.length; _b++) {
                    var field = fieldsRow_1[_b];
                    if (field.stone) {
                        f(field.stone);
                    }
                }
            }
        };
        Checkers.prototype.appendTo = function (el) {
            el.appendChild(this.htmlEl);
        };
        Checkers.prototype.deSelect = function () {
            this.hideAvailableMoves();
            this.selectedStone = null;
            this.unmarkSelected();
        };
        Checkers.prototype.hideAvailableMoves = function () {
            for (var _i = 0, _a = this.board.fields; _i < _a.length; _i++) {
                var fieldRow = _a[_i];
                for (var _b = 0, fieldRow_1 = fieldRow; _b < fieldRow_1.length; _b++) {
                    var field = fieldRow_1[_b];
                    field.unmarkAsAvailableMove();
                }
            }
        };
        Checkers.prototype.unmarkSelected = function () {
            this.forEachStone(function (stone) { return stone.unmarkAsSelected(); });
        };
        Checkers.prototype.showCapturableStones = function () {
            for (var _i = 0, _a = this.board.fields; _i < _a.length; _i++) {
                var fieldRow = _a[_i];
                for (var _b = 0, fieldRow_2 = fieldRow; _b < fieldRow_2.length; _b++) {
                    var field = fieldRow_2[_b];
                    if (field.stone && field.stone.isDark == this.isDarksTurn) {
                        field.stone.getCapturableStones().forEach(function (stone) { return stone.markAsCapturable(); });
                    }
                }
            }
        };
        Checkers.prototype.hideCapturableStones = function () {
            for (var _i = 0, _a = this.board.fields; _i < _a.length; _i++) {
                var fieldRow = _a[_i];
                for (var _b = 0, fieldRow_3 = fieldRow; _b < fieldRow_3.length; _b++) {
                    var field = fieldRow_3[_b];
                    if (field.stone)
                        field.stone.unmarkAsCapturable();
                }
            }
        };
        Checkers.prototype.switchTurn = function () {
            this.hideCapturableStones();
            this.isDarksTurn = !this.isDarksTurn;
            this.showCapturableStones();
        };
        Checkers.prototype.thereAreCapturableStones = function () {
            var _this = this;
            var thereAreCapturableStones = false;
            this.forEachStone(function (stone) {
                if (stone.isDark == _this.isDarksTurn && stone.canCaptureAnyStone()) {
                    thereAreCapturableStones = true;
                }
            });
            return thereAreCapturableStones;
        };
        return Checkers;
    }());
    exports.Checkers = Checkers;
});
define("index", ["require", "exports", "Checkers"], function (require, exports, Checkers_1) {
    "use strict";
    exports.__esModule = true;
    var checkers = new Checkers_1.Checkers();
    checkers.appendTo(document.getElementById('wrapper'));
});
