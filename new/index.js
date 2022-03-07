"use strict";
class GameManager {
    constructor(size, HTMLManager, InputManager) {
        this.size = size;
        this.htmlManager = new HTMLManager();
        this.inputManager = new InputManager();

        this.setup();
    }

    setup() {
        this.htmlManager.createGrid(this.size);
        this.htmlManager.addCSS(`
        
        .game-container {
            font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;
            margin: 0 auto;
            position: relative;
            padding: 7px;
            width: 221px;
            height: 221px;
            border-radius: 3px;
            background-color: #bbada0;
            display: block;
        }

        .grid-row {
            margin-bottom: 7px;
            height: 50px;
        }
        .grid-row:last-child {
            margin-bottom: 0;
        }
        .grid-cell {
            background-color: rgba(238, 228, 218, 0.35);
            margin-right: 7px;
            width: 50px;
            height: 50px;
            float: left;
            border-radius: 3px
        }
        .grid-cell:last-child {
            margin-right: 0px;
        }
        `);
    }
}

class HTMLManager {
    constructor() {}

    addCSS(style) {
        $(document.head).append(`<style>${style}</style>`);
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
