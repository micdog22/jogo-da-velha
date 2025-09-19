// script.js - Lógica do jogo com IA (minimax), modos CPU e PvP, tema persistente.

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const modeLabel = document.getElementById('modeLabel');
const symbolLabel = document.getElementById('symbolLabel');
const scoreXEl = document.getElementById('scoreX');
const scoreOEl = document.getElementById('scoreO');
const scoreTEl = document.getElementById('scoreT');
const btnNovo = document.getElementById('btnNovo');
const btnReset = document.getElementById('btnReset');
const themeToggle = document.getElementById('themeToggle');
const openSettings = document.getElementById('openSettings');
const settingsDialog = document.getElementById('settingsDialog');
const settingsForm = document.getElementById('settingsForm');
const difficultySel = document.getElementById('difficulty');

// Estado
let board = Array(9).fill(null);
let current = 'X';
let human = 'X';
let ai = 'O';
let gameOver = false;
let mode = 'cpu'; // 'cpu' | 'pvp'
let difficulty = 'hard';

// Placar persistente
let scores = JSON.parse(localStorage.getItem('ttt_scores') || '{"X":0,"O":0,"T":0}');

// Tema persistente
function getSystemTheme() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('ttt_theme', t);
}
applyTheme(localStorage.getItem('ttt_theme') || getSystemTheme());

themeToggle.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(cur === 'dark' ? 'light' : 'dark');
});

// Construir tabuleiro
function renderBoard() {
  boardEl.innerHTML = '';
  board.forEach((val, idx) => {
    const cell = document.createElement('button');
    cell.className = 'cell';
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', `célula ${idx+1}`);
    cell.dataset.index = idx;
    if (val) {
      const span = document.createElement('span');
      span.className = 'mark';
      span.textContent = val;
      span.style.color = val === 'X' ? 'var(--brand-2)' : 'var(--brand)';
      cell.appendChild(span);
    }
    cell.addEventListener('click', onCellClick);
    boardEl.appendChild(cell);
  });
}

function updateStatus(msg) {
  statusEl.textContent = msg;
  symbolLabel.textContent = human;
  modeLabel.textContent = mode === 'cpu' ? 'CPU' : '2 Jogadores';
  scoreXEl.textContent = String(scores.X);
  scoreOEl.textContent = String(scores.O);
  scoreTEl.textContent = String(scores.T);
}

function lines() {
  return [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
}

function calcWinner(bd) {
  for (const [a,b,c] of lines()) {
    if (bd[a] && bd[a] === bd[b] && bd[a] === bd[c]) return { winner: bd[a], line:[a,b,c] };
  }
  if (bd.every(Boolean)) return { winner: 'T', line: [] };
  return { winner: null, line: [] };
}

function place(i, p) {
  if (board[i] || gameOver) return false;
  board[i] = p;
  renderBoard();
  const res = calcWinner(board);
  if (res.winner) {
    gameOver = true;
    if (res.winner === 'T') {
      updateStatus('Empate.');
      scores.T++;
    } else {
      updateStatus(`Vitória de ${res.winner}.`);
      scores[res.winner]++;
      // destacar linha vencedora
      for (const k of res.line) {
        boardEl.children[k].classList.add('winner');
      }
    }
    localStorage.setItem('ttt_scores', JSON.stringify(scores));
    return true;
  }
  current = current === 'X' ? 'O' : 'X';
  updateStatus(mode === 'cpu' ? (current === human ? 'Sua vez' : 'Vez da CPU') : `Vez de ${current}`);
  return true;
}

function onCellClick(e) {
  const idx = Number(e.currentTarget.dataset.index);
  if (gameOver) return;
  if (mode === 'cpu') {
    if (current !== human) return; // aguarde a CPU
    if (!place(idx, human)) return;
    if (!gameOver) setTimeout(cpuMove, 180);
  } else {
    // pvp
    place(idx, current);
  }
}

function bestMoveHard() {
  // Minimax perfeito
  const empty = (bd) => bd.map((v,i)=>v?null:i).filter(v=>v!==null);
  function scoreTerminal(bd, depth) {
    const r = calcWinner(bd);
    if (r.winner === ai) return 10 - depth;
    if (r.winner === human) return depth - 10;
    if (r.winner === 'T') return 0;
    return null;
  }
  function minimax(bd, player, depth=0) {
    const term = scoreTerminal(bd, depth);
    if (term !== null) return { score: term, move: -1 };
    let best = { score: player===ai ? -Infinity : Infinity, move: -1 };
    for (const m of empty(bd)) {
      bd[m] = player;
      const res = minimax(bd, player===ai?human:ai, depth+1);
      bd[m] = null;
      if (player === ai) {
        if (res.score > best.score) best = { score: res.score, move: m };
      } else {
        if (res.score < best.score) best = { score: res.score, move: m };
      }
    }
    return best;
  }
  // preferência de centro e cantos para estética
  const bd = board.slice();
  const emptyCells = bd.map((v,i)=>v?null:i).filter(v=>v!==null);
  if (emptyCells.length === 9) return 4; // abre no centro
  return minimax(bd, ai).move;
}

function bestMoveNormal() {
  // heurística simples: vitória imediata > bloquear > centro > canto > lateral
  const empty = board.map((v,i)=>v?null:i).filter(v=>v!==null);
  // 1) ganhar
  for (const i of empty) {
    const copy = board.slice(); copy[i] = ai;
    if (calcWinner(copy).winner === ai) return i;
  }
  // 2) bloquear
  for (const i of empty) {
    const copy = board.slice(); copy[i] = human;
    if (calcWinner(copy).winner === human) return i;
  }
  // 3) centro
  if (empty.includes(4)) return 4;
  // 4) cantos
  const corners = [0,2,6,8].filter(i => empty.includes(i));
  if (corners.length) return corners[Math.floor(Math.random()*corners.length)];
  // 5) laterais
  return empty[Math.floor(Math.random()*empty.length)];
}

function bestMoveEasy() {
  const empty = board.map((v,i)=>v?null:i).filter(v=>v!==null);
  return empty[Math.floor(Math.random()*empty.length)];
}

function cpuMove() {
  if (gameOver) return;
  if (mode !== 'cpu') return;
  if (current !== ai) return;
  let move;
  if (difficulty === 'hard') move = bestMoveHard();
  else if (difficulty === 'normal') move = bestMoveNormal();
  else move = bestMoveEasy();
  place(move, ai);
}

function newGame(keepOrder=false) {
  board = Array(9).fill(null);
  gameOver = false;
  if (!keepOrder) current = 'X';
  renderBoard();
  // se CPU começa (quando humano escolhe O), a IA joga primeiro
  if (mode === 'cpu') {
    updateStatus(current === human ? 'Sua vez' : 'Vez da CPU');
    if (current === ai) setTimeout(cpuMove, 250);
  } else {
    updateStatus(`Vez de ${current}`);
  }
}

btnNovo.addEventListener('click', () => newGame(true));
btnReset.addEventListener('click', () => {
  scores = { X:0, O:0, T:0 };
  localStorage.setItem('ttt_scores', JSON.stringify(scores));
  updateStatus('Placar zerado.');
});

openSettings.addEventListener('click', () => {
  // refletir estado atual
  settingsForm.mode.value = mode;
  settingsForm.symbol.value = human;
  difficultySel.value = difficulty;
  settingsDialog.showModal();
});

settingsDialog.addEventListener('close', () => {
  if (settingsDialog.returnValue !== 'confirm') return;
  const data = new FormData(settingsForm);
  mode = data.get('mode');
  human = data.get('symbol');
  ai = human === 'X' ? 'O' : 'X';
  difficulty = data.get('difficulty') || 'hard';
  current = 'X'; // sempre começa no X por padrão
  // se humano escolheu O, então a IA joga primeiro em modo CPU
  renderBoard();
  updateStatus(mode === 'cpu' ? (current === human ? 'Sua vez' : 'Vez da CPU') : `Vez de ${current}`);
  newGame(false);
});


// Fechar ao clicar fora do cartão
settingsDialog.addEventListener('click', (e) => {
  const card = settingsDialog.querySelector('.dialog-card');
  const r = card.getBoundingClientRect();
  const inCard = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  if (!inCard) settingsDialog.close('cancel');
});

// Inicialização
renderBoard();
updateStatus('Sua vez');
