var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

const draw_board = (ctx) => {
    ctx.fillStyle = "white";
    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            if ((i + j) % 2 == 0) {
                ctx.fillRect(i * 80, j * 80, 80, 80);
            }
        }
    }
    ctx.fillStyle = "rgb(60, 100, 60)";
    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            if ((i + j) % 2 == 1) {
                ctx.fillRect(i * 80, j * 80, 80, 80);
            }
        }
    }

}

draw_board(ctx);

let fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

const expand_fen = (fen) => {
    let expanded_fen = "";
    for (let i = 0; i < fen.length; i++) {
        let c = fen.charAt(i);
        if (c >= "1" && c <= "8") {
            for (let j = 0; j < parseInt(c); j++) {
                expanded_fen += "1";
            }
        } else {
            expanded_fen += c;
        }
    }
    return expanded_fen;
}

const condence_fen = (expanded_fen) => {
    let fen = "";
    let count = 0;
    for (let i = 0; i < expanded_fen.length; i++) {
        let c = expanded_fen.charAt(i);
        if (c == "1") {
            count++;
        } else {
            if (count > 0) {
                fen += count;
                count = 0;
            }
            fen += c;
        }
    }
    if (count > 0) {
        fen += count;
    }
    return fen;
}

console.log(expand_fen(fen));

const draw_pieces = (ctx, fen) => {
    let x = 0;
    let y = 0;
    for (let i = 0; i < fen.length; i++) {
        let c = fen.charAt(i);
        if (c == "/") {
            x = 0;
            y++;
        } else if (c >= "1" && c <= "8") {
            x += parseInt(c);
        } else {
            let img = document.getElementById(c);
            ctx.drawImage(img, x * 80 +1, y * 80 +1, 78, 78);
            x++;
        }
    }
}


const move = (from, to, expanded_fen) => {
    let fen_arr = expanded_fen.split("/");
    let from_x = from.charCodeAt(0) - "a".charCodeAt(0);
    let from_y = 8 - parseInt(from.charAt(1));
    let to_x = to.charCodeAt(0) - "a".charCodeAt(0);
    let to_y = 8 - parseInt(to.charAt(1));
    let piece = fen_arr[from_y].charAt(from_x);
    fen_arr[from_y] = fen_arr[from_y].substring(0, from_x) + "1" + fen_arr[from_y].substring(from_x + 1);
    fen_arr[to_y] = fen_arr[to_y].substring(0, to_x) + piece + fen_arr[to_y].substring(to_x + 1);
    expanded_fen = fen_arr.join("/");
    fen = condence_fen(expanded_fen);
    draw_board(ctx);
    draw_pieces(ctx, fen);
}

draw_pieces(ctx, fen);

let from = "";
let from_bool = false;
document.addEventListener("click", (e) => {
    if (from_bool == true) {
        let x = Math.floor((e.clientX - document.getElementById("canvas").getBoundingClientRect().x)  / 80);
        let y = Math.floor((e.clientY - document.getElementById("canvas").getBoundingClientRect().y)  / 80);
        let invalid_cordinate = (x < 0) || (x > 7) || (y < 0) || (y > 7);
        if (invalid_cordinate) {
            return;
        }
        let to = String.fromCharCode("a".charCodeAt(0) + x) + (8 - y);
        if (validate_move(from, to, expand_fen(fen)) == true) {
            move(from, to, expand_fen(fen));
            console.log("VALID MOVE", fen);
        }
        from_bool = false;
        from = "";
        document.getElementsByClassName("peice_selection_indicator")[0].style.backgroundColor = "rgb(255, 20, 20)";
        return;
    }

    let x = Math.floor((e.clientX - document.getElementById("canvas").getBoundingClientRect().x)  / 80);
    let y = Math.floor((e.clientY - document.getElementById("canvas").getBoundingClientRect().y)  / 80);
    let invalid_cordinate = (x < 0) || (x > 7) || (y < 0) || (y > 7);
    if (invalid_cordinate) {
        return;
    }
    from = String.fromCharCode("a".charCodeAt(0) + x) + (8 - y);
    from_bool = true;
    document.getElementsByClassName("peice_selection_indicator")[0].style.backgroundColor = "rgb(0, 255, 40)";
    
});

document.addEventListener("keydown", (e) => {
    if (e.key == "Escape") {
        from = "";
        from_bool = false;
        document.getElementsByClassName("peice_selection_indicator")[0].style.backgroundColor = "rgb(255, 20, 20)";
    }
});

const validate_move = (from, to, expanded_fen) => {
    let fen_arr = expanded_fen.split("/");
    let from_x = from.charCodeAt(0) - "a".charCodeAt(0);
    let from_y = 8 - parseInt(from.charAt(1));
    let to_x = to.charCodeAt(0) - "a".charCodeAt(0);
    let to_y = 8 - parseInt(to.charAt(1));
    let piece = fen_arr[from_y].charAt(from_x);
    if (piece == "1") {
        return false;
    }
    if (from_x == to_x && from_y == to_y) {
        console.log("Invalid move: cant move to same position");
        return false;
    }
    if (piece == piece.toUpperCase()) {
        if (fen_arr[to_y].charAt(to_x) != "1" && fen_arr[to_y].charAt(to_x).toUpperCase() == fen_arr[to_y].charAt(to_x)) {
            console.log("Invalid move: Can't capture own piece");
            return false;
        }
    }
    if (piece == piece.toLowerCase()) {
        if (fen_arr[to_y].charAt(to_x) != "1" && fen_arr[to_y].charAt(to_x).toLowerCase() == fen_arr[to_y].charAt(to_x)) {
            console.log("Invalid move: Can't capture own piece");
            return false;
        }
    }
    if (piece == "p") {
        if (from_x == to_x) {
            //Checks for vertical movement
            if (from_y - to_y == -1) {
                if (fen_arr[to_y].charAt(to_x) == "1") {
                    return true;
                }
            } else if (from_y - to_y == -2 && from_y == 1) {
                //Checks for double vertical movement from starting position
                if (fen_arr[to_y -1].charAt(to_x) == "1" && fen_arr[to_y].charAt(to_x) == "1") {
                    return true;
                }
            } else {
                console.log("Invalid move: Can only move one or two steps forward");
            }
        } else {
            //Checks for diagonal movement
            if (Math.abs(from_x - to_x) == 1 && Math.abs(from_y - to_y) == 1) {
                
                if (fen_arr[to_y].charAt(to_x) != "1" && fen_arr[to_y].charAt(to_x).toUpperCase() == fen_arr[to_y].charAt(to_x)) {
                    return true;
                }
            }
        }
        return false;
    }
    if (piece == "P") {
        if (from_x == to_x) {
            // Checks for vertical movement
            if (from_y - to_y == 1) {
                if (fen_arr[to_y].charAt(to_x) == "1") {
                    return true;
                }

            } else if (from_y - to_y == 2 && from_y == 6) {
                //Checks for double vertical movement from starting position

                if (fen_arr[to_y].charAt(to_x) == "1" && fen_arr[to_y +1].charAt(to_x) == "1") {
                    return true;
                }
            }  else {
                console.log("Invalid move: Can only move one or two steps forward");
            }
        } else {
            //Checks for diagonal movement
            if (Math.abs(from_x - to_x) == 1 && Math.abs(from_y - to_y) == 1) {
                if (fen_arr[to_y].charAt(to_x) != "1" && fen_arr[to_y].charAt(to_x).toLowerCase() == fen_arr[to_y].charAt(to_x)) {
                    return true;
                }
            }
        }
        return false;
    }
    if (piece == "r" || piece == "R") {
        if (from_x != to_x && from_y != to_y) {
            console.log("Invalid move: Rooks can only move horizontally or vertically");
            return false;
        }
        if (from_x == to_x) {
            //Checks for vertical movement
            let min = Math.min(from_y, to_y);
            let max = Math.max(from_y, to_y);
            for (let i = min + 1; i < max; i++) {
                if (fen_arr[i].charAt(from_x) != "1") {
                    console.log("Invalid move: cant move through pieces");
                    return false;
                }
            }
        } else if (from_y == to_y) {
            //Checks for horizontal movement
            let min = Math.min(from_x, to_x);
            let max = Math.max(from_x, to_x);
            for (let i = min + 1; i < max; i++) {
                if (fen_arr[from_y].charAt(i) != "1") {
                    console.log("Invalid move: cant move through pieces");
                    return false;
                }
            }
        }
        return true;
    }
    

    if (piece == "b" || piece == "B") {
        if (Math.abs(from_x - to_x) != Math.abs(from_y - to_y)) {
            console.log("Invalid move: Bishops can only move diagonally");
            return false;
        }


        if (from_x - to_x > 0) {
            if (from_y - to_y > 0) {
                let min = Math.min(from_x, to_x);
                let max = Math.max(from_x, to_x);
                for (let i = 1; i < max - min; i++) {
                    if (fen_arr[from_y - i].charAt(from_x - i) != "1") {
                        return false;
                    }
                }
            } else if (from_y - to_y < 0) {
                let min = Math.min(from_x, to_x);
                let max = Math.max(from_x, to_x);
                for (let i = 1; i < max - min; i++) {
                    if (fen_arr[from_y + i].charAt(from_x - i) != "1") {
                        return false;
                    }
                }
            }
        } else if (from_x - to_x < 0) {
            if (from_y - to_y > 0) {
                let min = Math.min(from_x, to_x);
                let max = Math.max(from_x, to_x);
                for (let i = 1; i < max - min; i++) {
                    if (fen_arr[from_y - i].charAt(from_x + i) != "1") {
                        return false;
                    }
                }
            } else if (from_y - to_y < 0) {
                let min = Math.min(from_x, to_x);
                let max = Math.max(from_x, to_x);
                for (let i = 1; i < max - min; i++) {
                    if (fen_arr[from_y + i].charAt(from_x + i) != "1") {
                        return false;
                    }
                }
            }
        }
    }

    if (piece == "n" || piece == "N") {
        if (Math.abs(from_x - to_x) == 2 && Math.abs(from_y - to_y) == 1) {
            return true;
        }
        if (Math.abs(from_x - to_x) == 1 && Math.abs(from_y - to_y) == 2) {
            return true;
        }
        console.log("Invalid move: Knights can only move in L shape");
        return false;
    }

    if (piece == "q" || piece == "Q") {
        if (from_x != to_x && from_y != to_y && Math.abs(from_x - to_x) != Math.abs(from_y - to_y)) {
            console.log("Invalid move: Queens can only move horizontally, vertically or diagonally");
            return false;
        }
        if (from_x == to_x) {
            //Checks for vertical movement
            let min = Math.min(from_y, to_y);
            let max = Math.max(from_y, to_y);
            for (let i = min + 1; i < max; i++) {
                if (fen_arr[i].charAt(from_x) != "1") {
                    console.log("Invalid move: cant move through pieces");
                    return false;
                }
            }
        } else if (from_y == to_y) {
            //Checks for horizontal movement
            let min = Math.min(from_x, to_x);
            let max = Math.max(from_x, to_x);
            for (let i = min + 1; i < max; i++) {
                if (fen_arr[from_y].charAt(i) != "1") {
                    console.log("Invalid move: cant move through pieces");
                    return false;
                }
            }
        } else {
            if (from_x - to_x > 0) {
                if (from_y - to_y > 0) {
                    let min = Math.min(from_x, to_x);
                    let max = Math.max(from_x, to_x);
                    for (let i = 1; i < max - min; i++) {
                        if (fen_arr[from_y - i].charAt(from_x - i) != "1") {
                            console.log("Invalid move: cant move through pieces");
                            return false;
                        }
                    }
                } else if (from_y - to_y < 0) {
                    let min = Math.min(from_x, to_x);
                    let max = Math.max(from_x, to_x);
                    for (let i = 1; i < max - min; i++) {
                        if (fen_arr[from_y + i].charAt(from_x - i) != "1") {
                            console.log("Invalid move: cant move through pieces");
                            return false;
                        }
                    }
                }
            } else if (from_x - to_x < 0) {
                if (from_y - to_y > 0) {
                    let min = Math.min(from_x, to_x);
                    let max = Math.max(from_x, to_x);
                    for (let i = 1; i < max - min; i++) {
                        if (fen_arr[from_y - i].charAt(from_x + i) != "1") {
                            console.log("Invalid move: cant move through pieces");
                            return false;
                        }
                    }
                } else if (from_y - to_y < 0) {
                    let min = Math.min(from_x, to_x);
                    let max = Math.max(from_x, to_x);
                    for (let i = 1; i < max - min; i++) {
                        if (fen_arr[from_y + i].charAt(from_x + i) != "1") {
                            console.log("Invalid move: cant move through pieces");
                            return false;
                        }
                    }
                }
            } 
        }
    }

    if (piece == "k" || piece == "K") {
        if (Math.abs(from_x - to_x) <= 1 && Math.abs(from_y - to_y) <= 1) {
            return true;
        }
        console.log("Invalid move: Kings can only move one step in any direction");
    }
    return true;
}

