const board = document.getElementById('board');
const message = document.getElementById('message');
let currentPlayer = 'X';
let isPlayerTurn = true;
const cells = [];

for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    cells.push(cell);
    board.appendChild(cell);
}

function handleCellClick() {
    if (!isPlayerTurn) return;

    const index = this.dataset.index;

    if (!cells[index].textContent) {
        disableBoard();

        cells[index].textContent = currentPlayer;

        if (checkWinner()) {
            message.textContent = `Player ${currentPlayer} wins!`;
            disableBoard();
        } else if (isBoardFull()) {
            message.textContent = "It's a tie!";
        } else {
            currentPlayer = 'X';
            message.textContent = "AI is thinking...";
            setTimeout(makeAIMove, 500);
        }
    } else {
        message.textContent = 'Cell already filled. Choose another cell.';
    }
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[a].textContent === cells[c].textContent;
    });
}

function isBoardFull() {
    return cells.every(cell => cell.textContent !== '');
}

function disableBoard() {
    isPlayerTurn = false;
}

function enableBoard() {
    isPlayerTurn = true;
}

function resetBoard() {
    cells.forEach(cell => {
        cell.textContent = '';
        cell.addEventListener('click', handleCellClick);
    });
    currentPlayer = 'X';
    message.textContent = 'Your Turn!';
    enableBoard();
}

function makeAIMove() {
    const bestMove = getBestMove();
    cells[bestMove].textContent = 'O';

    if (checkWinner()) {
        message.textContent = 'AI wins!';
        disableBoard();
    } else if (isBoardFull()) {
        message.textContent = "It's a tie!";
    } else {
        currentPlayer = 'X';
        message.textContent = 'Your Turn!';
        enableBoard();
    }
}

function minimax(depth, isMaximizing) {
    if (checkWinner()) {
        return isMaximizing ? -1 : 1;
    }

    if (isBoardFull()) {
        return 0;
    }

    const scores = [];
    const emptyCells = cells.filter(cell => !cell.textContent);

    for (const cell of emptyCells) {
        const index = cell.dataset.index;
        cells[index].textContent = isMaximizing ? 'O' : 'X';
        scores.push(minimax(depth + 1, !isMaximizing));
        cells[index].textContent = '';
    }

    return isMaximizing ? Math.max(...scores) : Math.min(...scores);
}

function getBestMove() {
    const emptyCells = cells.filter(cell => !cell.textContent);
    let bestScore = -Infinity;
    let bestMove;

    for (const cell of emptyCells) {
        const index = cell.dataset.index;
        cells[index].textContent = 'O';
        const score = minimax(0, false);
        cells[index].textContent = '';

        if (score > bestScore) {
            bestScore = score;
            bestMove = index;
        }
    }

    return bestMove;
}
