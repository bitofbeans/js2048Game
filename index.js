// This should be hosted on a website
"use strict";

function grid_values(grid) {
    var string = ""
    grid.forEach(row => {
        row.forEach(tile => {
            string = string.concat(tile.val())
        });
    });
    return string
}

function create_grid() {
    let game_container = $("<div>", { id: "game" });
    let grid_container = $("<div>", { id: "grid-container" });
    let tile_container = $("<div>", { id: "tile-container" });

    for (let i = 0; i < 4; i++) {
        let gridRow = $("<div>", { id: "grid-row", class: `row` });
        let tileRow = $("<div>", { id: "tile-row", class: `${i}-row` });
        for (let j = 0; j < 4; j++) {
            let gridCell = $("<div>", { id: "grid-cell", class: `grid-cell` });
            let tileCell = $("<div>", { id: `${i}:${j}`, class: `tile-cell` });
            gridRow.append(gridCell);
            tileRow.append(tileCell);
        }
        $(grid_container).append(gridRow);
        $(tile_container).append(tileRow);
    }

    $(game_container).append(grid_container);
    $(game_container).append(tile_container);

    $(document.body).append(game_container);

    return game_container;
}

function add_new_spots(grid) {
    // check for open space
    var filledRows = 0;
    grid.forEach((row) => {
        let nullCol = row.find((col) => col.value === null);
        if (!(nullCol instanceof Tile)) {
            // There was no tile in the row that was open
            filledRows++;
        }
    });
    if (filledRows === 4) {
        return grid;
    }

    var row, spot;
    const randomize = () => {
        row = Math.floor(Math.random() * 4); // 0,1,2,3
        spot = Math.floor(Math.random() * 4);
    };
    randomize();
    while (grid[row][spot].val() != null) {
        // Repeat until the chosen point is not filled
        randomize();
    }
    grid[row][spot].set(Math.floor(Math.random()) * 2 + 2); // Random 2 or 4
    return grid;
}

function slide_nums(dirx, diry, grid) {
    grid.flat().forEach(tile => {
        tile.anim_init() // 
    });

    var is_pos;
    if (dirx != 0) {
        var x = dirx == -1 ? 1 : 2;
        var y = 0;
        is_pos = dirx > 0 ? true : false;
    } else {
        var x = 0;
        var y = diry == -1 ? 1 : 2;
        is_pos = diry > 0 ? true : false;
    }
    var edgex = x;
    var edgey = y;
    var cameFrom = {};

    for (let row = 0; row < 4; row++) {
        for (let i = 1; i < 4; i++) {
            let done = false;
            while (!done) {
                let neighbor = grid[y + diry][x + dirx];
                let cell = grid[y][x];
                // Check move
                if (neighbor.val() == null) {
                    // if it is empty, move
                    cell.anim_move(diry,dirx)
                    grid[y + diry][x + dirx] = cell;
                    neighbor.set(null);
                    grid[y][x] = neighbor;
                } else if (neighbor.val() == cell.val()) {
                    // if it is mergable, merge blocks
                    cell.anim_move(diry,dirx)
                    cell.set(cell.val() * 2);
                    grid[y + diry][x + dirx] = cell;
                    neighbor.set(null);
                    grid[y][x] = neighbor;
                }

                // Check if we have reached the edge
                if (dirx != 0) {
                    // if moving horizontally
                    if (x === edgex) {
                        done = true;

                        x = is_pos ? 3 - (i + 1) : i + 1;
                        continue;
                    }
                } else {
                    // if moving vertically
                    if (y === edgey) {
                        // and
                        done = true;

                        y = is_pos ? 3 - (i + 1) : i + 1;
                        continue;
                    }
                }

                x += dirx;
                y += diry;
            }
        }
        if (dirx != 0) {
            // if moving horizontally
            x = dirx == -1 ? 1 : 2;
            y++;
        } else {
            // if moving vertically
            x++;
            var y = diry == -1 ? 1 : 2;
        }
    }

    grid.flat().forEach(tile => {
        tile.animate()
    });
}

function update_nums(grid) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let cell = document.getElementById(`${i}:${j}`);
            if (grid[i][j].val() == null) {
                cell.innerText = "⠀";
                cell.style = `
                visibility: hidden;
                `;
            } else {
                cell.innerText = grid[i][j].val();

                var textColor = "#776e65";
                var textSize = "24px";

                {
                    if (cell.innerHTML == "2") {
                        var color = `rgb(238 228 218)`;
                    }
                    if (cell.innerHTML == "4") {
                        var color = `rgb(237 224 200)`;
                    }
                    if (cell.innerHTML == "8") {
                        var color = `rgb(242 177 121)`;
                    }
                    if (cell.innerHTML == "16") {
                        var color = `rgb(245 149 99)`;
                        var textColor = `#f9f6f2`;
                    }
                    if (cell.innerHTML == "32") {
                        var color = `rgb(246 124 95)`;
                        var textColor = `#f9f6f2`;
                    }
                    if (cell.innerHTML == "64") {
                        var color = `rgb(246 94 59)`;
                        var textColor = `#f9f6f2`;
                    }
                    if (cell.innerHTML == "128") {
                        var color = `rgb(237 207 114)`;
                    }
                    if (cell.innerHTML == "256") {
                        var color = `rgb(237 204 97)`;
                    }
                    if (cell.innerHTML == "512") {
                        var color = `rgb(237 200 80)`;
                    }
                    if (cell.innerHTML == "1024") {
                        var color = `rgb(37 197 63)`;
                        var textSize = "20px";
                    }
                    if (cell.innerHTML == "2048") {
                        var color = `rgb(237 194 46)`;
                        var textSize = "20px";
                    }
                }

                cell.style = `
                visibility: visible;
                background-color: ${color};
                color: ${textColor};
                font-size: ${textSize};
                `;

            }
        }
    }
}

function update(dirx, diry, grid) {
    let tmp_grid = grid_values(grid);
    slide_nums(dirx, diry, grid);
    if (tmp_grid !== grid_values(grid)) {
        // if grid has changed by sliding
        add_new_spots(grid);
    }
    update_nums(grid);
    return grid;
}

class Tile {
    constructor(row, col) {
        this.value = null;
        this.row = row
        this.col = col
        this.element = $(`#${row}\\:${col}`)
        this.deleted = false
    }

    set(val) {
        this.value = val;
        this.deleted = true
    }

    val() {
        return this.value;
    }

    anim_init() {
        this.element = $(`#${this.row}\\:${this.col}`)
        this.move_rows = 0
        this.move_cols = 0
        this.deleted = false

    }

    anim_move(rows, cols) {
        this.move_rows += rows
        this.move_cols += cols
        this.row += rows
        this.col += cols
    }
    

    animate() {
        // animate
        this.element.css({
            "visibility": "visible"
        })
        this.element.animate({
            left: `+=${62.5*this.move_cols}`,
            top: `+=${62.5*this.move_rows}`
            
        }, 300)
        if (this.deleted) {
            console.log(this.move_cols);
            console.log(this.move_cols);
        }
        this.element = $(`#${this.row}\\:${this.col}`)

    }
}
//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//
//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//
//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//

let css = document.createElement("style");
css.innerHTML = `
@font-face {
    font-family: 'Sora_bold';
    font-style: normal;
    font-weight: 600;
    src: url(https://fonts.gstatic.com/s/sora/v9/xMQOuFFYT72X5wkB_18qmnndmSeMmU-NKQI.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

body {
    /* Remove these 2 later*/
    text-align: center;
    line-height: 57.5px;
}

#game {
    margin: auto;
    padding: 10px;
    background-color: #bbada0;
    width: 245px;
    height: 245px;
    border-radius: 5px;
    gap: 5px;
} 

#grid-row, #tile-row {
    margin-bottom: 5px;
    height: 57.5px;
}
#grid-row:last-child, #tile-row:last-child {
    margin-bottom: 0px;
}

.grid-cell, .tile-cell {
    margin-right: 5px;
    background: rgba(238, 228, 218, 0.35);
    border-radius: 4px;
    width: 57.5px;
    height: 57.5px;
    display: inline-block;
    transition-property: left, top, transform;
    transition-duration: 250ms, 250ms, 100ms;
    transform: scale(1);
    font-family: Sora_bold;
    position: relative;
}

.grid-cell:last-child,
.tile-cell:last-child {
    margin-right: 0px;
}

.tile-cell {

    transform: translate(0, -245px);
    z-index: 2;
}

`;
document.head.appendChild(css);

let game = create_grid();
var grid = [
    [new Tile(0,0), new Tile(0,1), new Tile(0,2), new Tile(0,3)],
    [new Tile(1,0), new Tile(1,1), new Tile(1,2), new Tile(1,3)],
    [new Tile(2,0), new Tile(2,1), new Tile(2,2), new Tile(2,3)],
    [new Tile(3,0), new Tile(3,1), new Tile(3,2), new Tile(3,3)],
];



add_new_spots(grid);
add_new_spots(grid);
update_nums(grid);

document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowLeft":
            update(-1, 0, grid);
            break;
        case "ArrowRight":
            update(1, 0, grid);
            break;
        case "ArrowUp":
            update(0, -1, grid);
            break;
        case "ArrowDown":
            update(0, 1, grid);
            break;
    }
});
