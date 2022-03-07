"use strict";
class GameManager {
    constructor(size, HTMLManager, InputManager) {
        this.size = size;
        this.html = new HTMLManager();
        this.input = new InputManager();

        this.setup();
    }

    setup() {
        this.html.createGrid(this.size);

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
        element = $(`<${type}>`)
        element.innerHTML = value;
    }
}

class InputManager {
    constructor() {}
}

class Grid {
    constructor() {}
}

class Tile {
    constructor(x, y, value) {
        this.position = { x: x, y: y };
        this.value = value;
    }
}

var game = new GameManager(4, HTMLManager, InputManager);
