"use strict";
var game; // for debugging
(function () {
    class GameManager {
        constructor(size) {
            this.size = size;
            this.html = new HTMLManager();
            this.input = new InputManager(this);

            this.setup();
        }

        setup() {
            // Initialize
            this.html.createGrid(this.size);

            this.grid = new Grid(this.size);
            this.gameover = false;
            this.win = false;
            this.firstWin = false
            this.score = 0;

            // Add to grid
            this.grid.addRandomTileToGrid();
            this.grid.addRandomTileToGrid();

            this.html.update(this.grid, {
                gameover: this.gameover,
                win: this.win,
            });

            // Bind key events
            this.input.addKeys("ArrowLeft", () => this.slide("left"));
            this.input.addKeys("ArrowRight", () => this.slide("right"));
            this.input.addKeys("ArrowUp", () => this.slide("up"));
            this.input.addKeys("ArrowDown", () => this.slide("down"));
            this.input.addKeys("a", () => this.slide("left"));
            this.input.addKeys("d", () => this.slide("right"));
            this.input.addKeys("w", () => this.slide("up"));
            this.input.addKeys("s", () => this.slide("down"));

            let del_btn = document.querySelector(".delete-button");
            this.input.bind(del_btn, "click", () => {
                let game_container = $(".game-container");
                game_container.addClass("fade");
                this.input.removeListeners(); // remove any trace of the game
                setTimeout(() => {
                    game_container.remove();
                    $("div.bootstrap").remove();
                }, 200);
            });

            let reset_btn = document.querySelector(".reset-button");
            let main_reset_btn = document.querySelector(".main-reset-button");
            this.input.bind(reset_btn, "click", () => {
                this.restartGrid();
            });
            this.input.bind(main_reset_btn, "click", () => {
                this.restartGrid();
            });

            
            let main_continue_btn = document.querySelector(".main-continue-button");
            this.input.bind(main_continue_btn, "click", () => {
                this.win = false;
                this.html.update(this.grid, {
                    gameover: this.gameover,
                    win: this.win,
                });
            });
        }

        restartGrid() {
            this.grid = new Grid(this.size);
            this.gameover = false;
            this.win = false;
            this.changeScore(-this.score); // set score back to 0

            this.grid.addRandomTileToGrid();
            this.grid.addRandomTileToGrid();

            this.html.update(this.grid, {
                gameover: this.gameover,
                win: this.win,
            });
        }

        changeScore(add) {
            this.score += add;
            $(".score-container").addClass("bounce");
            setTimeout(() => $(".score-text").text(this.score), 90);
            setTimeout(() => $(".score-container").removeClass("bounce"), 200);
        }

        slide(dir) {
            if (this.gameover || this.win) {
                return;
            }
            // Master slide function
            let oldGrid = this.grid.stringify();

            switch (dir) {
                case "up":
                    this.slideUp();
                    break;
                case "down":
                    this.slideDown();
                    break;
                case "left":
                    this.slideLeft();
                    break;
                case "right":
                    this.slideRight();
                    break;
            }

            this.grid.forEachTile((row, col, tile) => {
                if (tile != null) {
                    tile.new = false; // Make sure tile doesn't animate like new tile
                    if (tile.value == 2048 && !this.firstWin) {
                        this.firstWin = true
                        this.win = true
                    }
                }
            });

            if (oldGrid !== this.grid.stringify()) {
                // if grid has changed after sliding
                this.grid.addRandomTileToGrid();
            }

            if (!this.grid.checkMovesAvailable()) {
                // No more moves
                this.gameover = true;
            }

            this.html.update(this.grid, {
                gameover: this.gameover,
                win: this.win,
            }); // Update html (screen)
        }

        mergeTiles(tileCur, tileNext, dirRow, dirCol) {
            // Move tile coordinates
            let oldPos = tileCur.getPos();
            tileCur.move({ row: tileCur.row + dirRow, col: tileCur.col + dirCol });

            // Create new tile from merged tiles
            let merged = new Tile(tileNext.getPos(), tileCur.value * 2);
            merged.mergedWith = [tileCur, tileNext];

            this.changeScore(merged.value);
            // Modify row
            tileCur = null;
            tileNext = merged;
            // Modify grid
            this.grid.insertTile(merged);
            this.grid.removeTile(oldPos);

            return [tileCur, tileNext];
        }

        slideLeft() {
            for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
                let row = this.grid.tiles[rowIndex];
                for (let i = 0; i < 4; i++) {
                    if (row[i] === null) continue; // skip empty tiles
                    // else
                    row[i].setOldPos(row[i].getPos()); // Ensure that the tile has an old position (that it is not a new tile)
                    for (let j = i; j > 0; j--) {
                        // Start index at i, move left until edge
                        let nextIndex = j - 1;
                        let tilePos = row[j].getPos();
                        if (row[nextIndex] === null) {
                            // Move tile coordinates
                            row[j].move({ row: row[j].row, col: row[j].col - 1 });
                            // Modify grid
                            this.grid.insertTile(row[j]);
                            this.grid.removeTile(tilePos);
                        } else if (
                            row[nextIndex].value == row[j].value && 
                            row[nextIndex].mergedWith == null &&
                            row[j].mergedWith == null
                        ) {
                            // if same value, Merge Tiles
                            [row[j], row[nextIndex]] = this.mergeTiles(
                                row[j], // tile current
                                row[nextIndex], // tile next
                                0, // dir-row
                                -1 // dir-col
                            );
                        }
                    }
                }
                // After tiles have been slided in row,
                this.grid.tiles[rowIndex] = row;
            }
        }

        slideRight() {
            for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
                let row = this.grid.tiles[rowIndex];
                for (let i = 3; i >= 0; i--) {
                    if (row[i] === null) continue; // skip empty tiles
                    // else
                    row[i].setOldPos(row[i].getPos()); // Ensure that the tile has an old position (that it is not a new tile)
                    for (let j = i; j < 3; j++) {
                        // Start index at i, move right until edge
                        let nextIndex = j + 1;
                        let tilePos = row[j].getPos();
                        if (row[nextIndex] === null) {
                            row[j].move({ row: row[j].row, col: row[j].col + 1 });
                            this.grid.insertTile(row[j]);
                            this.grid.removeTile(tilePos);
                        } else if (
                            row[nextIndex].value == row[j].value &&
                            row[nextIndex].mergedWith == null &&
                            row[j].mergedWith == null
                        ) {
                            // if same value, Merge Tiles
                            [row[j], row[nextIndex]] = this.mergeTiles(
                                row[j], // tile current
                                row[nextIndex], // tile next
                                0, // dir-row
                                1 // dir-col
                            );
                        }
                    }
                }
                this.grid.tiles[rowIndex] = row;
            }
        }

        slideUp() {
            for (var rowIndex = 0; rowIndex < 4; rowIndex++) {
                let row = this.grid.getCol(rowIndex);
                for (let i = 0; i < 4; i++) {
                    if (row[i] === null) continue; // skip empty tiles
                    // else
                    row[i].setOldPos(row[i].getPos()); // Ensure that the tile has an old position (that it is not a new tile)
                    for (let j = i; j > 0; j--) {
                        // Start index at i, move left until edge
                        let nextIndex = j - 1;
                        let tilePos = row[j].getPos();
                        if (row[nextIndex] === null) {
                            // Move tile coordinates
                            row[j].move({ row: row[j].row - 1, col: row[j].col });
                            // Modify grid
                            this.grid.insertTile(row[j]);
                            this.grid.removeTile(tilePos);
                        } else if (
                            row[nextIndex].value == row[j].value &&
                            row[nextIndex].mergedWith == null &&
                            row[j].mergedWith == null
                        ) {
                            // if same value, Merge Tiles
                            [row[j], row[nextIndex]] = this.mergeTiles(
                                row[j], // tile current
                                row[nextIndex], // tile next
                                -1, // dir-row
                                0 // dir-col
                            );
                        }
                        // getCol() returns a copy of the column, so we need to re-get the column
                        // to avoid issues
                        row = this.grid.getCol(rowIndex); // IMPORTANT!!
                    }
                }
            }
        }

        slideDown() {
            for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
                let row = this.grid.getCol(rowIndex);
                for (let i = 3; i >= 0; i--) {
                    if (row[i] === null) continue; // skip empty tiles
                    // else
                    row[i].setOldPos(row[i].getPos()); // Ensure that the tile has an old position (that it is not a new tile)
                    for (let j = i; j < 3; j++) {
                        // Start index at i, move left until edge
                        let nextIndex = j + 1;
                        let tilePos = row[j].getPos();
                        if (row[nextIndex] === null) {
                            row[j].move({ row: row[j].row + 1, col: row[j].col });
                            this.grid.insertTile(row[j]);
                            this.grid.removeTile(tilePos);
                        } else if (
                            row[nextIndex].value == row[j].value &&
                            row[nextIndex].mergedWith == null &&
                            row[j].mergedWith == null
                        ) {
                            // if same value, Merge Tiles
                            [row[j], row[nextIndex]] = this.mergeTiles(
                                row[j], // tile current
                                row[nextIndex], // tile next
                                1, // dir-row
                                0 // dir-col
                            );
                        }
                        // getCol() returns a copy of the column, so we need to re-get the column
                        // to avoid issues
                        row = this.grid.getCol(rowIndex); // IMPORTANT!!
                    }
                }
            }
        }
    }

    class HTMLManager {
        update(grid, environment) {
            // We are going to be deleting the tiles and readding them seamlessly
            // so we don't have to track the tile elements long term
            // Wait for the window to be updated
            window.requestAnimationFrame(() => {
                $(".tile-container").empty(); // Removes all child nodes

                grid.tiles.forEach((column) => {
                    column.forEach((tile) => {
                        // Null means there is no tile there
                        if (tile != null) {
                            this.createTileElement(tile);
                        }
                    });
                });
                if (environment.win) {
                    $(".game-message").addClass("game-win");
                } else {
                    $(".game-message").removeClass("game-win");
                }
                if (environment.gameover) {
                    $(".game-message").addClass("game-over");
                } else {
                    $(".game-message").removeClass("game-over");
                }
                grid.resetTiles();
            });
        }

        createGrid(size) {
            // Game container will contain grid and tile containers
            // Grid container will contain rows of tiles
            // Tile container will contain tiles that are visible on screen
            $("div.bootstrap").remove();
            let game_container = $("<div>", { class: "game-container" });
            let grid_container = $("<div>", { class: "grid-container" });
            let tile_container = $("<div>", { class: "tile-container" });

            for (let i = 0; i < size; i++) {
                let gridRow = $("<div>", { class: "grid-row" });
                for (let j = 0; j < size; j++) {
                    let gridCell = $("<div>", { class: "grid-cell cell" });
                    gridRow.append(gridCell);
                }
                $(grid_container).append(gridRow);
            }

            let reset_button = $("<div>", {
                tabindex: "0",
                class: "button reset-button",
                text: "⟳",
            });
            let delete_button = $("<div>", {
                tabindex: "0",
                text: "×",
                class: "button delete-button",
            });

            let score_container = $("<div>", {
                class: "score-container",
            }).append(
                $("<div>", {
                    class: "score-text",
                    text: "0",
                })
            );
            let game_message = $("<div>", {
                class: "game-message",
            }).append(
                $("<p>"),
                $("<div>", {
                    tabindex: "0",
                    class: "button main-continue-button",
                    text: "▶",
                }),
                $("<div>", {
                    tabindex: "0",
                    class: "button main-reset-button",
                    text: "⟳",
                }),
                
            );

            $(game_container).append(game_message);
            $(game_container).append(reset_button);
            $(game_container).append(delete_button);
            $(game_container).append(score_container);

            $(game_container).append(grid_container);
            $(game_container).append(tile_container);

            let container = $("<div>", {
                class: "bootstrap",
            }).append(game_container);

            $(document.body).append(container);
        }

        createElement(type, value = null, classes = null) {
            let element = $(`<${type}>`);
            if (value) {
                element.text(value);
            }
            if (classes) {
                classes.forEach((cssClass) => element.addClass(cssClass));
            }
            return element;
        }

        createTileElement(tile) {
            let tileElement = this.createElement("div");

            let cssRow = tile.oldRow != null ? tile.oldRow + 1 : tile.row + 1;
            let cssCol = tile.oldCol != null ? tile.oldCol + 1 : tile.col + 1;
            let classes = [`tile`, `tile-${tile.value}`, `tile-pos-${cssRow}-${cssCol}`];

            if (tile.getOldPos()) {
                // If the tile has an old position
                // On the next frame, move the tile's position to where it should be
                window.requestAnimationFrame(() => {
                    // Since the tile has been placed at the previous position, we need to
                    // change its position back to where it is supposed to be
                    this.replacePosClass(tileElement, tile);
                });
            } else if (tile.mergedWith != null) {
                classes.push("tile-merged");
                this.createTileElement(tile.mergedWith[0]); // Create merged tile to show merge animation
                this.createTileElement(tile.mergedWith[1]); // Create merged tile to show merge animation
            } else if (tile.new) {
                classes.push("tile-new");
            }
            let tileText = this.createElement("div", tile.value, ["tile-text"]);

            $(tileElement).addClass(classes);
            $(tileElement).append(tileText);
            $(".tile-container").append(tileElement);
        }

        replacePosClass(tileElement, tile) {
            // You can input a function and it will return all classes of the element
            $(tileElement).removeClass((index, classNames) => {
                // Split string of classes into an array
                classNames = classNames.split(" ");

                // For each classname
                classNames.forEach((className) => {
                    // Check if the class is relating to tile position
                    if (className.substring(0, 8) == "tile-pos") {
                        // substring returns a string inbetween those values
                        $(tileElement).removeClass(className);
                    }
                });
            });

            $(tileElement).addClass(`tile-pos-${tile.row + 1}-${tile.col + 1}`);
        }
    }

    class InputManager {
        constructor(self) {
            this.gamemanager = self;
            this.listeners = {};
            // Prevent default on arrow key press
            const preventDefault = (event) => {
                switch (event.key) {
                    case "ArrowLeft":
                        event.preventDefault();
                        break;
                    case "ArrowRight":
                        event.preventDefault();
                        break;
                    case "ArrowUp":
                        event.preventDefault();
                        break;
                    case "ArrowDown":
                        event.preventDefault();
                        break;
                }
            };

            this.addToListenerList("keydown", preventDefault, document);
            document.addEventListener("keydown", preventDefault);
        }

        addToListenerList(event, callback, location) {
            this.listeners[`${Object.keys(this.listeners).length + 1}`] = [
                event,
                callback,
                location,
            ];
        }

        addKeys(key, callback) {
            const func = (event) => {
                switch (event.key) {
                    case key:
                        callback.call(this.gamemanager);
                        break;
                }
            };
            this.addToListenerList("keydown", func, document);
            document.addEventListener("keydown", func);
        }

        bind(element, event, callback) {
            element.addEventListener(event, callback);
            this.addToListenerList(event, callback, element);
        }

        removeListeners(index = null) {
            Object.entries(this.listeners).forEach((entry) => {
                // entry structure \/
                //    key = "1", "2"...
                //    array = [
                //          event = "keydown"...
                //          func = () => {...}
                //          location = document, element...
                //    ]

                let key = entry[0];
                let event = entry[1][0];
                let func = entry[1][1];
                let location = entry[1][2];

                if (index == null || index == key) {
                    delete this.listeners[Number(key)];
                    location.removeEventListener(event, func);
                }
            });
        }
    }

    class Grid {
        constructor(size) {
            // Create a grid of tiles
            this.size = size;
            this.tiles = [];
            for (let row = 0; row < size; row++) {
                let rowValue = [];
                for (let col = 0; col < size; col++) {
                    rowValue.push(null);
                }
                this.tiles.push(rowValue);
            }
        }

        forEachTile(callback) {
            // Repeat over each tile in the grid
            for (var row = 0; row < this.size; row++) {
                for (var col = 0; col < this.size; col++) {
                    callback(row, col, this.tiles[row][col]);
                }
            }
        }

        getAvailableTiles() {
            // Return an array of all available tile coords
            let tiles = [];

            this.forEachTile((row, col, tile) => {
                if (tile == null) {
                    tiles.push({ row: row, col: col });
                }
            });
            return tiles;
        }

        getRandomTile() {
            // Gets a random available tile coordinate
            let availableTiles = this.getAvailableTiles();

            if (availableTiles.length > 0) {
                let randomIndex = Math.floor(Math.random() * availableTiles.length); // One random tile
                return availableTiles[randomIndex];
            }
        }

        addRandomTileToGrid() {
            // Tile's value is usually 2, but sometimes 4
            let value = Math.random() < 0.9 ? 2 : 4;
            let tile = new Tile(this.getRandomTile(), value);
            this.insertTile(tile);
            return tile;
        }

        getTile(position) {
            return this.tiles[position.row][position.col];
        }

        insertTile(tile) {
            this.tiles[tile.row][tile.col] = tile;
        }

        removeTile(tile) {
            this.tiles[tile.row][tile.col] = null;
        }

        resetTiles() {
            this.forEachTile((row, col, tile) => {
                if (tile != null) {
                    delete tile.oldRow;
                    delete tile.oldCol;
                    delete tile.mergedWith;
                }
            });
        }

        getCol(col) {
            return [this.tiles[0][col], this.tiles[1][col], this.tiles[2][col], this.tiles[3][col]];
        }

        stringify() {
            let string = "";
            this.forEachTile((row, col, tile) => {
                let value = tile ? tile.value : null;
                string = string.concat(value);
            });
            return string;
        }

        checkAvailableTileMatches() {
            // Repeat over each tile in the grid
            for (let row = 0; row < this.size; row++) {
                for (let col = 0; col < this.size; col++) {
                    let tile = this.tiles[row][col];
                    // if the tile is an actual tile
                    if (tile != null) {
                        let neighbors = tile.getNeighbors();

                        for (let i = 0; i < neighbors.length; i++) {
                            let neighbor = this.getTile(neighbors[i]);
                            if (neighbor != null && neighbor.value == tile.value) {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        }

        checkMovesAvailable() {
            // "!!" == Bool()
            return !!this.getAvailableTiles().length || this.checkAvailableTileMatches();
        }
    }

    class Tile {
        constructor(position, value) {
            this.row = position.row;
            this.col = position.col;
            this.value = value;
            this.new = true;
        }

        setOldPos(position) {
            this.oldRow = position.row;
            this.oldCol = position.col;
        }

        move(position) {
            if (this.oldRow == null) {
                this.oldRow = this.row;
                this.oldCol = this.col;
            }
            this.row = position.row;
            this.col = position.col;
        }

        getPos() {
            return { row: this.row, col: this.col };
        }

        getOldPos() {
            if (this.oldRow != undefined) {
                // if an old position exists
                return { row: this.oldRow, col: this.oldCol };
            } else {
                return false;
            }
        }

        getNeighbors() {
            let neighbors = [];
            if (this.row > 0) {
                neighbors.push({ row: this.row - 1, col: this.col });
            }
            if (this.row < 3) {
                neighbors.push({ row: this.row + 1, col: this.col });
            }
            if (this.col > 0) {
                neighbors.push({ row: this.row, col: this.col - 1 });
            }
            if (this.col < 3) {
                neighbors.push({ row: this.row, col: this.col + 1 });
            }
            return neighbors;
        }
    }

    $(".game-container").remove();
    $("div.bootstrap").remove();
    window.requestAnimationFrame(() => {
        game = new GameManager(4);
    });
})();
