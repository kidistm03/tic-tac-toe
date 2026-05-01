let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;
let scores = { X: 0, O: 0 };

const statusText = document.getElementById('statusText');
const cells = document.querySelectorAll('.cell');
const cardX = document.getElementById('cardX');
const cardO = document.getElementById('cardO');

// Single Responsibility: Win logic[cite: 1]
const WIN_CONDITIONS = [
    [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]
];

function handleCellClick(e) {
    const idx = e.target.getAttribute('data-index');
    if (board[idx] !== "" || !isGameActive) return;

    updateCell(e.target, idx);
    checkResult();
}

function updateCell(cell, index) {
    board[index] = currentPlayer;
    cell.innerText = currentPlayer;
    cell.style.color = currentPlayer === "X" ? "#38bdf8" : "#2dd4bf";
}

function checkResult() {
    let roundWon = false;
    for (let condition of WIN_CONDITIONS) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.innerText = `Victory! Player ${currentPlayer} wins!`;
        scores[currentPlayer]++;
        updateScoreboard();
        isGameActive = false;
        return;
    }

    if (!board.includes("")) {
        statusText.innerText = "It's a Draw!";
        isGameActive = false;
        return;
    }

    swapPlayer();
}

function swapPlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.innerText = `Player ${currentPlayer}'s Turn`;
    cardX.classList.toggle('x-active');
    cardO.classList.toggle('o-active');
}

function updateScoreboard() {
    document.getElementById('scoreX').innerText = scores.X;
    document.getElementById('scoreO').innerText = scores.O;
}

// Restart buttons[cite: 1]
document.getElementById('restartBtn').addEventListener('click', () => {
    board = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    currentPlayer = "X";
    statusText.innerText = "Player X, start the game!";
    cells.forEach(cell => cell.innerText = "");
    cardX.classList.add('x-active');
    cardO.classList.remove('o-active');
});

document.getElementById('fullResetBtn').addEventListener('click', () => {
    scores = { X: 0, O: 0 };
    updateScoreboard();
    location.reload(); // Simple way to reset everything
});

// Hamburger menu toggle[cite: 1]
document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('nav-links').classList.toggle('active');
});

cells.forEach(cell => cell.addEventListener('click', handleCellClick));