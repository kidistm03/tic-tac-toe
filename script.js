let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;
let gameMode = "duo"; // Default mode
let scores = { X: 0, O: 0 };

const statusText = document.getElementById('statusText');
const cells = document.querySelectorAll('.cell');
const WIN_CONDITIONS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

// --- 1. MODE SELECTION LOGIC ---
const soloBtn = document.getElementById('soloBtn');
const duoBtn = document.getElementById('duoBtn');

soloBtn.addEventListener('click', () => setMode('solo'));
duoBtn.addEventListener('click', () => setMode('duo'));

function setMode(mode) {
    gameMode = mode;
    // Update UI to show selection
    soloBtn.classList.toggle('active-mode', mode === 'solo');
    duoBtn.classList.toggle('active-mode', mode === 'duo');
    document.getElementById('labelO').innerText = mode === "solo" ? "CPU (O)" : "Player O";
    
    // Crucial: Reset the board when switching modes
    handleRestart();
}

// --- 2. CORE GAMEPLAY ---
cells.forEach(cell => cell.addEventListener('click', (e) => {
    const idx = e.target.getAttribute('data-index');
    
    // Prevent clicking if cell is full or game is over
    if (board[idx] !== "" || !isGameActive) return;

    // Player X Move
    executeMove(idx);

    // If Solo Mode, trigger CPU move after a short delay
    if (gameMode === "solo" && isGameActive && currentPlayer === "O") {
        statusText.innerText = "CPU is thinking...";
        setTimeout(computerStrategy, 600); 
    }
}));

function executeMove(idx) {
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
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.innerText = `Winner: ${currentPlayer}! ✨`;
        scores[currentPlayer]++;
        updateScoreDisplay();
        isGameActive = false;
    } else if (!board.includes("")) {
        statusText.innerText = "It's a Draw! 🤝";
        isGameActive = false;
    } else {
        // Swap turns
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.innerText = `Turn: ${currentPlayer}`;
        document.getElementById('cardX').classList.toggle('x-active');
        document.getElementById('cardO').classList.toggle('o-active');
    }
}

// --- 3. SMART AI STRATEGY ---
function computerStrategy() {
    if (!isGameActive) return;

    let move = findBestMove("O"); // Try to win
    if (move === null) move = findBestMove("X"); // Try to block player
    if (move === null) {
        // Priority: Center > Corners > Sides
        const priority = [4, 0, 2, 6, 8, 1, 3, 5, 7];
        move = priority.find(i => board[i] === "");
    }

    if (move !== undefined) executeMove(move);
}

function findBestMove(playerSymbol) {
    for (let combo of WIN_CONDITIONS) {
        const [a, b, c] = combo;
        let line = [board[a], board[b], board[c]];
        // If two spots have the symbol and one is empty
        if (line.filter(s => s === playerSymbol).length === 2 && line.includes("")) {
            return combo[line.indexOf("")];
        }
    }
    return null;
}

// --- 4. UTILITY FUNCTIONS ---
function updateScoreDisplay() {
    document.getElementById('scoreX').innerText = scores.X;
    document.getElementById('scoreO').innerText = scores.O;
}

function handleRestart() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    isGameActive = true;
    cells.forEach(c => c.innerText = "");
    statusText.innerText = "Player X, start!";
    document.getElementById('cardX').classList.add('x-active');
    document.getElementById('cardO').classList.remove('active-mode');
}

document.getElementById('restartBtn').addEventListener('click', handleRestart);

document.getElementById('fullResetBtn').addEventListener('click', () => {
    scores = { X: 0, O: 0 };
    updateScoreDisplay();
    handleRestart();
});

// Hamburger Menu Toggle
document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('nav-links').classList.toggle('active');
});
// --- THEME TOGGLE LOGIC ---
const themeToggle = document.getElementById('themeToggle');
const bodyElement = document.body;

themeToggle.addEventListener('click', () => {
    // Toggle the class on the body
    bodyElement.classList.toggle('light-theme');
    
    // Update the button text so the user knows what will happen next
    if (bodyElement.classList.contains('light-theme')) {
        themeToggle.innerText = "🌙 Dark Mode";
    } else {
        themeToggle.innerText = "☀️ Light Mode";
    }
});