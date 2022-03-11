"use strict";
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
        this.score = 0;

        // Add to grid
        this.grid.addRandomTileToGrid();
        this.grid.addRandomTileToGrid();

        this.html.update(this.grid);

        // Bind key events
        this.input.addKeys("ArrowLeft", () => this.slide("left"));
        this.input.addKeys("ArrowRight", () => this.slide("right"));
        this.input.addKeys("ArrowUp", () => this.slide("up"));
        this.input.addKeys("ArrowDown", () => this.slide("down"));
        this.input.addKeys("a", () => this.slide("left"));
        this.input.addKeys("d", () => this.slide("right"));
        this.input.addKeys("w", () => this.slide("up"));
        this.input.addKeys("s", () => this.slide("down"));

        this.input.bind($(".delete-button"), "click", () => {
            let game_container = $(".game-container")
            game_container.addClass("fade")
            setTimeout(() => game_container.remove(), 200)
        });
    }

    slide(dir) {
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
            }
        });

        if (oldGrid !== this.grid.stringify()) {
            // if grid has changed after sliding
            this.grid.addRandomTileToGrid();
        }

        this.html.update(this.grid); // Update html (screen)
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
                        // Move tile coordinates
                        row[j].move({ row: row[j].row, col: row[j].col - 1 });

                        let merged = new Tile(row[nextIndex].getPos(), row[j].value * 2);
                        merged.merge(row[j], row[nextIndex]);
                        // Modify row
                        row[nextIndex] = merged;
                        // Modify grid
                        this.grid.insertTile(merged);
                        this.grid.removeTile(tilePos);
                    }
                }
            }
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
                        // Move tile coordinates
                        row[j].move({ row: row[j].row, col: row[j].col + 1 });

                        let merged = new Tile(row[nextIndex].getPos(), row[j].value * 2);
                        merged.merge(row[j], row[nextIndex]);
                        // Modify row
                        row[nextIndex] = merged;
                        // Modify grid
                        this.grid.insertTile(merged);
                        this.grid.removeTile(tilePos);
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
                        // Move tile coordinates
                        row[j].move({ row: row[j].row - 1, col: row[j].col });

                        let merged = new Tile(row[nextIndex].getPos(), row[j].value * 2);
                        merged.merge(row[j], row[nextIndex]);
                        // Modify row
                        row[nextIndex] = merged;
                        // Modify grid
                        this.grid.insertTile(merged);
                        this.grid.removeTile(tilePos);
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
                        // Move tile coordinates
                        row[j].move({ row: row[j].row + 1, col: row[j].col });

                        let merged = new Tile(row[nextIndex].getPos(), row[j].value * 2);
                        merged.merge(row[j], row[nextIndex]);
                        // Modify row
                        row[nextIndex] = merged;
                        // Modify grid
                        this.grid.insertTile(merged);
                        this.grid.removeTile(tilePos);
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
    update(grid) {
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

            grid.resetTiles();
        });
    }

    createGrid(size) {
        // Game container will contain grid and tile containers
        // Grid container will contain rows of tiles
        // Tile container will contain tiles that are visible on screen
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

        let delete_button = $("<div>", { text: "×", class: "button delete-button" });
        $(game_container).append(delete_button);

        $(game_container).append(grid_container);
        $(game_container).append(tile_container);

        $(document.body).append(game_container);
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
        // Prevent default on arrow key press
        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    console.log("left");
                    event.preventDefault();
                    break;
                case "ArrowRight":
                    console.log("right");
                    event.preventDefault();
                    break;
                case "ArrowUp":
                    console.log("up");
                    event.preventDefault();
                    break;
                case "ArrowDown":
                    console.log("down");
                    event.preventDefault();
                    break;
            }
        });
    }

    addKeys(key, func) {
        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case key:
                    func.call(this.gamemanager);
                    break;
            }
        });
    }

    bind(element, event, callback) {
        element.on(event, callback);
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

    merge(tile1, tile2) {
        this.mergedWith = [tile1, tile2];
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
}

let game = new GameManager(4);
