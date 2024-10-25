
let board;

let onPieceFocus = false;
let fieldOnFocus; // div that piece sits on
let pieceOnFocus; // img element#

let whitesTurn = true;

let whitePawnSwapCounter = "I";
let blackPawnSwapCounter = "I";

let enPassantPawn = null;

/*------castling rights-----*/
let whiteCanCastle = true;
let blackCanCastle = true;

let wKRookMoved = false;
let bKRookMoved = false;

let wQRookMoved = false;
let bQRookMoved = false;

/*--------------------------*/
let chessCheck = true;

let markedMoves = [];

// Thêm biến toàn cục để theo dõi vị trí của vua đang bị chiếu
let checkedKingPosition = null;

let playMode = "h"; // "h" cho human vs human, "c" cho human vs computer

function setupGame() {

    board = [["wrA", "wnB", "wbC", "wq", "wk", "wbF", "wnG", "wrH"],
    ["wpA", "wpB", "wpC", "wpD", "wpE", "wpF", "wpG", "wpH"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["bpA", "bpB", "bpC", "bpD", "bpE", "bpF", "bpG", "bpH"],
    ["brA", "bnB", "bbC", "bq", "bk", "bbF", "bnG", "brH"]
    ];
}



// Hàm hỗ trợ để lấy tên đầy đủ của quân cờ từ ký tự
function getPieceNameFromType(type) {
    switch (type) {
        case 'p': return 'pawn';
        case 'r': return 'rook';
        case 'n': return 'knight';
        case 'b': return 'bishop';
        case 'q': return 'queen';
        case 'k': return 'king';
        default: return '';
    }
}

function setHumanMode() {
    let humanButton = document.getElementById("humanMode");
    let comButton = document.getElementById("computerMode");
    let gameModeDisplay = document.getElementById("gameMode");
    let humanControls = document.getElementById("human");
    let computerControls = document.getElementById("computer");

    playMode = "h";
    humanButton.style.backgroundColor = "#e68540"; // Màu cam
    comButton.style.backgroundColor = "#4D7EA8"; // Màu xanh
    gameModeDisplay.textContent = "Chế độ: Người đấu Người";
    
    humanControls.style.display = "block";
    computerControls.style.display = "none";
    
    console.log("Chế độ chơi: Người đấu Người");
}

function setComputerMode() {
    let humanButton = document.getElementById("humanMode");
    let comButton = document.getElementById("computerMode");
    let gameModeDisplay = document.getElementById("gameMode");
    let humanControls = document.getElementById("human");
    let computerControls = document.getElementById("computer");
    let moveCounter = document.getElementById("moveCounter");

    if (playMode != "c") {
        playMode = "c";
        humanButton.style.backgroundColor = "#4D7EA8";
        comButton.style.backgroundColor = "#e68540";
        gameModeDisplay.innerHTML = "Chế độ: Người đấu Máy";
        moveCounter.style.display = "none";
        
        humanControls.style.display = "none";
        computerControls.style.display = "block";
        
        console.log("Chế độ chơi: Người đấu Máy");
    } else {
        console.log("Bạn đã ở chế độ Người đấu Máy");
    }
}

function movePiece(newField) {

    newField = newField.parentElement;

    if (markedMoves.includes(newField.id)) {

        // get position object of new piece position
        let newFieldPosition = fieldIdToBoardPosition(newField.id);

        /* -------visually remove catched Piece-------*/
        if (newField.classList.contains("catch")) {

            // get piece that is about to be catched from board
            let catchedPiece = board[newFieldPosition.row]
            [newFieldPosition.col];

            // delete ctached piece from dom
            let catchedPieceEm = document.getElementById(catchedPiece);
            catchedPieceEm.remove();
        }

        /* ---------moving visual piece img--------*/
        // get positioning classes of piece to move
        let pieceRow = pieceOnFocus.classList[1];
        let pieceCol = pieceOnFocus.classList[2];

        // remove positioning classes of piece to move
        pieceOnFocus.classList.remove(pieceRow);
        pieceOnFocus.classList.remove(pieceCol);

        // get positioning classes of new piece position
        let newPieceRow = newField.classList[2];
        let newPieceCol = newField.classList[3];

        // add the positioning classes of new position to piece
        pieceOnFocus.classList.add(newPieceRow);
        pieceOnFocus.classList.add(newPieceCol);


        /*-----------handle pawn promotion----*/
        // get piece position object of piece to move
        let piecePositionOnBoard = givePosition(board, pieceOnFocus.id);

        if (getPieceType(pieceOnFocus.id) == "wp" && newField.id.startsWith("8")) {

            pieceOnFocus.id = "wq" + whitePawnSwapCounter;
            pieceOnFocus.src = "image/w_queen.png";

            // increase pawn swap counter to avoid same ids
            whitePawnSwapCounter = whitePawnSwapCounter + "I";

        } else if (getPieceType(pieceOnFocus.id) == "bp" && newField.id.startsWith("1")) {

            pieceOnFocus.id = "bq" + blackPawnSwapCounter;
            pieceOnFocus.src = "image/b_queen.png";

            // increase pawn swap counter to avoid same ids
            blackPawnSwapCounter = blackPawnSwapCounter + "I";
        }

        /*------ check if its was castling move and rook has to be moved-----*/
        if (pieceOnFocus.id === "wk" && whiteCanCastle) {
            if (newField.id === "1G") {

                // move rook visually
                let wKRook = document.getElementById("wrH");

                let pieceRow = wKRook.classList[1];
                let pieceCol = wKRook.classList[2];

                wKRook.classList.remove(pieceRow);
                wKRook.classList.remove(pieceCol);

                wKRook.classList.add("row1");
                wKRook.classList.add("colF");

                // move rook on state board
                board[0][5] = "wrH";
                board[0][7] = "";

            } else if (newField.id === "1C") {

                // move rook visually
                let wQRook = document.getElementById("wrA");

                let pieceRow = wQRook.classList[1];
                let pieceCol = wQRook.classList[2];

                wQRook.classList.remove(pieceRow);
                wQRook.classList.remove(pieceCol);

                wQRook.classList.add("row1");
                wQRook.classList.add("colD");

                // move rook on state board
                board[0][3] = "wrA";
                board[0][0] = "";

            }
        } else if (pieceOnFocus.id === "bk" && blackCanCastle) {
            if (newField.id === "8G") {

                let bKRook = document.getElementById("brH");

                let pieceRow = bKRook.classList[1];
                let pieceCol = bKRook.classList[2];

                bKRook.classList.remove(pieceRow);
                bKRook.classList.remove(pieceCol);

                bKRook.classList.add("row8");
                bKRook.classList.add("colF");

                // move rook on state board
                board[7][5] = "brH";
                board[7][7] = "";

            } else if (newField.id === "8C") {

                let bQRook = document.getElementById("brA");

                let pieceRow = bQRook.classList[1];
                let pieceCol = bQRook.classList[2];

                bQRook.classList.remove(pieceRow);
                bQRook.classList.remove(pieceCol);

                bQRook.classList.add("row8");
                bQRook.classList.add("colD");

                // move rook on state board
                board[7][3] = "brA";
                board[7][0] = "";
            }
        }

        /*------------updating castling abilities-----------*/
        switch (pieceOnFocus.id) {

            case "wrA":
                wQRookMoved = true;
                break;

            case "wrH":
                wKRookMoved = true;
                break;

            case "brA":
                bQRookMoved = true;
                break;

            case "brH":
                bKRookMoved = true;
                break;

            case "bk":
                blackCanCastle = false;
                break;

            case "wk":
                whiteCanCastle = false;
                break;
        }

        /*--------if both rooks moved, player cant castle-----------*/
        if (wQRookMoved && wKRookMoved && whiteCanCastle) {
            whiteCanCastle = false;
        } else if (bKRookMoved && bQRookMoved && blackCanCastle) {
            blackCanCastle = false;
        }

        /* catch piece if en passant move is made */
        if (enPassantPawn) {
            if (pieceOnFocus.id.indexOf('wp') === 0) {
                if (newFieldPosition.col === enPassantPawn.col && newFieldPosition.row === enPassantPawn.row + 1) {

                    let catchedPawn = document.getElementById(board[enPassantPawn.row][enPassantPawn.col]);

                    catchedPawn.remove();

                    board[enPassantPawn.row][enPassantPawn.col] = "";
                }
            } else if (pieceOnFocus.id.indexOf('bp') === 0) {
                if (newFieldPosition.col === enPassantPawn.col && newFieldPosition.row === enPassantPawn.row - 1) {

                    let catchedPawn = document.getElementById(board[enPassantPawn.row][enPassantPawn.col]);

                    catchedPawn.remove();

                    board[enPassantPawn.row][enPassantPawn.col] = "";
                }
            }
        }

        /* --------update en passant pawn if necessary------------*/
        if (pieceOnFocus.id.indexOf('p') === 1 && Math.abs(piecePositionOnBoard.row - newFieldPosition.row) === 2) {
            enPassantPawn = newFieldPosition;
        } else {
            enPassantPawn = null;
        }

        // put piece to move on new position
        board[newFieldPosition.row][newFieldPosition.col] = pieceOnFocus.id;

        // clear entry of previous position
        board[piecePositionOnBoard.row][piecePositionOnBoard.col] = "";

        deleteMarker();
        unmarkPiece();
        changeTurn();

    } else {

        // clicked on field is not a legit move
        console.log("nope");
    }
}

function changeTurn() {

    let em = document.getElementById("turnIndicator");

    let moveCounter = document.getElementById("moveCounter");

    let moveAmount;

    if (whitesTurn) {

        // change to blacks turn
        whitesTurn = false;
        em.innerHTML = "Đến lượt đen";

        moveAmount = getAllPossibleMovesOfPlayer("b", board).length;

    } else {
        whitesTurn = true;
        em.innerHTML = "Đến lượt trắng"

        moveAmount = getAllPossibleMovesOfPlayer("w", board).length;
    }

    if (moveAmount === 0) {

        if (whitesTurn && checkIfPlayerIsInChess("w", board)) {
            moveCounter.innerHTML = "Chiếu bí, Đen thắng!";

        } else if (!whitesTurn && checkIfPlayerIsInChess("b", board)) {
            moveCounter.innerHTML = "Chiếu bí, Trắng thắng!";
        } else {
            moveCounter.innerHTML = "Hòa cờ!";
        }

    } else {
        moveCounter.innerHTML = "Các nước có thể đi: " + moveAmount;
    }

    let currentPlayer = whitesTurn ? "w" : "b";
    let isInCheck = checkIfPlayerIsInChess(currentPlayer, board);

    if (isInCheck) {
        let kingPosition = getKingPositionOfPlayer(currentPlayer, board);
        checkedKingPosition = kingPosition;
        highlightCheckedKing(kingPosition, currentPlayer);
    } else {
        checkedKingPosition = null;
        removeCheckedKingHighlight();
    }
}

function highlightCheckedKing(position, playerColor) {
    let fieldId = getFieldFromPosition(position);
    let field = document.getElementById(fieldId);
    field.classList.add("checked");
    field.classList.add(playerColor === "b" ? "checked-black" : "checked-white");
    console.log("Highlighting king at", fieldId, "for player", playerColor);
}

function removeCheckedKingHighlight() {
    let checkedFields = document.getElementsByClassName("checked");
    while (checkedFields.length > 0) {
        checkedFields[0].classList.remove("checked", "checked-white", "checked-black");
    }
}

function getFieldFromPosition(position) {
    let row = 8 - position.row; // Chuyển đổi từ 0-7 sang 8-1
    let col = String.fromCharCode(65 + position.col); // Chuyển đổi từ 0-7 sang A-H
    return `${row}${col}`;
}

function showMoves(element) {

    let emId = element.id;

    let activeBoard = board;

    if ((emId.startsWith("w") && whitesTurn) || (emId.startsWith("b") && !whitesTurn)) {

        if (pieceOnFocus) {

            deleteMarker();
            unmarkPiece();
        } else {

            pieceOnFocus = element;

            let piecePosition = givePosition(activeBoard, element.id);

            let pieceType = getPieceType(element.id);

            let legalMoves = getLegalMoves(piecePosition, pieceType, activeBoard);

            markPieceOnFocus(piecePosition);
            markLegalMoves(legalMoves);
        }
    }
}

function checkIfPieceIsOnField(position, activeBoard) {

    if (activeBoard[position.row][position.col]) {
        return true;
    } else {
        return false;
    }
}

function getColorOfPieceAtPosition(position, activeBoard) {
    const piece = activeBoard[position.row][position.col];

    // Kiểm tra nếu vị trí không có quân cờ (undefined hoặc null)
    if (!piece) {
        return null; // Trả về null nếu không có quân cờ nào ở vị trí này
    } 

    // Giả sử quân trắng bắt đầu bằng "w" và quân đen bắt đầu bằng "b"
    return piece.charAt(0); // Lấy ký tự đầu tiên để xác định màu của quân cờ
}

function makeMoveAndCheckIfChess(piecePosition, newPosition, playerColor) {

    let tempBoard = [["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""]
    ];

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            tempBoard[i][j] = board[i][j];
        }
    }

    // make move on tempBoard
    tempBoard[newPosition.row][newPosition.col] = tempBoard[piecePosition.row][piecePosition.col];
    tempBoard[piecePosition.row][piecePosition.col] = "";

    // check if player in chess
    return checkIfPlayerIsInChess(playerColor, tempBoard);
}

function makeMoveAndReturnNewBoard(from, to, currentBoard) {
    // Kiểm tra xem from và to có hợp lệ không
    if (!from || !to || typeof from.row === 'undefined' || typeof from.col === 'undefined' ||
        typeof to.row === 'undefined' || typeof to.col === 'undefined') {
        console.error("Nước đi không hợp lệ:", from, to);
        return null; // Trả về null nếu nước đi không hợp lệ
    }

    // Tạo một bản sao của bàn cờ hiện tại
    let newBoard = currentBoard.map(row => [...row]);

    // Thực hiện nước đi
    const piece = newBoard[from.row][from.col];
    newBoard[to.row][to.col] = piece;
    newBoard[from.row][from.col] = "";

    // Xử lý các trường hợp đặc biệt như phong hậu, bắt tốt qua đường, nhập thành
    // (Bạn cần thêm logic cho các trường hợp này)

    return newBoard;
}

function getLegalMoves(piecePosition, pieceType, activeBoard) {
    const playerColor = getColorOfPieceAtPosition(piecePosition, activeBoard);
    const legalMoves = [];

    // Hàm kiểm tra kiểu di chuyển hợp lệ cho từng quân cờ
    const isValidMoveForPiece = (pieceType, piecePosition, targetPosition) => {
        const rowDelta = Math.abs(targetPosition.row - piecePosition.row);
        const colDelta = Math.abs(targetPosition.col - piecePosition.col);

        switch (pieceType) {
            case "r": // Quân xe chỉ đi ngang hoặc dọc
                return (rowDelta === 0 || colDelta === 0);

            case "n": // Quân mã đi hình chữ L
                return (rowDelta === 2 && colDelta === 1) || (rowDelta === 1 && colDelta === 2);

            case "b": // Quân tượng đi chéo
                return rowDelta === colDelta;

            case "q": // Quân hậu đi ngang, dọc hoặc chéo
                return (rowDelta === colDelta) || (rowDelta === 0 || colDelta === 0);

            case "k": // Quân vua đi 1 ô theo bất kỳ hướng nào
                return (rowDelta <= 1 && colDelta <= 1);

            case "wp": // Quân tốt trắng
            case "bp": // Quân tốt đen
                const direction = pieceType === "wp" ? 1 : -1; // Tốt trắng đi lên, tốt đen đi xuống
                const startRow = pieceType === "wp" ? 1 : 6; // Hàng bắt đầu của tốt trắng là 1, tốt đen là 6

                // Di chuyển thẳng
                if (colDelta === 0) {
                    if (rowDelta === 1 && !checkIfPieceIsOnField(targetPosition, activeBoard)) {
                        return true; // Đi 1 ô thẳng nếu không bị chặn
                    }
                    if (rowDelta === 2 && piecePosition.row === startRow && !checkIfPieceIsOnField(targetPosition, activeBoard)) {
                        const betweenPosition = { row: piecePosition.row + direction, col: piecePosition.col };
                        if (!checkIfPieceIsOnField(betweenPosition, activeBoard)) {
                            return true; // Đi 2 ô thẳng khi không bị chặn ở cả hai ô
                        }
                    }
                }

                // Bắt chéo
                if (rowDelta === 1 && colDelta === 1) {
                    const targetColor = getColorOfPieceAtPosition(targetPosition, activeBoard);
                    if (targetColor && targetColor !== getColorOfPieceAtPosition(piecePosition, activeBoard)) {
                        return true; // Bắt quân theo đường chéo
                    }
                    // Kiểm tra bắt qua đường (en passant)
                    if (enPassantPawn && targetPosition.row === enPassantPawn.row && targetPosition.col === enPassantPawn.col) {
                        return true; // Bắt qua đường (en passant)
                    }
                }

                return false; // Nếu không hợp lệ thì trả về false

            default:
                return false; // Nếu không xác định được loại quân cờ, coi là sai
        }
    };

    // Hàm hỗ trợ để kiểm tra xem một nước đi có hợp lệ không và thêm vào legalMoves
    const addMoveIfValid = (position) => {
        const targetColor = getColorOfPieceAtPosition(position, activeBoard);
        // Kiểm tra xem di chuyển có hợp lệ cho loại quân cờ không
        if (isValidMoveForPiece(pieceType, piecePosition, position) &&
            targetColor !== playerColor &&
            (!chessCheck || !makeMoveAndCheckIfChess(piecePosition, position, playerColor))) {
            legalMoves.push(position);
            return targetColor !== null; // Trả về true nếu nước đi bắt được quân
        }
        return false;
    };

    // Hàm hỗ trợ để kiểm tra các nước đi theo một hướng cụ thể
    const checkDirection = (rowDelta, colDelta, maxSteps = 7) => {
        for (let i = 1; i <= maxSteps; i++) {
            const position = {
                row: piecePosition.row + rowDelta * i,
                col: piecePosition.col + colDelta * i
            };
            if (position.row < 0 || position.row >= 8 || position.col < 0 || position.col >= 8) break;
            if (addMoveIfValid(position)) break;
            // Nếu gặp quân cờ (kể cả quân của đối phương), dừng kiểm tra hướng này
            if (getColorOfPieceAtPosition(position, activeBoard) !== null) break;
        }
    };

    switch (pieceType) {
        case "wp":
        case "bp":
            // Nước đi của quân tốt
            const direction = pieceType === "wp" ? 1 : -1; // wp (trắng) đi lên, bp (đen) đi xuống
            const startRow = pieceType === "wp" ? 1 : 6; // Hàng bắt đầu của tốt trắng là 1, tốt đen là 6

            // Nước đi thẳng
            const forwardOne = { row: piecePosition.row + direction, col: piecePosition.col };
            if (!checkIfPieceIsOnField(forwardOne, activeBoard)) {
                // Nếu ô phía trước trống thì thêm vào danh sách nước đi
                addMoveIfValid(forwardOne);

                // Nếu quân tốt ở hàng bắt đầu, kiểm tra di chuyển 2 ô
                if (piecePosition.row === startRow) {
                    const forwardTwo = { row: piecePosition.row + 2 * direction, col: piecePosition.col };
                    if (!checkIfPieceIsOnField(forwardTwo, activeBoard)) {
                        addMoveIfValid(forwardTwo);
                    }
                }
            }

            // Bắt chéo
            [[-1, 1], [1, 1]].forEach(([colDelta, rowDelta]) => {
                const position = {
                    row: piecePosition.row + direction * rowDelta,
                    col: piecePosition.col + colDelta
                };

                // Kiểm tra nếu có quân của đối phương hoặc enPassant
                if (getColorOfPieceAtPosition(position, activeBoard) !== playerColor ||
                    (enPassantPawn && position.col === enPassantPawn.col &&
                        position.row === enPassantPawn.row + direction)) {
                    addMoveIfValid(position);
                }
            });
            break;

        case "n":
            // Nước đi của quân mã
            [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]].forEach(([rowDelta, colDelta]) => {
                const position = {
                    row: piecePosition.row + rowDelta,
                    col: piecePosition.col + colDelta
                };
                if (position.row >= 0 && position.row < 8 && position.col >= 0 && position.col < 8) {
                    addMoveIfValid(position);
                }
            });
            break;

        case "b":
            // Nước đi của quân tượng
            [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([rowDelta, colDelta]) => checkDirection(rowDelta, colDelta));
            break;

        case "r":
            // Nước đi của quân xe
            [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([rowDelta, colDelta]) => checkDirection(rowDelta, colDelta));
            break;

        case "q":
            // Nước đi của quân hậu (kết hợp của tượng và xe)
            [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]].forEach(([rowDelta, colDelta]) => checkDirection(rowDelta, colDelta));
            break;

        case "k":
            // Nước đi của quân vua
            [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]].forEach(([rowDelta, colDelta]) => {
                const position = {
                    row: piecePosition.row + rowDelta,
                    col: piecePosition.col + colDelta
                };
                if (position.row >= 0 && position.row < 8 && position.col >= 0 && position.col < 8) {
                    addMoveIfValid(position);
                }
            });

            // Nước nhập thành (đã đơn giản hóa, bạn có thể cần thêm kiểm tra)
            if ((playerColor === "w" && whiteCanCastle) || (playerColor === "b" && blackCanCastle)) {
                const row = playerColor === "w" ? 0 : 7;
                if (!activeBoard[row][5] && !activeBoard[row][6] &&
                    (playerColor === "w" ? !wKRookMoved : !bKRookMoved)) {
                    legalMoves.push({ row, col: piecePosition.col + 2 });
                }
                if (!activeBoard[row][1] && !activeBoard[row][2] && !activeBoard[row][3] &&
                    (playerColor === "w" ? !wQRookMoved : !bQRookMoved)) {
                    legalMoves.push({ row, col: piecePosition.col - 2 });
                }
            }
            break;
    }

    return legalMoves;
}

function deleteMarker() {

    let marker = document.getElementsByClassName("marker");

    let captureFields = document.getElementsByClassName("catch");

    while (marker[0]) {
        marker[0].remove();
    }

    while (captureFields[0]) {
        captureFields[0].classList.remove("catch");
    }

    markedMoves = [];
}

function getFieldFromPosition(position) {

    let row = position.row + 1;
    let col;

    switch (position.col) {

        case 0:
            col = "A";
            break;

        case 1:
            col = "B";
            break;

        case 2:
            col = "C";
            break;

        case 3:
            col = "D";
            break;

        case 4:
            col = "E";
            break;

        case 5:
            col = "F";
            break;

        case 6:
            col = "G";
            break;

        case 7:
            col = "H";
            break;
    }

    return row + col;
}

function markPieceOnFocus(piecePosition) {

    onPieceFocus = true;

    let boardPosition = getFieldFromPosition(piecePosition);

    fieldOnFocus = document.getElementById(boardPosition);

    fieldOnFocus.style.backgroundColor = "#87CEEB";
}

function unmarkPiece() {

    pieceOnFocus = null;

    fieldOnFocus.style.backgroundColor = "";

    fieldOnFocus = null;
}

// Đảm bảo rằng hàm setupGame được gọi khi trang web được tải
window.onload = function() {
    setupGame();
    setHumanMode(); // Gọi setHumanMode để đặt màu sắc ban đầu cho các nút
}


function markLegalMoves(positions) {

    for (let position of positions) {

        let boardPosition = getFieldFromPosition(position);

        markedMoves.push(boardPosition);

        let field = document.getElementById(boardPosition);

        if (checkIfPieceIsOnField(position, board)) {

            field.classList.add("catch");
        }

        let dot = document.createElement("div");

        dot.classList.add("marker");
        dot.setAttribute("onclick", "movePiece(this)");
        dot.innerHTML = "•";

        field.appendChild(dot);
    }

}

function getPieceType(id) {

    let arr = Array.from(id);

    if (arr[1] === 'p') {
        return arr[0] + arr[1];
    } else {
        return arr[1];
    }

}

function givePosition(boardArray, elementId) {

    for (let i = 0; i < boardArray.length; i++) {
        for (let j = 0; j < boardArray[i].length; j++) {

            if (boardArray[i][j] === elementId) {
                return position = {
                    row: i,
                    col: j
                };
            }
        }
    }
}

function fieldIdToBoardPosition(fieldId) {

    let id = Array.from(fieldId);
    let row;
    let col;

    switch (id[0]) {

        case '1':
            row = 0;
            break;
        case '2':
            row = 1;
            break;
        case '3':
            row = 2;
            break;
        case '4':
            row = 3;
            break;
        case '5':
            row = 4;
            break;
        case '6':
            row = 5;
            break;
        case '7':
            row = 6;
            break;
        case '8':
            row = 7;
            break;
    }

    switch (id[1]) {

        case 'A':
            col = 0;
            break;
        case 'B':
            col = 1;
            break;
        case 'C':
            col = 2;
            break;
        case 'D':
            col = 3;
            break;
        case 'E':
            col = 4;
            break;
        case 'F':
            col = 5;
            break;
        case 'G':
            col = 6;
            break;
        case 'H':
            col = 7;
            break;
    }

    return position = {
        row: row,
        col: col
    };
}

function getAllActivePiecesOfPlayer(player, activeBoard) {

    let activePiecesOfPlayer = [];

    for (let i = 0; i < activeBoard.length; i++) {
        for (let j = 0; j < activeBoard[i].length; j++) {

            if (activeBoard[i][j].startsWith(player)) {
                activePiecesOfPlayer.push(activeBoard[i][j]);
            }
        }
    }

    return activePiecesOfPlayer;
}

function getAllPossibleMovesOfPlayer(player, activeBoard) {

    let activePiecesOfPlayer = getAllActivePiecesOfPlayer(player, activeBoard);

    let possibleMoves = [];

    for (let piece of activePiecesOfPlayer) {

        let posi = givePosition(activeBoard, piece);

        let type = getPieceType(piece);

        let moves = getLegalMoves(posi, type, activeBoard);

        for (let move of moves) {
            possibleMoves.push(move);
        }
    }
    return possibleMoves;
}

function getKingPositionOfPlayer(player, activeBoard) {

    for (let i = 0; i < activeBoard.length; i++) {
        for (let j = 0; j < activeBoard[i].length; j++) {
            if (activeBoard[i][j] == player + "k") {
                return {
                    row: i,
                    col: j
                }
            }
        }
    }
}

function checkIfPlayerIsInChess(player, activeBoard) {

    let opponent;

    if (player === "w") {
        opponent = "b";
    } else {
        opponent = "w";
    }

    chessCheck = false;

    let possibleMoves = getAllPossibleMovesOfPlayer(opponent, activeBoard);

    let kingsPosition = getKingPositionOfPlayer(player, activeBoard);

    // Kiểm tra xem vị trí của vua có tồn tại không
    if (!kingsPosition) {
        console.error("Không tìm thấy vị trí của vua cho người chơi", player);
        return false; // hoặc xử lý lỗi theo cách khác tùy vào logic của bạn
    }
    
    chessCheck = true;

    for (let move of possibleMoves) {

        if (move.row === kingsPosition.row && move.col === kingsPosition.col) {
            return true;
        }
    }
    return false;
}

setupGame();