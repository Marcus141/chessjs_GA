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
const p = document.getElementById("pawn")

draw_board(ctx);

let fen = "8/pppppppp/8/8/8/8/PPPPPPPP/8";

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
            ctx.drawImage(img, x * 80 +5, y * 80 +5, 70, 70);
            x++;
        }
    }
}
draw_pieces(ctx, fen);

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
        console.log(x,y)
        move(from, to, expand_fen(fen));
        console.log(from,to)
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
    console.log(from)
});

document.addEventListener("keydown", (e) => {
    if (e.key == "Escape") {
        from = "";
        from_bool = false;
        document.getElementsByClassName("peice_selection_indicator")[0].style.backgroundColor = "rgb(255, 20, 20)";
    }
});