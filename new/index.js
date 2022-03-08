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
    }

    addRandomTile() {}
}

class HTMLManager {
    addCSStoElement(element, style) {
        $(element).css(style);
    }

    createGrid(size) {
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

    createElement(type, value) {
        element = $(`<${type}>`);
        element.innerHTML = value;
        return element;
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
        for (var row = 0; row < size; row++) {
            for (var col = 0; col < size; col++) {
                callback({ row: row, col: col }, this.tiles[row][col]);
            }
        }
    }

    getAvailableTiles() {
        // Return an array of all available tile coords
        let tiles = [];

        this.forEachTile((row, col, tile) => {
            if (tile === null) {
                tiles.push({ row: row, col: col });
            }
        });

        return tiles;
    }

    getRandomTile() {
        // Gets a random available tile
        let availableTiles = this.getAvailableTiles();

        if (availableTiles.length > 0) {
            let randomIndex = Math.floor(Math.random() * availableTiles.length); // One random tile
            return availableTiles[randomIndex];
        }
    }

    addRandomTile() {
        if (Math.random < 0.9) {
            let value = 2;
        } else {
            let value = 4;
        }

        let tile = new Tile(this.getRandomTile(), value);
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
    }

    set(value) {
        this.value = value;
    }
}

var game = new GameManager(4);
