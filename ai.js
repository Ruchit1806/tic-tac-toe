let board = Array(9).fill("");
let currentPlayer = "X";

function startNewGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  drawBoard();
  document.getElementById("message").textContent = "";
}

function drawBoard() {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";

  board.forEach((cell, i) => {
    const div = document.createElement("div");
    div.className = "cell";
    div.textContent = cell;
    div.onclick = () => handleClick(i);
    boardDiv.appendChild(div);
  });
}

function handleClick(index) {
  if (board[index] !== "" || currentPlayer !== "X") return;

  board[index] = "X";
  drawBoard();
  if (checkWinner("X")) return showMessage("You win!");
  if (isDraw()) return showMessage("It's a draw!");

  currentPlayer = "O";
  setTimeout(aiMove, 300);
}

function aiMove() {
  const difficulty = document.getElementById("difficulty").value;
  let move;

  if (difficulty === "easy") {
    const empty = board.map((val, i) => val === "" ? i : null).filter(v => v !== null);
    move = empty[Math.floor(Math.random() * empty.length)];
  } else {
    move = getBestMove(); // Minimax
  }

  board[move] = "O";
  drawBoard();

  if (checkWinner("O")) return showMessage("AI wins!");
  if (isDraw()) return showMessage("It's a draw!");
  currentPlayer = "X";
}

function getBestMove() {
  let bestScore = -Infinity;
  let bestMove;

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}

function minimax(newBoard, depth, isMaximizing) {
  if (checkWinner("O", newBoard)) return 10 - depth;
  if (checkWinner("X", newBoard)) return depth - 10;
  if (isDraw(newBoard)) return 0;

  let bestScore = isMaximizing ? -Infinity : Infinity;
  let player = isMaximizing ? "O" : "X";

  for (let i = 0; i < 9; i++) {
    if (newBoard[i] === "") {
      newBoard[i] = player;
      let score = minimax(newBoard, depth + 1, !isMaximizing);
      newBoard[i] = "";
      bestScore = isMaximizing
        ? Math.max(score, bestScore)
        : Math.min(score, bestScore);
    }
  }

  return bestScore;
}

function checkWinner(player, boardState = board) {
  const winCombos = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  return winCombos.some(combo => combo.every(i => boardState[i] === player));
}

function isDraw(boardState = board) {
  return boardState.every(cell => cell !== "") &&
         !checkWinner("X", boardState) &&
         !checkWinner("O", boardState);
}

function showMessage(msg) {
  document.getElementById("message").textContent = msg;
}
