let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;
let gameMode = "duo"; // "solo" or "duo"
let scores = { X: 0, O: 0 };

const statusText = document.getElementById('statusText');
const cells = document.querySelectorAll('.cell');
const WIN_CONDITIONS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

// Mode Logic
document.getElementById('soloBtn').addEventListener('click', () => setMode('solo'));
document.getElementById('duoBtn').addEventListener('click', () => setMode('duo'));

function setMode(mode) {
    gameMode = mode;
    document.getElementById('labelO').innerText = mode === "solo" ? "CPU (O)" : "Player O";
    document.getElementById('soloBtn').classList.toggle('active-mode', mode === 'solo');
    document.getElementById('duoBtn').classList.toggle('active-mode', mode === 'duo');
    fullReset();
}

// Handling Player Clicks
cells.forEach(cell => cell.addEventListener('click', (e) => {
    const idx = e.target.getAttribute('data-index');
    if (board[idx] !== "" || !isGameActive) return;

    makeMove(idx);

    if (gameMode === "solo" && isGameActive && currentPlayer === "O") {
        statusText.innerText = "CPU is thinking...";
        setTimeout(computerStrategy, 600); // Thinking delay[cite: 1]
    }
}));

function makeMove(idx) {
    board[idx] = currentPlayer;
    cells[idx].innerText = currentPlayer;
    cells[idx].style.color = currentPlayer === "X" ? "#38bdf8" : "#2dd4bf";
    checkWinner();
}

function checkWinner() {
    let roundWon = false;
    for (let combo of WIN_CONDITIONS) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true; break;
        }
    }

    if (roundWon) {
        statusText.innerText = `Winner: ${currentPlayer}!`;
        scores[currentPlayer]++;
        updateUI(false);
    } else if (!board.includes("")) {
        statusText.innerText = "Draw!";
        updateUI(false);
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.innerText = `Turn: ${currentPlayer}`;
        document.getElementById('cardX').classList.toggle('x-active');
        document.getElementById('cardO').classList.toggle('o-active');
    }
}

// Smart AI Strategy: Win > Block > Priority[cite: 1]
function computerStrategy() {
    let move = findBestMove("O"); // 1. Try to win
    if (move === null) move = findBestMove("X"); // 2. Try to block
    if (move === null) {
        const priority = [4, 0, 2, 6, 8, 1, 3, 5, 7]; // 3. Priority list[cite: 1]
        move = priority.find(i => board[i] === "");
    }
    makeMove(move);
}

function findBestMove(player) {
    for (let combo of WIN_CONDITIONS) {
        const [a, b, c] = combo;
        let line = [board[a], board[b], board[c]];
        if (line.filter(s => s === player).length === 2 && line.includes("")) {
            return combo[line.indexOf("")];
        }
    }
    return null;
}

function updateUI(active) {
    isGameActive = active;
    document.getElementById('scoreX').innerText = scores.X;
    document.getElementById('scoreO').innerText = scores.O;
}

// Reset Logic[cite: 1]
document.getElementById('restartBtn').addEventListener('click', () => {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    isGameActive = true;
    cells.forEach(c => c.innerText = "");
    statusText.innerText = "Player X, start!";
    document.getElementById('cardX').classList.add('x-active');
    document.getElementById('cardO').classList.remove('o-active');
});

document.getElementById('fullResetBtn').addEventListener('click', fullReset);
function fullReset() { scores = {X:0, O:0}; updateUI(true); document.getElementById('restartBtn').click(); }

// Hamburger[cite: 1]
document.getElementById('hamburger').addEventListener('click', () => document.getElementById('nav-links').classList.toggle('active'));