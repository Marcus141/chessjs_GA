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


const move = (from, to, fen_) => {
    let expanded_fen = expand_fen(fen_);
    let fen_arr = expanded_fen.split("/");
    let from_x = from.charCodeAt(0) - "a".charCodeAt(0);
    let from_y = square_to_cord(from)[1];
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

const hypothetical_move = (from, to, fen) => {
    let expanded_fen = expand_fen(fen);
    let fen_arr = expanded_fen.split("/");
    let from_x = from.charCodeAt(0) - "a".charCodeAt(0);
    let from_y = square_to_cord(from)[1];
    let to_x = to.charCodeAt(0) - "a".charCodeAt(0);
    let to_y = 8 - parseInt(to.charAt(1));
    let piece = fen_arr[from_y].charAt(from_x);
    fen_arr[from_y] = fen_arr[from_y].substring(0, from_x) + "1" + fen_arr[from_y].substring(from_x + 1);
    fen_arr[to_y] = fen_arr[to_y].substring(0, to_x) + piece + fen_arr[to_y].substring(to_x + 1);
    expanded_fen = fen_arr.join("/");
    return condence_fen(expanded_fen);
}

draw_pieces(ctx, fen);

class GloblaState {
    constructor( ) {
        this.cursorX = 0;
        this.cursorY = 0;
        this.move = "";
        this.moveQueue = [];
        this.isRunning = true;
        this.currentTime = performance.now(),
        this.deltaTime;
        this.targetFps = 60;
        this.frameInterval = 1000 / 60;
        this.lastFrameTime = 0;
        this.player = prompt("Enter player name");
    }
}
const state1 = new GloblaState();


document.addEventListener("mousemove", (e) => {
    state1.cursorX = e.clientX;
    state1.cursorY = e.clientY;
})

document.addEventListener("click", (e) => {
    let turn = fen.split(" ")[1];

    // if the move is empty, add the first square to the move
    if (state1.move.length == 0) {
        let x = Math.floor((state1.cursorX - document.getElementById("canvas").getBoundingClientRect().x)  / 80);
        let y = Math.floor((state1.cursorY - document.getElementById("canvas").getBoundingClientRect().y)  / 80);

        if ((x < 0) || (x > 7) || (y < 0) || (y > 7)) {
            state1.move = "";
            return;
        };
        let from = cord_to_square(x, y);
        if (piece_at(from, fen) == "1") {
            state1.move = "";
            return;
        }
        if (turn == "w") {
            if (is_black_piece(from, fen)) {
                state1.move = "";
                return;
            }
        }
        if (turn == "b") {
            if (is_white_piece(from, fen)) {
                state1.move = "";
                return;
            }
        }

        state1.move = cord_to_square(x, y);
        console.log(state1.move);
        return;
    }
    // if the "from" part of the move is already selected, select the "to" part
    if (state1.move.length == 2) {
        let x = Math.floor((state1.cursorX - document.getElementById("canvas").getBoundingClientRect().x)  / 80);
        let y = Math.floor((state1.cursorY - document.getElementById("canvas").getBoundingClientRect().y)  / 80);
        if ((x < 0) || (x > 7) || (y < 0) || (y > 7)) {
            state1.move = "";
            return;
        };
        let to = cord_to_square(x, y);
        if (piece_at(to, fen) !="1" && is_same_color(cord_to_square(x, y), state1.move, fen)) {
            state1.move = "";
            return;
        }
        
        // Check if move is legal
        if (get_all_legal_moves(fen)[state1.move].includes(to)) {
            state1.move += cord_to_square(x, y);
            console.log(state1.move);
            state1.moveQueue.push(state1.move);
            state1.move = "";
            return;
        }
    }
})

const update = () => {

    state1.currentTime = performance.now();
    state1.deltaTime = (state1.currentTime - state1.lastFrameTime)/1000;

    console.log(state1.move);

    if (state1.moveQueue.length > 0) {
        let from = state1.moveQueue[0].substring(0, 2);
        let to = state1.moveQueue[0].substring(2, 4);

        if (get_legal_moves(from, fen).includes(to)) {
            move(from, to, fen);
            state1.moveQueue.shift();

            
        }
        state1.moveQueue.shift();
    }

    state1.lastFrameTime = state1.currentTime;
}


function animate() {
    setTimeout(() => {
        if (state1.isRunning) requestAnimationFrame(animate);
        update();
    }, state1.frameInterval);
}
animate();


let from = "";
document.addEventListener("click", (e) => {
    if (from != "") {


        let x = Math.floor((e.clientX - document.getElementById("canvas").getBoundingClientRect().x)  / 80);
        let y = Math.floor((e.clientY - document.getElementById("canvas").getBoundingClientRect().y)  / 80);
        let invalid_cordinate = (x < 0) || (x > 7) || (y < 0) || (y > 7);
        if (invalid_cordinate) return;


        let to = cord_to_square(x, y);
        if (get_legal_moves(from, expand_fen(fen)).includes(to)) {

            

            
            // Remove castling rights if king or rook moves
            if (expand_fen(fen).split(" ")[0].split("/")[square_to_cord(from)[1]].charAt(square_to_cord(from)[0]) == "K") {
                fen = fen.split(" ")[0] + " " + 
                fen.split(" ")[1] + " " + 
                fen.split(" ")[2].replace("K", fen.split(" ")[2].length == 1 ? "-":"") + " " + 
                fen.split(" ")[3] + " " + 
                fen.split(" ")[4] + " " + 
                fen.split(" ")[5];
                fen = fen.split(" ")[0] + " " + 
                fen.split(" ")[1] + " " + 
                fen.split(" ")[2].replace("Q", fen.split(" ")[2].length == 1 ? "-":"") + " " + 
                fen.split(" ")[3] + " " + 
                fen.split(" ")[4] + " " + 
                fen.split(" ")[5];
            }
            if (expand_fen(fen).split(" ")[0].split("/")[square_to_cord(from)[1]].charAt(square_to_cord(from)[0]) == "k") {
                fen = fen.split(" ")[0] + " " + 
                fen.split(" ")[1] + " " + 
                fen.split(" ")[2].replace("k", fen.split(" ")[2].length == 1 ? "-":"") + " " + 
                fen.split(" ")[3] + " " + 
                fen.split(" ")[4] + " " + 
                fen.split(" ")[5];
                fen = fen.split(" ")[0] + " " + 
                fen.split(" ")[1] + " " + 
                fen.split(" ")[2].replace("q", fen.split(" ")[2].length == 1 ? "-":"") + " " + 
                fen.split(" ")[3] + " " + 
                fen.split(" ")[4] + " " + 
                fen.split(" ")[5];
            }
            if (piece_at(from, fen) == "R" && from == "a1") {
                fen = fen.split(" ")[0] + " " + 
                fen.split(" ")[1] + " " + 
                fen.split(" ")[2].replace("Q", fen.split(" ")[2].length == 1 ? "-":"") + " " + 
                fen.split(" ")[3] + " " + 
                fen.split(" ")[4] + " " + 
                fen.split(" ")[5];
            }
            if (piece_at(from, fen) == "R" && from == "h1") {
                fen = fen.split(" ")[0] + " " + 
                fen.split(" ")[1] + " " + 
                fen.split(" ")[2].replace("K", fen.split(" ")[2].length == 1 ? "-":"") + " " +
                fen.split(" ")[3] + " " + 
                fen.split(" ")[4] + " " + 
                fen.split(" ")[5];
            }
            if (piece_at(from, fen) == "r" && from == "a8") {
                fen = fen.split(" ")[0] + " " + 
                fen.split(" ")[1] + " " + 
                fen.split(" ")[2].replace("q", fen.split(" ")[2].length == 1 ? "-":"") + " " + 
                fen.split(" ")[3] + " " + 
                fen.split(" ")[4] + " " + 
                fen.split(" ")[5];
            }
            if (piece_at(from, fen) == "r" && from == "h8") {
                fen = fen.split(" ")[0] + " " + 
                fen.split(" ")[1] + " " + 
                fen.split(" ")[2].replace("k", fen.split(" ")[2].length == 1 ? "-":"") + " " + 
                fen.split(" ")[3] + " " + 
                fen.split(" ")[4] + " " + 
                fen.split(" ")[5];
            }
            // Reset half-move clock if pawn moves or captures
            if (piece_at(from, fen) == "p" || piece_at(to, fen) != "1") {
                expand_fen(fen).split(" ")[4] = "0"; // Reset half-move clock
            }
            let piece = expand_fen(fen).split(" ")[0].split("/")[square_to_cord(from)[1]].charAt(square_to_cord(from)[0]);
            if      ( piece == "K" && from == "e1" && to == "g1") {move("h1", "f1", fen);} 
            else if ( piece == "K" && from == "e1" && to == "c1") {move("a1", "d1", fen);} 
            else if ( piece == "k" && from == "e8" && to == "g8") {move("h8", "f8", fen);} 
            else if ( piece == "k" && from == "e8" && to == "c8") {move("a8", "d8", fen);}

            let en_passant_occured = piece.toLowerCase() == "p" && from.charCodeAt(0) != to.charCodeAt(0) && piece_at(to, fen) == "1"

            move(from, to, fen);

            // Removes pawn after en passant capture
            if (en_passant_occured) {
                if (fen.split(" ")[1] == "w") {
                    move(from, String.fromCharCode(to.charCodeAt(0)) + (parseInt(to.charAt(1)) - 1), fen);
                }
                if (fen.split(" ")[1] == "b") {
                    move(from, String.fromCharCode(to.charCodeAt(0)) + (parseInt(to.charAt(1)) + 1), fen);
                }

            }

            // Clear en passant target square
            fen = fen.split(" ")[0] + " " + fen.split(" ")[1] + " " + fen.split(" ")[2] + " " + "-" + " " + fen.split(" ")[4] + " " + fen.split(" ")[5];
            // Adds en passant target square for double pawn moves
            if (piece.toLowerCase() == "p" && from.charCodeAt(0) == to.charCodeAt(0) && Math.abs(parseInt(from.charAt(1)) - parseInt(to.charAt(1))) == 2) {
                if (fen.split(" ")[1] == "w") { fen = fen.split(" ")[0] + " " + fen.split(" ")[1] + " " + fen.split(" ")[2] + " " + String.fromCharCode(to.charCodeAt(0)) + (parseInt(to.charAt(1)) - 1) + " " + fen.split(" ")[4] + " " + fen.split(" ")[5]; }
                if (fen.split(" ")[1] == "b") { fen = fen.split(" ")[0] + " " + fen.split(" ")[1] + " " + fen.split(" ")[2] + " " + String.fromCharCode(to.charCodeAt(0)) + (parseInt(to.charAt(1)) + 1) + " " + fen.split(" ")[4] + " " + fen.split(" ")[5]; }
            }


            // Toggle turn and increment full-move number
            let fen_parts = fen.split(" ");
            fen_parts[4] = (parseInt(fen_parts[4]) + 1).toString(); // Increment half-move clock
            if (fen_parts[1] == "b") {
                fen_parts[5] = (parseInt(fen_parts[5]) + 1).toString(); // Increment full-move number on black move
            }
            fen_parts[1] = fen_parts[1] == "w" ? "b" : "w"; // Toggle turn

            fen = fen_parts.join(" ");
            console.log("VALID MOVE", fen);

            if (is_checkmate(expand_fen(fen))) {
                console.log("CHECKMATE");
                return;
            }
            
            // Check for draw by 50 move rule
            if (fen_parts[4] == "100") {
                console.log("DRAW: 50 move rule");
                return;
            }
        }
        from = "";
        document.getElementsByClassName("peice_selection_indicator")[0].style.backgroundColor = "rgb(255, 20, 20)";
        draw_board(ctx);
        draw_pieces(ctx, fen);
        return;
    }

    let x = Math.floor((e.clientX - document.getElementById("canvas").getBoundingClientRect().x)  / 80);
    let y = Math.floor((e.clientY - document.getElementById("canvas").getBoundingClientRect().y)  / 80);
    let invalid_cordinate = (x < 0) || (x > 7) || (y < 0) || (y > 7);
    if (invalid_cordinate) return;

    from = cord_to_square(x, y);

    // Check if from square is occupied by a piece of the correct color
    let piece = piece_at(from, fen);
    if (piece == piece.toUpperCase() && fen.split(" ")[1] == "b") {
        from = "";
        return;
    }
    if (piece == piece.toLowerCase() && fen.split(" ")[1] == "w") {
        from = "";
        return;
    }
    // Check if from square is empty
    if (piece == "1" ) {
        from = "";
        return;
    }
    if (get_legal_moves(from, fen).length == 0) {
        from = "";
        return;
    }
    for (square of get_legal_moves(from, fen)) {
        let x = square_to_cord(square)[0];
        let y = square_to_cord(square)[1];
        ctx.fillStyle = "rgba(0, 255, 40, 0.5)";
        ctx.fillRect(x * 80, y * 80, 80, 80);
    }
    console.log("FROM", from);
    document.getElementsByClassName("peice_selection_indicator")[0].style.backgroundColor = "rgb(0, 255, 40)";
    
});

const get_all_legal_moves = (fen) => {
    // Get all legal moves from each players pieces
    let fen_arr = expand_fen(fen).split(" ")[0].split("/");
    let turn = fen.split(" ")[1];
    let legal_moves = {};
    for (let i = 0; i < fen_arr.length; i++) {
        for (let j = 0; j < fen_arr[i].length; j++) {
            let piece = piece_at(cord_to_square(j, i), fen);
            if ((turn == "w" && piece == piece.toUpperCase() && piece != "1")) {
                let square = cord_to_square(j, i);
                legal_moves[square] = get_legal_moves(square, fen);
            }
            if ((turn == "b" && piece == piece.toLowerCase() && piece != "1")) {
                let square = cord_to_square(j, i);
                legal_moves[square] = get_legal_moves(square, fen);
            }
        }
    }
    return legal_moves;
}

const get_legal_moves = (from, fen) => {
    let fen_arr = expand_fen(fen).split(" ")[0].split("/");
    let from_x = square_to_cord(from)[0];
    let from_y = square_to_cord(from)[1];
    let piece = fen_arr[from_y].charAt(from_x);
    let turn = expand_fen(fen).split(" ")[1];
    let castling_rights = expand_fen(fen).split(" ")[2];
    let en_passant_target = expand_fen(fen).split(" ")[3];
    let legal_moves = [];


    if (piece == "1") {
        console.log("Invalid piece: No piece at the from position");
        return legal_moves; // No piece at the from position
    }

    // Define possible move directions for each piece type
    const directions = {
        'P': [[-1, -1], [0, -1], [1, -1]], // White pawn
        'p': [[-1, 1], [0, 1], [1, 1]], // Black pawn
        'R': [[0, 1], [1, 0], [0, -1], [-1, 0]], // Rook
        'N': [[-2, -1], [-1, -2], [1, -2], [2, -1], [2, 1], [1, 2], [-1, 2], [-2, 1]], // Knight
        'B': [[-1, -1], [-1, 1], [1, -1], [1, 1]], // Bishop
        'Q': [[0, 1], [1, 0], [0, -1], [-1, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]], // Queen
        'K': [[0, 1], [1, 0], [0, -1], [-1, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]] // King
    };

    // Get the directions for the piece
    let piece_directions;
    if (piece == 'P' || piece == 'p') {
        piece_directions = directions[piece];
    } else {
        piece_directions = directions[piece.toUpperCase()];
    }
    if (!piece_directions) {
        console.log("Invalid piece: No directions for the piece");
        return legal_moves; // Invalid piece
    }
    
    // Generate all possible moves
    for (let dir of piece_directions) {
        let x = from_x + dir[0];
        let y = from_y + dir[1];
        while (x >= 0 && x < 8 && y >= 0 && y < 8) {
            let target_piece = fen_arr[y].charAt(x);
            if (piece == 'P' || piece == 'p') {
                // Handle pawn moves separately
                if (dir[0] == 0) {
                    // Forward move
                    if (target_piece == "1") {
                        legal_moves.push(cord_to_square(x, y));
                    } 
                    break; // Stop after forward move
                } else {
                    // Diagonal capture
                    if (target_piece != '1' && ((piece == 'P' && target_piece == target_piece.toLowerCase()) || (piece == 'p' && target_piece == target_piece.toUpperCase()))) {
                        legal_moves.push(cord_to_square(x, y));
                    }
                    break; // Stop after diagonal move
                }
            } else {
                // Handle other pieces
                if (target_piece == "1" || (piece == piece.toUpperCase() && target_piece == target_piece.toLowerCase()) || (piece == piece.toLowerCase() && target_piece == target_piece.toUpperCase())) {
                    legal_moves.push(cord_to_square(x, y));
                    if (target_piece != "1") break; // Stop if capturing
                } else {
                    break; // Stop if blocked
                }
            }
            if (piece.toUpperCase() == 'N' || piece.toUpperCase() == 'K') break; // Stop for non-sliding pieces
            x += dir[0];
            y += dir[1];
        }
    }
    // Handle doublfen
    if (piece == 'P' && from_y == 6 && fen_arr[5].charAt(from_x) == '1' && fen_arr[4].charAt(from_x) == '1') {
        legal_moves.push(cord_to_square(from_x, 4)); // White double pawn move
    } else if (piece == 'p' && from_y == 1 && fen_arr[2].charAt(from_x) == '1' && fen_arr[3].charAt(from_x) == '1') {
        legal_moves.push(cord_to_square(from_x, 3)); // Black double pawn move
    }
    

    // Handle castling
    
        if (piece.toUpperCase() == 'K') {
            if (turn == 'w' && from == 'e1') {
                if (castling_rights.includes('K') && fen_arr[7].substring(5, 7) == '11' && !is_under_attack('e1', fen) && !is_under_attack('f1', fen) && !is_under_attack('g1', fen)) {
                    legal_moves.push('g1'); // White kingside castling
                }
                if (castling_rights.includes('Q') && fen_arr[7].substring(1, 4) == '111' && !is_under_attack('e1', fen) && !is_under_attack('d1', fen) && !is_under_attack('c1', fen)) {
                    legal_moves.push('c1'); // White queenside castling
                }
            } else if (turn == 'b' && from == 'e8') {
                if (castling_rights.includes('k') && fen_arr[0].substring(5, 7) == '11' && !is_under_attack('e8', fen) && !is_under_attack('f8', fen) && !is_under_attack('g8', fen)) {
                    legal_moves.push('g8'); // Black kingside castling
                }
                if (castling_rights.includes('q') && fen_arr[0].substring(1, 4) == '111' && !is_under_attack('e8', fen) && !is_under_attack('d8', fen) && !is_under_attack('c8', fen)) {
                    legal_moves.push('c8'); // Black queenside castling
                }
            }
        }

    // Handle en passant
    if (piece.toUpperCase() == 'P') {
        let en_passant_x = square_to_cord(en_passant_target)[0];
        let en_passant_y = square_to_cord(en_passant_target)[1];

        if (turn == 'w' && from_y == 3 && en_passant_y == 2 && Math.abs(from_x - en_passant_x) == 1) {
            legal_moves.push(en_passant_target);
        } else if (turn == 'b' && from_y == 4 && en_passant_y == 5 && Math.abs(from_x - en_passant_x) == 1) {
            legal_moves.push(en_passant_target);
        }
    }

    if (legal_moves.length == 0) {
        console.log("No legal moves");
    }
    if (piece.toLowerCase() == "k"){
        if (turn == "w") {
            for (let move of legal_moves) {
                if (is_under_attack(move, fen)) {
                    legal_moves = legal_moves.filter((value) => value != move);
                }
            }
        }
        if (turn == "b") {
            for (let move of legal_moves) {
                if (is_under_attack(move, fen)) {
                    legal_moves = legal_moves.filter((value) => value != move);
                }
            }
        }
    }

    // Remove moves that put the king in check
    for (let move of legal_moves) {
        if (is_in_check(expand_fen(hypothetical_move(from, move, fen)))) {
            legal_moves = legal_moves.filter((value) => value != move);
        }
    }

    return legal_moves;
};

const get_movement_pattern = (square, fen) => {
    let from_x = square_to_cord(square)[0];
    let from_y = square_to_cord(square)[1];

    let movement_pattern = [
        // - - diagonal
        [[-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7]],
        // - 0 horizontal
        [[-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0]],
        // - + diagonal
        [[-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7]],
        // 0 + vertical
        [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7]],
        // + + diagonal
        [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7]],
        // + 0 horizontal
        [[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]],
        // + - diagonal
        [[1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7]],
        // 0 - vertical
        [[0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7]]
    ];

    //filter Moves that are out of bounds
    for (let i = 0; i < movement_pattern.length; i++) {
        for (let j = 0; j < movement_pattern[i].length; j++) {
            let x = from_x + movement_pattern[i][j][0];
            let y = from_y + movement_pattern[i][j][1];
            if (x < 0 || x > 7 || y < 0 || y > 7) {
                movement_pattern[i][j] = null;
            }
        }
    }

    //filter Moves that are blocked
    for (let i = 0; i < movement_pattern.length; i++) {
        for (let j = 0; j < movement_pattern[i].length; j++) {
            if (movement_pattern[i][j] == null) {
                continue;
            }
            let x = from_x + movement_pattern[i][j][0];
            let y = from_y + movement_pattern[i][j][1];
            if (piece_at(cord_to_square(x,y), fen) != "1") {
                for (let k = j + 1; k < movement_pattern[i].length; k++) {
                    movement_pattern[i][k] = null;
                }
            }
        }
    }
    return movement_pattern;
}

const is_under_attack = (square, fen) => {
    let fen_arr = expand_fen(fen).split(" ")[0].split("/");
    let from_x = square_to_cord(square)[0];
    let from_y = square_to_cord(square)[1];
    let turn = expand_fen(fen).split(" ")[1];
    
    let movement_pattern = get_movement_pattern(square, fen);

    for (let i = 0; i < movement_pattern.length; i++) {
        for (let j = 0; j < movement_pattern[i].length; j++) {
            if (movement_pattern[i][j] == null) {
                continue;
            }
            let x = from_x + movement_pattern[i][j][0];
            let y = from_y + movement_pattern[i][j][1];
            let target_piece = fen_arr[y].charAt(x);
            if (target_piece == "1") {
                continue;
            }
            // if bishop or queen attacks square
            if (Math.abs((x - from_x) / (y - from_y)) == 1) {
                if (turn == "w" && "bq".includes(target_piece)) {
                    return true;
                }
                if (turn == "b" && "BQ".includes(target_piece)) {
                    return true;
                }
            }
            // if rook or queen attacks square
            if (x == from_x || y == from_y) {
                if (turn == "w" && "rq".includes(target_piece)) {
                    return true;
                }
                if (turn == "b" && "RQ".includes(target_piece)) {
                    return true;
                }
            }
            // if horse attacks square
            if (Math.abs((x - from_x) / (y - from_y)) == 0.5 || Math.abs((x - from_x) / (y - from_y)) == 2) {
                if (turn == "w" && "n".includes(target_piece)) {
                    return true;
                }
                if (turn == "b" && "N".includes(target_piece)) {
                    return true;
                }
            }
            // if king attacks square
            if (Math.abs(Math.sqrt((x - from_x) ** 2 + (y - from_y) ** 2)) == 1) {
                if (turn == "w" && "k".includes(target_piece)) {
                    return true;
                }
                if (turn == "b" && "K".includes(target_piece)) {
                    return true;
                }
            }
            // if pawn attacks square
            if (turn == "w" && "p".includes(target_piece) && Math.abs(x - from_x) == 1 && y - from_y == -1) {
                return true;
            }
            if (turn == "b" && "P".includes(target_piece) && Math.abs(x - from_x) == 1 && y - from_y == 1) {
                return true;
            }
        }
    }
    return false;
}

const is_in_check = (fen) => {
    let expanded_fen = expand_fen(fen);
    let fen_arr = expanded_fen.split(" ")[0].split("/");
    let turn = expanded_fen.split(" ")[1];
    let king_square = "";
    for (let i = 0; i < fen_arr.length; i++) {
        for (let j = 0; j < fen_arr[i].length; j++) {
            let piece = fen_arr[i].charAt(j);
            if (turn == "w" && piece == "K") {
                king_square = cord_to_square(j, i);
            }
            if (turn == "b" && piece == "k") {
                king_square = cord_to_square(j, i);
            }
        }
    }
    return is_under_attack(king_square, condence_fen(fen));
}

const is_checkmate = (fen) => {
    // check if king is still in check after all possible moves
    let turn = fen.split(" ")[1];
    
    let all_legal_moves = Object.entries(get_all_legal_moves(fen));
    
    for (let i = 0; i < all_legal_moves.length; i++) {
        if (all_legal_moves[i][1].length == 0) {
            continue;
        }
        
        for (let j = 0; j < all_legal_moves[i][1].length; j++) {
            
            let hypothetical_fen = hypothetical_move(all_legal_moves[i][0], all_legal_moves[i][1][j], fen);
            let fen_arr = expand_fen(hypothetical_fen).split(" ")[0].split("/");
            let king_square = "";
            for (let i = 0; i < fen_arr.length; i++) {
                for (let j = 0; j < fen_arr[i].length; j++) {
                    let piece = fen_arr[i].charAt(j);
                    if (turn == "w" && piece == "K") {
                        king_square = cord_to_square(j, i);
                    }
                    if (turn == "b" && piece == "k") {
                        king_square = cord_to_square(j, i);
                    }
                }
            }
            if (!is_under_attack(king_square, hypothetical_fen)) {
                return false;
            }
        }
    }
    return true;
}

const cord_to_square = (x, y) => {
    return String.fromCharCode("a".charCodeAt(0) + x) + (8 - y);
}
const square_to_cord = (square) => {
    return [square.charCodeAt(0) - "a".charCodeAt(0), 8 - parseInt(square.charAt(1))];
}

const piece_at = (square, fen) => {
    return expand_fen(fen).split(" ")[0].split("/")[square_to_cord(square)[1]].charAt(square_to_cord(square)[0]);
}

const is_white_piece = (square, fen) => {
    return piece_at(square, fen) == piece_at(square, fen).toUpperCase();
}
const is_black_piece = (square, fen) => {
    return piece_at(square, fen) == piece_at(square, fen).toLowerCase();
}
const is_same_color = (square1, square2, fen) => {
    return is_black_piece(square1, fen) && is_black_piece(square2, fen) || is_white_piece(square1, fen) && is_white_piece(square2, fen);
}