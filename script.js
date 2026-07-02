const startBtn = document.getElementById('startBtn');
const moveBtn = document.getElementById('moveBtn');
const acceptBtn = document.getElementById('acceptBtn');
const intro = document.getElementById('intro');
const game = document.getElementById('game');
const reveal = document.getElementById('reveal');
const track = document.getElementById('track');
const token = document.getElementById('token');
const missionBox = document.getElementById('missionBox');
const progressFill = document.getElementById('progressFill');
const toast = document.getElementById('toast');
const achievement = document.getElementById('achievement');

let audioCtx, musicTimer, step = 0;
const tiles = ['START','🍷','🍿','🃏','😂','🎲','💅','🍫','✨','🏁'];
const messages = [
  'Quest started. Keep going →',
  'Wine unlocked 🍷',
  'Snacks unlocked 🍿',
  'Card draw: +10 drama 🃏',
  'Friendship temporarily at risk 😂',
  'Dice power activated 🎲',
  'Main character energy unlocked 💅',
  'Sweet bonus unlocked 🍫',
  'Almost there... ✨',
  'Finish line reached 🏁'
];

function setupBoard(){
  track.innerHTML = '';
  tiles.forEach((t,i)=>{
    const div=document.createElement('div');
    div.className='tile'+(i===0?' active':'');
    div.textContent=t;
    track.appendChild(div);
  });
  moveToken();
}
function moveToken(){
  const tile = track.children[step];
  const board = document.getElementById('board').getBoundingClientRect();
  const rect = tile.getBoundingClientRect();
  token.style.left = (rect.left - board.left + rect.width/2 - token.offsetWidth/2) + 'px';
  token.style.top = (rect.top - board.top + rect.height/2 - token.offsetHeight/2) + 'px';
  [...track.children].forEach((el,i)=>el.classList.toggle('active',i<=step));
  progressFill.style.width = `${(step/(tiles.length-1))*100}%`;
}
function showToast(text){
  toast.textContent = text; toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),1400);
}
function vibrate(ms=20){ if(navigator.vibrate) navigator.vibrate(ms); }
function initAudio(){
  if(audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  startMusic();
}
function beep(freq=440, dur=.09, type='sine', gain=.045){
  if(!audioCtx) return;
  const osc=audioCtx.createOscillator(); const g=audioCtx.createGain();
  osc.type=type; osc.frequency.value=freq; g.gain.value=gain;
  osc.connect(g); g.connect(audioCtx.destination); osc.start();
  g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+dur);
  osc.stop(audioCtx.currentTime+dur);
}
function chord(){ [392,523,659].forEach((f,i)=>setTimeout(()=>beep(f,.16,'triangle',.035),i*55)); }
function startMusic(){
  const notes=[392,523,587,659,587,523,440,523]; let i=0;
  musicTimer=setInterval(()=>{ beep(notes[i%notes.length],.08,'square',.018); i++; }, 245);
}
function confetti(count=70){
  const colors=['#ff4fd8','#ffd76b','#55e6ff','#8f5cff','#ffffff'];
  for(let i=0;i<count;i++){
    const el=document.createElement('div'); el.className='confetti';
    el.style.left=Math.random()*100+'vw'; el.style.background=colors[i%colors.length];
    el.style.animationDelay=Math.random()*0.35+'s'; el.style.borderRadius=Math.random()>.5?'999px':'2px';
    document.body.appendChild(el); setTimeout(()=>el.remove(),2100);
  }
}
startBtn.addEventListener('click',()=>{
  initAudio(); chord(); vibrate(30);
  intro.classList.add('hidden'); game.classList.remove('hidden'); setupBoard();
  showToast('Players connected ✔');
});
moveBtn.addEventListener('click',()=>{
  if(step >= tiles.length-1) return;
  step++; beep(520+step*30,.1,'triangle',.05); vibrate(18);
  token.classList.add('jump'); setTimeout(()=>token.classList.remove('jump'),360);
  missionBox.textContent = messages[step]; moveToken(); showToast(messages[step]);
  if(step===1 || step===5 || step===8) confetti(18);
  if(step===tiles.length-1){
    moveBtn.disabled=true; moveBtn.textContent='UNLOCKING...'; chord(); confetti(90);
    setTimeout(()=>{ game.classList.add('hidden'); reveal.classList.remove('hidden'); chord(); },1100);
  }
});
acceptBtn.addEventListener('click',()=>{
  initAudio(); achievement.classList.remove('hidden'); confetti(120); vibrate(60); chord(); showToast('Mission accepted ✔');
});
window.addEventListener('resize',()=>{ if(!game.classList.contains('hidden')) setTimeout(moveToken,80); });

// background stars
const canvas=document.getElementById('stars'), ctx=canvas.getContext('2d'); let stars=[];
function resize(){ canvas.width=innerWidth; canvas.height=innerHeight; stars=Array.from({length:70},()=>({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*1.7+.4,v:Math.random()*.35+.08})); }
function draw(){ ctx.clearRect(0,0,canvas.width,canvas.height); ctx.fillStyle='rgba(255,255,255,.8)'; stars.forEach(s=>{ctx.globalAlpha=.35+Math.sin(Date.now()/500+s.x)*.35;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();s.y+=s.v;if(s.y>canvas.height)s.y=0;}); requestAnimationFrame(draw); }
resize(); draw(); addEventListener('resize',resize);
