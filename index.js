// This should be hosted on a website
"use strict";

function create_grid() {
    let game_container = $("<div>", { id: "game" });

    let grid_container = $("<div>", { id: "grid-container" });
    let tile_container = $("<div>", { id: "tile-container" });

    for (let i = 0; i < 4; i++) {
        let gridRow = $("<div>", { id: "grid-row", class: `row` });
        let tileRow = $("<div>", { id: "tile-row", class: `${i}-row` });
        for (let j = 0; j < 4; j++) {
            let gridCell = $("<div>", { id: "grid-cell", class: `cell` });
            let tileCell = $("<div>", { id: "tile-cell", class: `${i}:${j}` });
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
    if (!grid.flat().includes(null)) {return grid;}
    
    var row, spot;
    const randomize = () => {
        row = Math.floor(Math.random() * 4); // 0,1,2,3
        spot = Math.floor(Math.random() * 4);
    }
    randomize()
    while (grid[row][spot] != null) {
        // Repeat until the chosen point is not filled
        randomize()
    }

    grid[row][spot] = Math.floor(Math.random()) * 2 + 2; // Random 2 or 4
    return grid;
}

function slide_nums(dirx, diry, grid) {
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

    for (let row = 0; row < 4; row++) {
        for (let i = 1; i < 4; i++) {
            let done = false;
            while (!done) {
                let neighbor = grid[y + diry][x + dirx];
                let cell = grid[y][x];
                // Check move
                if (neighbor == null) {
                    // if it is empty, move
                    grid[y + diry][x + dirx] = cell;
                    grid[y][x] = null;
                } else if (neighbor == cell) {
                    // if it is mergable, merge blocks
                    grid[y + diry][x + dirx] = cell * 2;
                    grid[y][x] = null;
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
}

function update_nums(grid) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let cell = document.getElementsByClassName(`${i}:${j}`)[0];
            if (grid[i][j] == null) {
                cell.innerText = ".";
            } else {
                cell.innerText = grid[i][j];

            }
        }
    }
}

function update(dirx, diry, grid) {
    let tmp_grid = JSON.stringify(grid);
    slide_nums(dirx, diry, grid);
    if (tmp_grid !== JSON.stringify(grid)) {
        // if grid has changed by sliding
        add_new_spots(grid);
    }
    update_nums(grid);
    return grid;
}

//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//
//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//
//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//

let css = document.createElement("style");
css.innerHTML = `
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
    border-radius: 10px;
    gap: 5px;
} 

#grid-row, #tile-row {
    margin-bottom: 5px;
    height: 57.5px;
}
#grid-row:last-child, #tile-row:last-child {
    margin-bottom: 0px;
}

#grid-cell, #tile-cell {
    margin-right: 5px;
    background: rgba(238, 228, 218, 0.35);
    border-radius: 5px;
    width: 57.5px;
    height: 57.5px;
    display: inline-block;
    transition-property: left, top, transform;
    transition-duration: 250ms, 250ms, 100ms;
    transform: scale(1);
}

#grid-cell:last-child,
#tile-cell:last-child {
    margin-right: 0px;
}

#tile-cell {

    transform: translate(0, -245px);
    z-index: 2;
}

`;
document.head.appendChild(css);

let game = create_grid();
var grid = [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
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
