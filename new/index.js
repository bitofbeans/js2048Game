"use strict";
class GameManager {
    constructor(size) {
        this.size = size;
        this.html = new HTMLManager();
        this.input = new InputManager();

        this.setup();
    }

    setup() {
        this.html.createGrid(this.size);

        this.grid = new Grid(this.size);
        this.gameover = false;
        this.win = false;
        this.score = 0;

        this.grid.addRandomTileToGrid();
        this.grid.addRandomTileToGrid();


        this.html.update(this.grid.tiles);

        console.log(this.grid.tiles);

        setTimeout(() => {
            this.slide(this.grid.tiles[0], "left");
            this.slide(this.grid.tiles[1], "left");
            this.slide(this.grid.tiles[2], "left");
            this.slide(this.grid.tiles[3], "left");

            this.html.update(this.grid.tiles);
            console.log(this.grid.tiles);
        }, 1000);
    }

    slide(row, direction) {
        var dirx, diry;
        if (direction === "left") {
            [dirx, diry] = [-1, 0];
        } else if (direction === "right") {
            [dirx, diry] = [1, 0];
        } else if (direction === "up") {
            [dirx, diry] = [0, -1];
        } else if (direction === "down") {
            [dirx, diry] = [0, 1];
        }

        // row = [null, 2, 2, 2]
        // row = [
        //     null,
        //     new Tile({ row: 0, col: 1 }, 2),
        //     new Tile({ row: 0, col: 2 }, 2),
        //     new Tile({ row: 0, col: 3 }, 2),
        // ];

        for (let i = 0; i < 4; i++) {
            if (row[i] === null) continue; // skip empty tiles
            // else
            for (let j = i; j > 0; j--) {
                // Start index at i, move left until edge
                let leftIndex = j - 1;
                let tilePos = row[j].getPos();
                if (row[leftIndex] === null) {
                    row[j].move({ row: row[j].row + diry, col: row[j].col + dirx });
                    this.grid.insertTile(row[j]);
                    this.grid.removeTile(tilePos);
                }
            }
        }

        return row;
    }
}

class HTMLManager {
    update(grid) {
        // We are going to be deleting the tiles and readding them seamlessly
        // so we don't have to track the tile elements long term

        // Wait for the window to be updated
        window.requestAnimationFrame(() => {
            $(".tile-container").empty(); // Removes all child nodes

            grid.forEach((column) => {
                column.forEach((tile) => {
                    // Null means there is no tile there
                    if (tile != null) {
                        this.createTileElement(tile);
                    }
                });
            });
        });
    }

    addCSStoElement(element, style) {
        $(element).css(style);
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

        $(game_container).append(grid_container);
        $(game_container).append(tile_container);

        $(document.body).append(game_container);
    }

    createElement(type, value, classes = null) {
        let element = $(`<${type}>`);
        element.text(value);
        if (classes) {
            classes.forEach((cssClass) => element.addClass(cssClass));
        }
        return element;
    }

    createTileElement(tile) {
        let tileElement = this.createElement("div", tile.value);

        let cssRow = tile.oldRow ? tile.oldRow + 1 : tile.row + 1;
        let cssCol = tile.oldCol ? tile.oldCol + 1 : tile.col + 1;
        let classes = [`tile`, `tile-${tile.value}`, `tile-pos-${cssRow}-${cssCol}`];

        if (tile.getOldPos()) {
            // If the tile has an old position
            // On the next frame, move the tile's position to where it should be
            window.requestAnimationFrame(() => {
                // Since the tile has been placed at the previous position, we need to
                // change its position back to where it is supposed to be
                this.replacePosClass(tileElement, tile);
            });
        } else if (tile.mergedWith != undefined) {
            this.createTileElement(tile.mergedWith); // Create merged tile to show merge animation
        }

        $(tileElement).addClass(classes);
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
    on(key, callback) {
        document.addEventListener(key, callback);
    }

    bind(element, event, callback) {
        element.addEventListener(event, callback);
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
}

class Tile {
    constructor(position, value) {
        this.row = position.row;
        this.col = position.col;
        this.value = value;
        this.move({ row: this.row, col: this.col });
    }

    setValue(value) {
        this.value = value;
    }

    move(position) {
        if (this.oldRow == undefined) {
            this.oldRow = this.row;
            this.oldCol = this.col;
        }
        this.row = position.row;
        this.col = position.col;
    }

    merge(tile) {
        this.mergedWith = tile;
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
