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

let fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0";

const expand_fen = (fen) => {
    let expanded_fen = "";
    let fen_arr = fen.split(" ")[0].split("/");
    for (let i = 0; i < fen_arr.length; i++) {
        let row = fen_arr[i];
        let expanded_row = "";
        for (let j = 0; j < row.length; j++) {
            let c = row.charAt(j);
            if (c >= "1" && c <= "8") {
                for (let k = 0; k < parseInt(c); k++) {
                    expanded_row += "1";
                }
            } else {
                expanded_row += c;
            }
        }
        expanded_fen += expanded_row;
        if (i < fen_arr.length - 1) {
            expanded_fen += "/";
        }
    }
    return expanded_fen + " " + fen.split(" ")[1] + " " + fen.split(" ")[2] + " " + fen.split(" ")[3] + " " + parseInt(fen.split(" ")[4]) + " " + parseInt(fen.split(" ")[5]);
}
console.log(expand_fen(fen));

const condence_fen = (expanded_fen) => {
    expanded_fen = expanded_fen.split(" ");
    let fen = "";
    let count = 0;
    for (let i = 0; i < expanded_fen[0].length; i++) {
        let c = expanded_fen[0].charAt(i);
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
    return fen + " " + expanded_fen[1] + " " + expanded_fen[2] + " " + expanded_fen[3] + " " + parseInt(expanded_fen[4]) + " " + parseInt(expanded_fen[5]);
}

console.log(condence_fen(expand_fen(fen)));

const draw_pieces = (ctx, fen) => {
    let x = 0;
    let y = 0;
    for (let i = 0; i < fen.split(" ")[0].length; i++) {
        let c = fen.charAt(i);
        if (c == "/") {
            x = 0;
            y++;
        } else if (c >= "1" && c <= "8") {
            x += parseInt(c);
        } else {
            let img = document.getElementById(c);
            ctx.drawImage(img, x * 80, y * 80, 80, 80);
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
document.addEventListener("click", (e) => {
    if (from != "") {
        let x = Math.floor((e.clientX - document.getElementById("canvas").getBoundingClientRect().x)  / 80);
        let y = Math.floor((e.clientY - document.getElementById("canvas").getBoundingClientRect().y)  / 80);
        let invalid_cordinate = (x < 0) || (x > 7) || (y < 0) || (y > 7);
        if (invalid_cordinate) {return;}


        let to = String.fromCharCode("a".charCodeAt(0) + x) + (8 - y);
        if (validate_move(from, to, expand_fen(fen)) == true) {
            // Remove castling rights if king or rook moves
            if (expand_fen(fen).split(" ")[0].split("/")[8 - parseInt(from.charAt(1))].charAt(from.charCodeAt(0) - "a".charCodeAt(0)) == "K") {
                fen = fen.split(" ")[0] + " " + fen.split(" ")[1] + " " + fen.split(" ")[2].replace("K", fen.split(" ")[2].length == 1 ? "-":"") + " " + fen.split(" ")[3] + " " + fen.split(" ")[4] + " " + fen.split(" ")[5];
                fen = fen.split(" ")[0] + " " + fen.split(" ")[1] + " " + fen.split(" ")[2].replace("Q", fen.split(" ")[2].length == 1 ? "-":"") + " " + fen.split(" ")[3] + " " + fen.split(" ")[4] + " " + fen.split(" ")[5];
            }
            if (expand_fen(fen).split(" ")[0].split("/")[8 - parseInt(from.charAt(1))].charAt(from.charCodeAt(0) - "a".charCodeAt(0)) == "k") {
                fen = fen.split(" ")[0] + " " + fen.split(" ")[1] + " " + fen.split(" ")[2].replace("k", fen.split(" ")[2].length == 1 ? "-":"") + " " + fen.split(" ")[3] + " " + fen.split(" ")[4] + " " + fen.split(" ")[5];
                fen = fen.split(" ")[0] + " " + fen.split(" ")[1] + " " + fen.split(" ")[2].replace("q", fen.split(" ")[2].length == 1 ? "-":"") + " " + fen.split(" ")[3] + " " + fen.split(" ")[4] + " " + fen.split(" ")[5];
            }
            if (expand_fen(fen).split(" ")[0].split("/")[8 - parseInt(from.charAt(1))].charAt(from.charCodeAt(0) - "a".charCodeAt(0)) == "R" && from == "a1") {
                fen = fen.split(" ")[0] + " " + fen.split(" ")[1] + " " + fen.split(" ")[2].replace("Q", fen.split(" ")[2].length == 1 ? "-":"") + " " + fen.split(" ")[3] + " " + fen.split(" ")[4] + " " + fen.split(" ")[5];
            }
            if (expand_fen(fen).split(" ")[0].split("/")[8 - parseInt(from.charAt(1))].charAt(from.charCodeAt(0) - "a".charCodeAt(0)) == "R" && from == "h1") {
                fen = fen.split(" ")[0] + " " + fen.split(" ")[1] + " " + fen.split(" ")[2].replace("K", fen.split(" ")[2].length == 1 ? "-":"") + " " + fen.split(" ")[3] + " " + fen.split(" ")[4] + " " + fen.split(" ")[5];
            }
            if (expand_fen(fen).split(" ")[0].split("/")[8 - parseInt(from.charAt(1))].charAt(from.charCodeAt(0) - "a".charCodeAt(0)) == "r" && from == "a8") {
                fen = fen.split(" ")[0] + " " + fen.split(" ")[1] + " " + fen.split(" ")[2].replace("q", fen.split(" ")[2].length == 1 ? "-":"") + " " + fen.split(" ")[3] + " " + fen.split(" ")[4] + " " + fen.split(" ")[5];
            }
            if (expand_fen(fen).split(" ")[0].split("/")[8 - parseInt(from.charAt(1))].charAt(from.charCodeAt(0) - "a".charCodeAt(0)) == "r" && from == "h8") {
                fen = fen.split(" ")[0] + " " + fen.split(" ")[1] + " " + fen.split(" ")[2].replace("k", fen.split(" ")[2].length == 1 ? "-":"") + " " + fen.split(" ")[3] + " " + fen.split(" ")[4] + " " + fen.split(" ")[5];
            }
            // Reset half-move clock if pawn moves or captures
            if (expand_fen(fen).split(" ")[0].split("/")[8 - parseInt(from.charAt(1))].charAt(from.charCodeAt(0) - "a".charCodeAt(0)).toLowerCase() == "p" ||
            expand_fen(fen).split(" ")[0].split("/")[8 - parseInt(to.charAt(1))].charAt(to.charCodeAt(0) - "a".charCodeAt(0)) != "1") {
                expand_fen(fen).split(" ")[4] = "0"; // Reset half-move clock
            }

            move(from, to, expand_fen(fen));

            // Toggle turn and increment full-move number
            let fen_parts = fen.split(" ");
            fen_parts[4] = (parseInt(fen_parts[4]) + 1).toString(); // Increment half-move clock
            if (fen_parts[1] == "b") {
                fen_parts[5] = (parseInt(fen_parts[5]) + 1).toString(); // Increment full-move number on black move
            }
            fen_parts[1] = fen_parts[1] == "w" ? "b" : "w"; // Toggle turn
            
            
            
            
            fen = fen_parts.join(" ");
            console.log("VALID MOVE", fen);
            
            // Check for draw by 50 move rule
            if (fen_parts[4] == "100") {
                console.log("DRAW: 50 move rule");
                return;
            }
        }
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
    if (expand_fen(fen).split(" ")[0].split("/")[8 - parseInt(from.charAt(1))].charAt(from.charCodeAt(0) - "a".charCodeAt(0)) == "1") {
        from = "";
        return;
    }	
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
    let fen_arr = expanded_fen.split(" ")[0].split("/");
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
        if (expanded_fen.split(" ")[1] == "b") {
            console.log("Invalid move: Its black's turn");
            return false
        }
        if (fen_arr[to_y].charAt(to_x) != "1" && fen_arr[to_y].charAt(to_x).toUpperCase() == fen_arr[to_y].charAt(to_x)) {
            console.log("Invalid move: Can't capture own piece");
            return false;
        }
    }
    if (piece == piece.toLowerCase()) {
        if (expanded_fen.split(" ")[1] == "w") {
            console.log("Invalid move: Its white's turn");
            return false    
        }
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
        if (piece == "k") {
            if (to == "g8" && fen_arr[0].charAt(6) == "1" && fen_arr[0].charAt(5) == "1" && expanded_fen.split(" ")[2].includes("k")) {
                move("h8", "f8", expanded_fen);
                return true;
            }
            if (to == "c8" && fen_arr[0].charAt(1) == "1" && fen_arr[0].charAt(2) == "1" && fen_arr[0].charAt(3) == "1" && expanded_fen.split(" ")[2].includes("q")) {
                move("a8", "d8", expanded_fen);
                return true;
            }
        }
        if (piece == "K") {
            if (to == "g1" && fen_arr[7].charAt(6) == "1" && fen_arr[7].charAt(5) == "1" && expanded_fen.split(" ")[2].includes("K")) {
                move("h1", "f1", expanded_fen);
                return true;
            }
            if (to == "c1" && fen_arr[7].charAt(1) == "1" && fen_arr[7].charAt(2) == "1" && fen_arr[0].charAt(3) == "1" && expanded_fen.split(" ")[2].includes("Q")) {
                move("a1", "d1", expanded_fen);
                return true;
            }
        }
        console.log("Invalid move: Kings can only move one step in any direction");
        return false;
    }
    return true;
}

