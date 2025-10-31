const board = document.getElementById("board");
const statusEl = document.getElementById("status");
const modeSel = document.getElementById("mode");
const firstSel = document.getElementById("first");
const modeText = document.getElementById("modeText");
const turnEl = document.getElementById("turn");
const winnerBox = document.getElementById("winnerBox");
const winnerText = document.getElementById("winnerText");
const subText = document.getElementById("subText");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const scoreD = document.getElementById("scoreD");

const resetBtn = document.getElementById("reset");
const undoBtn = document.getElementById("undo");
const hintBtn = document.getElementById("hint");
const resetAllBtn = document.getElementById("resetAll");

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

let cells = [];
let state = Array(9).fill(null);
let current = "X";
let human = "X";
let mode = "pvp";
let history = [];
let scores = {X:0,O:0,D:0};

// --- Build board ---
function createBoard(){
  board.innerHTML = "";
  for(let i=0;i<9;i++){
    const c = document.createElement("div");
    c.className = "cell";
    c.dataset.i = i;
    c.addEventListener("click", onCellClick);
    board.appendChild(c);
    cells[i] = c;
  }
}

// --- Render ---
function render(){
  for(let i=0;i<9;i++){
    cells[i].textContent = state[i] || "";
    cells[i].classList.toggle("disabled", !!state[i] || winnerBox.style.display!=="none");
    cells[i].classList.remove("highlight");
  }
  turnEl.textContent = winnerBox.style.display!=="none" ? "—" :
      current + (mode==="pvc" && current!==human ? " (CPU)" : "");
  modeText.textContent = mode==="pvp" ? "Player vs Player" : "Player vs Computer";
}

// --- Check winner ---
function checkWinner(brd=state){
  for(const line of WIN_LINES){
    const [a,b,c] = line;
    if(brd[a] && brd[a]===brd[b] && brd[a]===brd[c])
      return {player:brd[a], line};
  }
  if(brd.every(Boolean)) return {player:null};
  return null;
}

// --- End game ---
function endGame(result){
  if(!result) return;
  winnerBox.style.display = "block";
  if(result.player){
    winnerText.textContent = result.player + " Wins!";
    subText.textContent = "Line: " + result.line.map(i=>i+1).join(", ");
    scores[result.player] += 1;
    result.line.forEach(i => cells[i].classList.add("highlight"));
  } else {
    winnerText.textContent = "Draw 🤝";
    subText.textContent = "No more moves";
    scores.D += 1;
  }
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
  scoreD.textContent = scores.D;
  render();
}

// --- Make move ---
function makeMove(i, player, record=true){
  if(state[i] || winnerBox.style.display!=="none") return false;
  state[i] = player;
  if(record) history.push({i,player});
  const res = checkWinner();
  if(res) endGame(res);
  else {
    current = player==="X" ? "O" : "X";
    render();
    if(mode==="pvc" && current!==human) setTimeout(cpuMove,300);
  }
  return true;
}

// --- Minimax AI ---
function cpuMove(){
  const best = minimax(state.slice(), current);
  if(best.index!==undefined) makeMove(best.index, current);
}

function minimax(board, player){
  const avail = board.map((v,i)=>v?null:i).filter(v=>v!==null);
  const winner = checkWinner(board);
  if(winner){
    if(winner.player===human) return {score:-10};
    if(winner.player && winner.player!==human) return {score:10};
    return {score:0};
  }
  if(avail.length===0) return {score:0};

  let moves=[];
  for(const i of avail){
    board[i]=player;
    const result=minimax(board,player==="X"?"O":"X");
    moves.push({index:i,score:result.score});
    board[i]=null;
  }

  if(player!==human){ // CPU maximizing
    let best=moves[0];
    for(const m of moves) if(m.score>best.score) best=m;
    return best;
  } else { // human minimizing
    let best=moves[0];
    for(const m of moves) if(m.score<best.score) best=m;
    return best;
  }
}

// --- Event Handlers ---
function onCellClick(e){
  const i=Number(e.currentTarget.dataset.i);
  if(mode==="pvc" && current!==human) return;
  if(makeMove(i,current)) statusEl.textContent="Move placed";
}

modeSel.onchange = ()=>{mode=modeSel.value; resetGame();}
firstSel.onchange = ()=>{human=firstSel.value; resetGame();}
resetBtn.onclick = resetGame;

undoBtn.onclick = ()=>{
  if(history.length===0 || winnerBox.style.display!=="none") return;
  const last=history.pop(); state[last.i]=null; current=last.player;
  if(mode==="pvc" && history.length && history[history.length-1].player!==current){
    const last2=history.pop(); state[last2.i]=null; current=last2.player;
  }
  winnerBox.style.display="none"; render();
};

hintBtn.onclick = ()=>{
  if(winnerBox.style.display!=="none") return;
  const best=minimax(state.slice(),current);
  if(best.index!==undefined){
    cells[best.index].classList.add("highlight");
    setTimeout(()=>cells[best.index].classList.remove("highlight"),1200);
  }
};

resetAllBtn.onclick = ()=>{
  scores={X:0,O:0,D:0};
  scoreX.textContent=scoreO.textContent=scoreD.textContent="0";
  resetGame();
};

// --- Reset Game ---
function resetGame(){
  state=Array(9).fill(null); history=[]; winnerBox.style.display="none";
  current="X"; render(); statusEl.textContent="New game started";
  if(mode==="pvc" && human==="O") setTimeout(cpuMove,300);
}

// --- Init ---
createBoard(); resetGame(); render();
