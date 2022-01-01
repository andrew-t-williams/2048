
const score_indicator = document.getElementById("score")
const highscore_indicator = document.getElementById("highscore")

const settings_button = document.getElementById("settings")
const back_button = document.getElementById("back")
const restart_button = document.getElementById("restart")

const canvas = document.getElementById('game');
const context = canvas.getContext('2d')

var score, highscore, settings, grid, last_grid

// Opens links in new tab
$("a").each(function () {
    $(this).attr('target', '_blank')
    $(this).attr('rel', 'noopener noreferrer')
})

initGame()

function initGame() {
    $.getJSON("/assets/json/settings.json", function (json) {
        score = 0
        highscore = 0
        settings = json
        grid = initGrid(settings.grid_size.classic)
        context.fillStyle = settings.grid_background
        context.fillRect(0, 0, canvas.width, canvas.height)
        for (var k = 0; k < settings.grid_size.classic / 2; k++) {
            generateRandomCell()
        }
        drawGrid()
        document.onkeydown = checkKey
    })
}

function initGrid(size) {
    var columns = new Array(size)
    for (var i = 0; i < size; i++) {
        columns[i] = new Array(size)
        columns[i].fill(0)
    }
    return columns;
}

function drawGrid() {
    score = 0
    for (var i = 0; i < settings.grid_size.classic; i++) {
        for (var j = 0; j < settings.grid_size.classic; j++) {
            var cell_value = grid[i][j]
            score += cell_value
            drawCell(i, j, cell_value)
        }
    }
    score_indicator.innerText = score
    if (score > highscore) {
        highscore = score
        highscore_indicator.innerText = highscore
    }
}

function checkKey(e) {
    e = e || window.event;
    var direction = ''
    if (e.keyCode == '38') {
        direction = 'up'
    } else if (e.keyCode == '40') {
        direction = 'down'
    } else if (e.keyCode == '37') {
        direction = 'left'
    } else if (e.keyCode == '39') {
        direction = 'right'
    }
    if (canMove(direction)) {
        back_button.disabled = false
        last_grid = copyGrid(grid)
        collapseGrid(direction)
        generateRandomCell()
        drawGrid()
        checkDeath()
    }
}

function copyGrid(grid) {
    var columns = new Array(grid.length)
    for (var i = 0; i < grid.length; i++) {
        columns[i] = new Array(grid.length)
        for (var j = 0; j < grid.length; j++) {
            columns[i][j] = grid[i][j]
        }
    }
    return columns;
}

function canMove(direction) {
    if (direction == 'up') {
        for (var i = 0; i < settings.grid_size.classic; i++) {
            var val = 0
            for (var j = settings.grid_size.classic - 1; j >= 0; j--) {
                if (grid[i][j] > 0) {
                    if (val == grid[i][j]) {
                        return true
                    }
                    val = grid[i][j]
                } else if (val > 0) {
                    return true
                }
            }
        }
    } else if (direction == 'down') {
        for (var i = 0; i < settings.grid_size.classic; i++) {
            var val = 0
            for (var j = 0; j < settings.grid_size.classic; j++) {
                if (grid[i][j] > 0) {
                    if (val == grid[i][j]) {
                        return true
                    }
                    val = grid[i][j]
                } else if (val > 0) {
                    return true
                }
            }
        }
    } else if (direction == 'left') {
        for (var j = 0; j < settings.grid_size.classic; j++) {
            var val = 0
            for (var i = settings.grid_size.classic - 1; i >= 0; i--) {
                if (grid[i][j] > 0) {
                    if (val == grid[i][j]) {
                        return true
                    }
                    val = grid[i][j]
                } else if (val > 0) {
                    return true
                }
            }
        }

    } else if (direction == 'right') {
        for (var j = 0; j < settings.grid_size.classic; j++) {
            var val = 0
            for (var i = 0; i < settings.grid_size.classic; i++) {
                if (grid[i][j] > 0) {
                    if (val == grid[i][j]) {
                        return true
                    }
                    val = grid[i][j]
                } else if (val > 0) {
                    return true
                }
            }
        }
    }
    return false
}

function collapseGrid(direction) {
    if (direction == 'up') {
        for (var i = 0; i < settings.grid_size.classic; i++) {
            var pos = 0
            var val = 0
            for (var j = 0; j < settings.grid_size.classic; j++) {
                if (grid[i][j] == 0) {
                    continue
                } else {
                    if (val == 0) {
                        val = grid[i][j]
                    } else if (val == grid[i][j]) {
                        grid[i][pos] = 2 * val
                        pos += 1
                        val = 0
                    } else {
                        grid[i][pos] = val
                        pos += 1
                        val = grid[i][j]
                    }
                }
            }
            if (val != 0) {
                grid[i][pos] = val
                pos += 1
            }
            for (k = pos; k < settings.grid_size.classic; k++) {
                grid[i][k] = 0
            }
        }
    } else if (direction == 'down') {
        for (var i = 0; i < settings.grid_size.classic; i++) {
            var pos = settings.grid_size.classic - 1
            var val = 0
            for (var j = settings.grid_size.classic - 1; j >= 0; j--) {
                if (grid[i][j] == 0) {
                    continue
                } else {
                    if (val == 0) {
                        val = grid[i][j]
                    } else if (val == grid[i][j]) {
                        grid[i][pos] = 2 * val
                        pos -= 1
                        val = 0
                    } else {
                        grid[i][pos] = val
                        pos -= 1
                        val = grid[i][j]
                    }
                }
            }
            if (val != 0) {
                grid[i][pos] = val
                pos -= 1
            }
            for (k = pos; k >= 0; k--) {
                grid[i][k] = 0
            }
        }
    } else if (direction == 'left') {
        for (var j = 0; j < settings.grid_size.classic; j++) {
            var pos = 0
            var val = 0
            for (var i = 0; i < settings.grid_size.classic; i++) {
                if (grid[i][j] == 0) {
                    continue
                } else {
                    if (val == 0) {
                        val = grid[i][j]
                    } else if (val == grid[i][j]) {
                        grid[pos][j] = 2 * val
                        pos += 1
                        val = 0
                    } else {
                        grid[pos][j] = val
                        pos += 1
                        val = grid[i][j]
                    }
                }
            }
            if (val != 0) {
                grid[pos][j] = val
                pos += 1
            }
            for (k = pos; k < settings.grid_size.classic; k++) {
                grid[k][j] = 0
            }
        }
    } else if (direction == 'right') {
        for (var j = 0; j < settings.grid_size.classic; j++) {
            var pos = settings.grid_size.classic - 1
            var val = 0
            for (var i = settings.grid_size.classic - 1; i >= 0; i--) {
                if (grid[i][j] == 0) {
                    continue
                } else {
                    if (val == 0) {
                        val = grid[i][j]
                    } else if (val == grid[i][j]) {
                        grid[pos][j] = 2 * val
                        pos -= 1
                        val = 0
                    } else {
                        grid[pos][j] = val
                        pos -= 1
                        val = grid[i][j]
                    }
                }
            }
            if (val != 0) {
                grid[pos][j] = val
                pos -= 1
            }
            for (k = pos; k >= 0; k--) {
                grid[k][j] = 0
            }
        }
    }
}

function generateRandomCell() {
    var empties = []
    for (var i = 0; i < settings.grid_size.classic; i++) {
        for (var j = 0; j < settings.grid_size.classic; j++) {
            if (grid[i][j] == 0) {
                empties.push([i, j])
            }
        }
    }
    var random_index = Math.floor(Math.random() * empties.length)
    var random_cell = empties[random_index]
    var random_value = (Math.floor(Math.random() * settings.probability_of_four) == 0 ? 4 : 2)
    grid[random_cell[0]][random_cell[1]] = random_value
}

function checkDeath() {
    if (canMove('up') || canMove('down') || canMove('right') || canMove('left')) {
        return
    } else {
        document.getElementById('game_over').style.display = "block";
    }
}

function drawCell(x, y, number) {
    const CELL_WIDTH = canvas.width / settings.grid_size.classic
    const CELL_HEIGHT = canvas.height / settings.grid_size.classic
    var x_px = (x * CELL_WIDTH) + (settings.cell_spacing / 2)
    var y_px = (y * CELL_HEIGHT) + (settings.cell_spacing / 2)
    var width = CELL_WIDTH - settings.cell_spacing
    var height = CELL_HEIGHT - settings.cell_spacing
    context.fillStyle = settings.cell_colour[(number ? number : "null")]
    roundRect(context, x_px, y_px, width, height, settings.curve_radius, true, false)

    if (number) {
        context.fillStyle = "black"
        context.font = "30px Arial";
        context.textAlign = "center";
        context.fillText(number, x_px + (width / 2), y_px + (height / 2) + 10);
    }
}

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object 
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
        var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}

settings_button.onclick = function () {
    console.log("settings")
}

back_button.onclick = function () {
    if (last_grid) {
        grid = last_grid
        drawGrid()
        back_button.disabled = true
    }
}

restart_button.onclick = function () {
    grid = initGrid(settings.grid_size.classic)
    last_grid = null
    back_button.disabled = true
    for (var k = 0; k < settings.grid_size.classic / 2; k++) {
        generateRandomCell()
    }
    drawGrid()
}