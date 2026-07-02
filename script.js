const yesBtn = document.getElementById('yesBtn');
const mission = document.getElementById('mission');
const soundBtn = document.getElementById('soundBtn');
const photoWrap = document.getElementById('photoWrap');
const dice = document.getElementById('dice');
const diceMsg = document.getElementById('diceMsg');
const acceptBtn = document.getElementById('acceptBtn');
const accepted = document.getElementById('accepted');
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
let audioCtx, musicTimer, musicOn = false;

function sizeCanvas(){ canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio; }
addEventListener('resize', sizeCanvas); sizeCanvas();

function initAudio(){
  if(audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
function beep(freq=520, dur=.12, type='sine', gain=.035){
  if(!audioCtx) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type; o.frequency.value = freq; g.gain.value = gain;
  o.connect(g); g.connect(audioCtx.destination); o.start();
  g.gain.exponentialRampToValueAtTime(.0001, audioCtx.currentTime + dur);
  o.stop(audioCtx.currentTime + dur);
}
function startMusic(){
  initAudio(); musicOn = true; soundBtn.textContent = '♪ music on';
  let step = 0;
  const notes = [392, 523, 659, 523, 440, 587, 784, 587];
  clearInterval(musicTimer);
  musicTimer = setInterval(()=>{ if(musicOn){ beep(notes[step++ % notes.length], .09, 'triangle', .025); } }, 210);
}
function stopMusic(){ musicOn = false; soundBtn.textContent = '♪ music off'; clearInterval(musicTimer); }
soundBtn.addEventListener('click', ()=> musicOn ? stopMusic() : startMusic());

yesBtn.addEventListener('click', () => {
  startMusic();
  beep(880,.1,'square'); setTimeout(()=>beep(1175,.12,'triangle'),110);
  mission.classList.remove('hidden');
  mission.scrollIntoView({behavior:'smooth', block:'start'});
  confettiBurst(70);
});

document.querySelectorAll('[data-unlock]').forEach(card => {
  card.addEventListener('click', () => { card.classList.add('revealed'); beep(660,.08,'triangle'); });
});

const prophecies = [
  '🍕 Snacks are highly recommended.',
  '👑 Future champion detected.',
  '😈 Prepare to lose gracefully.',
  '🎲 Chaos level: maximum.',
  '💅 Main character energy activated.',
  '🃏 Friendship may pause during the game.'
];
dice.addEventListener('click', () => {
  dice.classList.add('rolling'); beep(260,.08,'square'); setTimeout(()=>beep(520,.12,'square'),130);
  setTimeout(()=>{ dice.classList.remove('rolling'); diceMsg.textContent = prophecies[Math.floor(Math.random()*prophecies.length)]; }, 550);
});
acceptBtn.addEventListener('click', () => { accepted.classList.remove('hidden'); confettiBurst(130); beep(1046,.1,'triangle'); setTimeout(()=>beep(1568,.16,'triangle'),120); });

photoWrap.addEventListener('pointermove', e => {
  const r = photoWrap.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - .5;
  const y = (e.clientY - r.top) / r.height - .5;
  photoWrap.style.transform = `rotateY(${x*8}deg) rotateX(${-y*8}deg)`;
});
photoWrap.addEventListener('pointerleave', () => photoWrap.style.transform = 'none');
let taps = 0;
photoWrap.addEventListener('click', () => { taps++; if(taps === 5){ diceMsg.textContent = 'Secret unlocked: highly competitive players detected 😂'; confettiBurst(55); } setTimeout(()=>taps=0, 1500); });

let pieces = [];
function confettiBurst(count){
  const colors = ['#ff3df2','#36d7ff','#ffe45e','#47ff86','#ffffff'];
  for(let i=0;i<count;i++) pieces.push({
    x: Math.random()*canvas.width, y: -20, s: (5+Math.random()*8)*devicePixelRatio,
    vx: (-2+Math.random()*4)*devicePixelRatio, vy: (2+Math.random()*5)*devicePixelRatio,
    r: Math.random()*Math.PI, vr: -.18+Math.random()*.36, c: colors[Math.floor(Math.random()*colors.length)], life: 120+Math.random()*70
  });
}
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  pieces = pieces.filter(p => p.life-- > 0 && p.y < canvas.height + 50);
  for(const p of pieces){
    p.x += p.vx; p.y += p.vy; p.r += p.vr; p.vy += .035*devicePixelRatio;
    ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s*.55); ctx.restore();
  }
  requestAnimationFrame(draw);
}
draw();
