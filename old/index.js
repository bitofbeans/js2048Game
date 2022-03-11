// This should be hosted on a website

function grid_values(grid) {
    var string = "";
    grid.forEach((row) => {
        row.forEach((tile) => {
            string = string.concat(tile.val());
        });
    });
    return string;
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

function add_new_tile(grid) {
    var filledRows = 0; // number of rows with no open space
    grid.forEach((row) => {
        // check for empty spot in row(undefined if none found)
        let colCheck = row.find((col) => col.value === null);
        if (colCheck === undefined) {
            // if no empty spot in row
            filledRows++;
        }
    });
    if (filledRows >= 4) {
        // if grid is filled with tiles
        return grid;
    }

    var row, col; // indexes
    const randomize = () => {
        row = Math.floor(Math.random() * 4); // 0,1,2,3
        col = Math.floor(Math.random() * 4); // 0,1,2,3
    };
    randomize();
    while (grid[row][col].val() != null) {
        // while randomly chosen spot isnt full
        randomize(); // repeats until empty spot found
    }
    grid[row][col].set(Math.floor(Math.random()) * 2 + 2); // set spot to 2 or 4 at random
    grid[row][col].element.css({ transform: "translate(0,-245px)" });
    return grid; // return grid with new tile added
}

/**
 * Moves tile values in the given direction
 * @param {number} dirx => -1, 0, 1, specifies horizontal direction
 * @param {number} diry => -1, 0, 1, specifies vertical direction
 * @param {number[][]} grid => 2D array of tiles
 */
function slide_nums(dirx, diry, grid) {
    var is_pos; // if direction is positive (right or down)
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

    for (let row = 0; row < 4; row++) {
        for (let i = 1; i < 4; i++) {
            let done = false;
            while (!done) {
                let neighbor = grid[y + diry][x + dirx];
                let cell = grid[y][x];
                // Check move
                if (cell.val() == null) {
                    // Do Nothing
                } else if (neighbor.val() == null) {
                    // if it is empty, move
                    cell.anim_move(diry, dirx);
                    grid[y + diry][x + dirx] = cell;
                    neighbor.set(null);
                    grid[y][x] = neighbor;
                } else if (neighbor.val() == cell.val()) {
                    // if it is mergable, merge blocks
                    cell.anim_move(diry, dirx);
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

                cell.style.cssText += `
                visibility: visible;
                background-color: ${color};
                color: ${textColor};
                font-size: ${textSize};
                z-index: ${2048-grid[i][j].val()}
                `;
            }
        }
    }
}

function update(dirx, diry, grid) {
    grid.flat().forEach((tile) => {
        tile.anim_init(); // Initialize animation for each tile
    });
    let tmp_grid = grid_values(grid);
    slide_nums(dirx, diry, grid);
    reset_tile_coords();

    if (tmp_grid !== grid_values(grid)) {
        // if grid has changed by sliding
        add_new_tile(grid);
    }

    grid.flat().forEach((tile) => {
        if (tile.move_cols === 0 && tile.move_rows === 0) {
            // If tile has not moved by sliding
            // move back to default position
            tile.element.css({ transform: "translate(0,-245px)" });
            return;
        }
        tile.animate();
    });
    setTimeout(() => {
        update_nums(grid); // Update grid numbers after animation (100ms)
    }, 100);
}

class Tile {
    constructor(row, col) {
        this.aid = row * col + row - col;
        this.value = null;
        this.row = row;
        this.col = col;
        this.element = $(`#${row}\\:${col}`);
        this.move_rows = 0;
        this.move_cols = 0;
        this.deleted = false;
    }
    set(val) {
        this.value = val;
        this.deleted = true;
    }

    /**
     * 
     * @return {number} Tile value
     */
    val() {
        return this.value;
    }
    anim_init() {
        this.element = $(`#${this.row}\\:${this.col}`); // Get current element
        this.move_rows = 0;
        this.move_cols = 0;
    }
    anim_move(rows, cols) {
        this.move_rows += rows;
        this.move_cols += cols;
        this.row += rows;
        this.col += cols;
    }
    animate() {
        let transformX = 62.5 * this.move_cols;
        let transformY = 62.5 * this.move_rows - 245; // -245 to align with grid
        this.element.css({
            transform: `translate(${transformX}px,${transformY}px)`,
        });
        setTimeout(() => {
            this.element.addClass('notransition'); // Disable transitions
            this.element.css({ transform: "translate(0,-245px)" });
            this.element.removeClass('notransition'); // Re-enable transitions
        }, 100); // Move back after board has been updated
        this.element = $(`#${this.row}\\:${this.col}`); // Retrieve new element
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

.notransition {
    -webkit-transition: none !important;
    -moz-transition: none !important;
    -o-transition: none !important;
    transition: none !important;

}

`;
document.head.appendChild(css);

let game = create_grid();
var grid = [
    [new Tile(0, 0), new Tile(0, 1), new Tile(0, 2), new Tile(0, 3)],
    [new Tile(1, 0), new Tile(1, 1), new Tile(1, 2), new Tile(1, 3)],
    [new Tile(2, 0), new Tile(2, 1), new Tile(2, 2), new Tile(2, 3)],
    [new Tile(3, 0), new Tile(3, 1), new Tile(3, 2), new Tile(3, 3)],
];

grid.flat().forEach((tile) => {
    tile.anim_init();
});

add_new_tile(grid);
add_new_tile(grid);
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

const reset_tile_coords = () => {
    var i = 0;
    var j = 0;
    grid.forEach((row) => {
        j = 0;
        row.forEach((tile) => {
            tile.row = i;
            tile.col = j;
            j++;
        });
        i++;
    });
};
