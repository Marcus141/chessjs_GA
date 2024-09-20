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

const hypothetical_move = (from, to, expanded_fen) => {
    let fen_arr = expanded_fen.split("/");
    let from_x = from.charCodeAt(0) - "a".charCodeAt(0);
    let from_y = 8 - parseInt(from.charAt(1));
    let to_x = to.charCodeAt(0) - "a".charCodeAt(0);
    let to_y = 8 - parseInt(to.charAt(1));
    let piece = fen_arr[from_y].charAt(from_x);
    fen_arr[from_y] = fen_arr[from_y].substring(0, from_x) + "1" + fen_arr[from_y].substring(from_x + 1);
    fen_arr[to_y] = fen_arr[to_y].substring(0, to_x) + piece + fen_arr[to_y].substring(to_x + 1);
    expanded_fen = fen_arr.join("/");
    return condence_fen(expanded_fen);
}

draw_pieces(ctx, fen);


let from = "";
document.addEventListener("click", (e) => {
    if (from != "") {
        let x = Math.floor((e.clientX - document.getElementById("canvas").getBoundingClientRect().x)  / 80);
        let y = Math.floor((e.clientY - document.getElementById("canvas").getBoundingClientRect().y)  / 80);
        let invalid_cordinate = (x < 0) || (x > 7) || (y < 0) || (y > 7);
        if (invalid_cordinate) return;


        let to = String.fromCharCode("a".charCodeAt(0) + x) + (8 - y);
        if (get_legal_moves(from, expand_fen(fen)).includes(to)) {
            
            // Remove castling rights if king or rook moves
            if (expand_fen(fen).split(" ")[0].split("/")[8 - parseInt(from.charAt(1))].charAt(from.charCodeAt(0) - "a".charCodeAt(0)) == "K") {
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
            if (expand_fen(fen).split(" ")[0].split("/")[8 - parseInt(from.charAt(1))].charAt(from.charCodeAt(0) - "a".charCodeAt(0)) == "k") {
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
            if (expand_fen(fen).split(" ")[0].split("/")[8 - parseInt(from.charAt(1))].charAt(from.charCodeAt(0) - "a".charCodeAt(0)) == "R" && from == "a1") {
                fen = fen.split(" ")[0] + " " + 
                fen.split(" ")[1] + " " + 
                fen.split(" ")[2].replace("Q", fen.split(" ")[2].length == 1 ? "-":"") + " " + 
                fen.split(" ")[3] + " " + 
                fen.split(" ")[4] + " " + 
                fen.split(" ")[5];
            }
            if (expand_fen(fen).split(" ")[0].split("/")[8 - parseInt(from.charAt(1))].charAt(from.charCodeAt(0) - "a".charCodeAt(0)) == "R" && from == "h1") {
                fen = fen.split(" ")[0] + " " + 
                fen.split(" ")[1] + " " + 
                fen.split(" ")[2].replace("K", fen.split(" ")[2].length == 1 ? "-":"") + " " +
                fen.split(" ")[3] + " " + 
                fen.split(" ")[4] + " " + 
                fen.split(" ")[5];
            }
            if (expand_fen(fen).split(" ")[0].split("/")[8 - parseInt(from.charAt(1))].charAt(from.charCodeAt(0) - "a".charCodeAt(0)) == "r" && from == "a8") {
                fen = fen.split(" ")[0] + " " + 
                fen.split(" ")[1] + " " + 
                fen.split(" ")[2].replace("q", fen.split(" ")[2].length == 1 ? "-":"") + " " + 
                fen.split(" ")[3] + " " + 
                fen.split(" ")[4] + " " + 
                fen.split(" ")[5];
            }
            if (expand_fen(fen).split(" ")[0].split("/")[8 - parseInt(from.charAt(1))].charAt(from.charCodeAt(0) - "a".charCodeAt(0)) == "r" && from == "h8") {
                fen = fen.split(" ")[0] + " " + 
                fen.split(" ")[1] + " " + 
                fen.split(" ")[2].replace("k", fen.split(" ")[2].length == 1 ? "-":"") + " " + 
                fen.split(" ")[3] + " " + 
                fen.split(" ")[4] + " " + 
                fen.split(" ")[5];
            }
            // Reset half-move clock if pawn moves or captures
            if (expand_fen(fen).split(" ")[0].split("/")[8 - parseInt(from.charAt(1))].charAt(from.charCodeAt(0) - "a".charCodeAt(0)).toLowerCase() == "p" ||
            expand_fen(fen).split(" ")[0].split("/")[8 - parseInt(to.charAt(1))].charAt(to.charCodeAt(0) - "a".charCodeAt(0)) != "1") {
                expand_fen(fen).split(" ")[4] = "0"; // Reset half-move clock
            }
            let piece = expand_fen(fen).split(" ")[0].split("/")[8 - parseInt(from.charAt(1))].charAt(from.charCodeAt(0) - "a".charCodeAt(0));
            if      ( piece == "K" && from == "e1" && to == "g1") {move("h1", "f1", expand_fen(fen));} 
            else if ( piece == "K" && from == "e1" && to == "c1") {move("a1", "d1", expand_fen(fen));} 
            else if ( piece == "k" && from == "e8" && to == "g8") {move("h8", "f8", expand_fen(fen));} 
            else if ( piece == "k" && from == "e8" && to == "c8") {move("a8", "d8", expand_fen(fen));}

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

    from = String.fromCharCode("a".charCodeAt(0) + x) + (8 - y);

    // Check if from square is occupied by a piece of the correct color
    let piece = expand_fen(fen).split(" ")[0].split("/")[8 - parseInt(from.charAt(1))].charAt(from.charCodeAt(0) - "a".charCodeAt(0));
    if (piece == piece.toUpperCase() && expand_fen(fen).split(" ")[1] == "b") {
        from = "";
        return;
    }
    if (piece == piece.toLowerCase() && expand_fen(fen).split(" ")[1] == "w") {
        from = "";
        return;
    }
    // Check if from square is empty
    if (expand_fen(fen).split(" ")[0].split("/")[8 - parseInt(from.charAt(1))].charAt(from.charCodeAt(0) - "a".charCodeAt(0)) == "1") {
        from = "";
        return;
    }
    if (get_legal_moves(from, expand_fen(fen)).length == 0) {
        from = "";
        return;
    }
    for (square of get_legal_moves(from, expand_fen(fen))) {
        let x = square.charCodeAt(0) - "a".charCodeAt(0);
        let y = 8 - parseInt(square.charAt(1));
        ctx.fillStyle = "rgba(0, 255, 40, 0.5)";
        ctx.fillRect(x * 80, y * 80, 80, 80);
    }
    console.log("FROM", from);
    document.getElementsByClassName("peice_selection_indicator")[0].style.backgroundColor = "rgb(0, 255, 40)";
    
});

document.addEventListener("keydown", (e) => {
    if (e.key == "Escape") {
        from = "";
        from_bool = false;
        document.getElementsByClassName("peice_selection_indicator")[0].style.backgroundColor = "rgb(255, 20, 20)";
    }
});
const get_all_legal_moves = (expanded_fen) => {
    // Get all legal moves from each players pieces
    let fen_arr = expanded_fen.split(" ")[0].split("/");
    let turn = expanded_fen.split(" ")[1];
    let legal_moves = {};
    for (let i = 0; i < fen_arr.length; i++) {
        for (let j = 0; j < fen_arr[i].length; j++) {
            let piece = fen_arr[i].charAt(j);
            if ((turn == "w" && piece == piece.toUpperCase() && piece != "1")) {
                let square = String.fromCharCode("a".charCodeAt(0) + j) + (8 - i);
                legal_moves[square] = get_legal_moves(square, expanded_fen);
            }
            if ((turn == "b" && piece == piece.toLowerCase() && piece != "1")) {
                let square = String.fromCharCode("a".charCodeAt(0) + j) + (8 - i);
                legal_moves[square] = get_legal_moves(square, expanded_fen);
            }
        }
    }
    return legal_moves;
}

const get_legal_moves = (from, expanded_fen) => {
    let fen_arr = expanded_fen.split(" ")[0].split("/");
    let from_x = from.charCodeAt(0) - "a".charCodeAt(0);
    let from_y = 8 - parseInt(from.charAt(1));
    let piece = fen_arr[from_y].charAt(from_x);
    let turn = expanded_fen.split(" ")[1];
    let castling_rights = expanded_fen.split(" ")[2];
    let en_passant_target = expanded_fen.split(" ")[3];
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
                        legal_moves.push(String.fromCharCode("a".charCodeAt(0) + x) + (8 - y));
                    } 
                    break; // Stop after forward move
                } else {
                    // Diagonal capture
                    if (target_piece != '1' && ((piece == 'P' && target_piece == target_piece.toLowerCase()) || (piece == 'p' && target_piece == target_piece.toUpperCase()))) {
                        legal_moves.push(String.fromCharCode("a".charCodeAt(0) + x) + (8 - y));
                    }
                    break; // Stop after diagonal move
                }
            } else {
                // Handle other pieces
                if (target_piece == "1" || (piece == piece.toUpperCase() && target_piece == target_piece.toLowerCase()) || (piece == piece.toLowerCase() && target_piece == target_piece.toUpperCase())) {
                    legal_moves.push(String.fromCharCode("a".charCodeAt(0) + x) + (8 - y));
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
    // Handle double pawn moves
    if (piece == 'P' && from_y == 6 && fen_arr[5].charAt(from_x) == '1' && fen_arr[4].charAt(from_x) == '1') {
        legal_moves.push(String.fromCharCode("a".charCodeAt(0) + from_x) + 4); // White double pawn move
    } else if (piece == 'p' && from_y == 1 && fen_arr[2].charAt(from_x) == '1' && fen_arr[3].charAt(from_x) == '1') {
        legal_moves.push(String.fromCharCode("a".charCodeAt(0) + from_x) + 5); // Black double pawn move
    }
    

    // Handle castling
    
        if (piece.toUpperCase() == 'K') {
            if (turn == 'w' && from == 'e1') {
                if (castling_rights.includes('K') && fen_arr[7].substring(5, 7) == '11' && !is_under_attack('e1', expanded_fen) && !is_under_attack('f1', expanded_fen) && !is_under_attack('g1', expanded_fen)) {
                    legal_moves.push('g1'); // White kingside castling
                }
                if (castling_rights.includes('Q') && fen_arr[7].substring(1, 4) == '111' && !is_under_attack('e1', expanded_fen) && !is_under_attack('d1', expanded_fen) && !is_under_attack('c1', expanded_fen)) {
                    legal_moves.push('c1'); // White queenside castling
                }
            } else if (turn == 'b' && from == 'e8') {
                if (castling_rights.includes('k') && fen_arr[0].substring(5, 7) == '11' && !is_under_attack('e8', expanded_fen) && !is_under_attack('f8', expanded_fen) && !is_under_attack('g8', expanded_fen)) {
                    legal_moves.push('g8'); // Black kingside castling
                }
                if (castling_rights.includes('q') && fen_arr[0].substring(1, 4) == '111' && !is_under_attack('e8', expanded_fen) && !is_under_attack('d8', expanded_fen) && !is_under_attack('c8', expanded_fen)) {
                    legal_moves.push('c8'); // Black queenside castling
                }
            }
        }

    // Handle en passant
    if (piece.toUpperCase() == 'P') {
        let en_passant_x = en_passant_target.charCodeAt(0) - "a".charCodeAt(0);
        let en_passant_y = 8 - parseInt(en_passant_target.charAt(1));

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
                if (is_under_attack(move, expanded_fen)) {
                    legal_moves = legal_moves.filter((value) => value != move);
                }
            }
        }
        if (turn == "b") {
            for (let move of legal_moves) {
                if (is_under_attack(move, expanded_fen)) {
                    legal_moves = legal_moves.filter((value) => value != move);
                }
            }
        }
    }

    // Remove moves that put the king in check
    for (let move of legal_moves) {
        if (is_in_check(expand_fen(hypothetical_move(from, move, expanded_fen)))) {
            legal_moves = legal_moves.filter((value) => value != move);
        }
    }

    return legal_moves;
};

const get_movement_pattern = (square, expanded_fen) => {
    let from_x = square.charCodeAt(0) - "a".charCodeAt(0);
    let from_y = 8 - parseInt(square.charAt(1));

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
            if (expanded_fen.split(" ")[0].split("/")[y].charAt(x) != "1") {
                for (let k = j + 1; k < movement_pattern[i].length; k++) {
                    movement_pattern[i][k] = null;
                }
            }
        }
    }
    return movement_pattern;
}

const is_under_attack = (square, expanded_fen) => {
    let fen_arr = expanded_fen.split(" ")[0].split("/");
    let from_x = square.charCodeAt(0) - "a".charCodeAt(0);
    let from_y = 8 - parseInt(square.charAt(1));
    let turn = expanded_fen.split(" ")[1];
    
    let movement_pattern = get_movement_pattern(square, expanded_fen);

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

const is_in_check = (expanded_fen) => {
    let fen_arr = expanded_fen.split(" ")[0].split("/");
    let turn = expanded_fen.split(" ")[1];
    let king_square = "";
    for (let i = 0; i < fen_arr.length; i++) {
        for (let j = 0; j < fen_arr[i].length; j++) {
            let piece = fen_arr[i].charAt(j);
            if (turn == "w" && piece == "K") {
                king_square = String.fromCharCode("a".charCodeAt(0) + j) + (8 - i);
            }
            if (turn == "b" && piece == "k") {
                king_square = String.fromCharCode("a".charCodeAt(0) + j) + (8 - i);
            }
        }
    }
    return is_under_attack(king_square, expanded_fen);
}

const is_checkmate = (expanded_fen) => {
    // check if king is still in check after all possible moves
    let turn = expanded_fen.split(" ")[1];
    
    let all_legal_moves = Object.entries(get_all_legal_moves(expanded_fen));
    
    for (let i = 0; i < all_legal_moves.length; i++) {
        if (all_legal_moves[i][1].length == 0) {
            continue;
        }
        
        for (let j = 0; j < all_legal_moves[i][1].length; j++) {
            
            let hypothetical_fen = expand_fen(hypothetical_move(all_legal_moves[i][0], all_legal_moves[i][1][j], expanded_fen));
            let fen_arr = expand_fen(hypothetical_fen).split(" ")[0].split("/");
            let king_square = "";
            for (let i = 0; i < fen_arr.length; i++) {
                for (let j = 0; j < fen_arr[i].length; j++) {
                    let piece = fen_arr[i].charAt(j);
                    if (turn == "w" && piece == "K") {
                        king_square = String.fromCharCode("a".charCodeAt(0) + j) + (8 - i);
                    }
                    if (turn == "b" && piece == "k") {
                        king_square = String.fromCharCode("a".charCodeAt(0) + j) + (8 - i);
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

