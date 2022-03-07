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
    }
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
        this.grid_values = [];
        for (let y = 0; y < size; y++) {
            let row = [];
            for (let x = 0; x < size; x++) {
                row.push(new Tile(y, x, 0));
            }
            this.grid_values.push(row);
        }
    }
    
}

class Tile {
    constructor(x, y, value) {
        this.pos = { x: x, y: y };
        this.value = value;
    }

    set(value) {
        this.value = value;
    }
}

var game = new GameManager(4);
