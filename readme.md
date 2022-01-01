# 2048

### Algorithm on key-press:
```
Each move, the game must take the following steps:
    If a move in that direction is possible:
        Collapse each column in that direction
            Init two variables to 0:
                pos -> The location of the next write, when a cell is written, this is incremented
                val -> The value of the last filled cell
            For each cell in column
                If cell is empty, move on
                Else cell has a value:
                    if val == 0, set val to this value
                    if val == current value, set 2*val at pos and increment pos and set val = 0
                    else (vals don't match), write val at pos, increment pos, and set val to current value.
            After loop, if val has a value, set val at pos and increment pos
            Empty cells from pos onward
        Create new random cell.
            Random pos, normally a 2, but 1 in 10 is a 4.
        Check if game is over
    Else, do nothing.
```
