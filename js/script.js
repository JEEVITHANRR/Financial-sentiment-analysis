// =============================================
// MATRIX RAIN
// =============================================
(function(){
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$€£¥₹∑∏∆';
  const fontSize = 13;
  const cols = Math.floor(canvas.width / fontSize);
  const drops = Array(cols).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px Share Tech Mono';
    drops.forEach((y,i) => {
      const char = chars[Math.floor(Math.random()*chars.length)];
      ctx.fillStyle = Math.random() > 0.95 ? '#c9a84c' : '#00ff41';
      ctx.fillText(char, i*fontSize, y*fontSize);
      if (y*fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }
  setInterval(draw, 50);
  window.addEventListener('resize', ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
})();

// =============================================
// THREE.JS GLOBE
// =============================================
(function(){
  const canvas = document.getElementById('globe-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
  renderer.setSize(500,500);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 3;

  // Globe wireframe
  const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
  const sphereMat = new THREE.MeshPhongMaterial({
    color: 0xc9a84c,
    wireframe: true,
    transparent: true,
    opacity: 0.25,
  });
  const globe = new THREE.Mesh(sphereGeo, sphereMat);
  scene.add(globe);

  // Inner glow sphere
  const innerGeo = new THREE.SphereGeometry(0.97, 32, 32);
  const innerMat = new THREE.MeshPhongMaterial({
    color: 0x00ff41,
    wireframe: false,
    transparent: true,
    opacity: 0.04,
  });
  scene.add(new THREE.Mesh(innerGeo, innerMat));

  // Hot spots
  const spotMat = new THREE.MeshBasicMaterial({ color: 0xc9a84c });
  const spotGeo = new THREE.SphereGeometry(0.025, 8, 8);
  const spots = [
    [40,74],[35,139],[51,0],[37,-122],[28,77],[1,103],[55,37],[48,2],
    [-23,-46],[-33,151],[19,-99],[25,55]
  ];

  spots.forEach(([lat,lon]) => {
    const phi = (90-lat)*Math.PI/180;
    const theta = (lon+180)*Math.PI/180;
    const spot = new THREE.Mesh(spotGeo, spotMat.clone());
    spot.position.set(
      -(Math.sin(phi)*Math.cos(theta)),
      Math.cos(phi),
      Math.sin(phi)*Math.sin(theta)
    );
    spot.userData.pulsePhase = Math.random()*Math.PI*2;
    scene.add(spot);
  });

  // Orbit rings
  for(let i=0;i<3;i++){
    const ringGeo = new THREE.TorusGeometry(1.1+i*0.08, 0.003, 8, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: i===0 ? 0x00ff41 : 0xc9a84c,
      transparent: true,
      opacity: 0.15,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI/2 + i*0.3;
    ring.rotation.z = i*0.5;
    scene.add(ring);
  }

  const light = new THREE.PointLight(0xc9a84c, 1.5, 10);
  light.position.set(3,3,3);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x00ff41, 0.3));

  let t=0;
  function animate(){
    requestAnimationFrame(animate);
    t+=0.008;
    globe.rotation.y += 0.003;
    globe.rotation.x = Math.sin(t*0.3)*0.1;
    scene.children.forEach(child => {
      if(child.userData.pulsePhase !== undefined){
        const s = 1+Math.sin(t*3+child.userData.pulsePhase)*0.4;
        child.scale.set(s,s,s);
      }
    });
    renderer.render(scene,camera);
  }
  animate();
})();

// =============================================
// CLOCK + TICKER
// =============================================
function updateClock(){
  document.getElementById('hclock').textContent =
    new Date().toLocaleTimeString('en-US',{hour12:false,hour:'2-digit',minute:'2-digit',second:'2-digit'});
}
setInterval(updateClock,1000); updateClock();

const tickerData = [
  {sym:'AAPL',price:'182.45',chg:'+1.24',pct:'+0.68%',up:true},
  {sym:'TSLA',price:'248.30',chg:'-4.12',pct:'-1.63%',up:false},
  {sym:'MSFT',price:'415.22',chg:'+3.88',pct:'+0.94%',up:true},
  {sym:'GOOGL',price:'178.44',chg:'+0.92',pct:'+0.52%',up:true},
  {sym:'AMZN',price:'195.67',chg:'-2.34',pct:'-1.18%',up:false},
  {sym:'NVDA',price:'875.34',chg:'+12.45',pct:'+1.44%',up:true},
  {sym:'META',price:'521.80',chg:'+5.67',pct:'+1.10%',up:true},
  {sym:'NFLX',price:'625.43',chg:'-8.90',pct:'-1.40%',up:false},
  {sym:'SPY',price:'524.12',chg:'+1.83',pct:'+0.35%',up:true},
  {sym:'BTC/USD',price:'67,240',chg:'+1,240',pct:'+1.88%',up:true},
];

function buildTicker(){
  const doubled = [...tickerData,...tickerData];
  const html = doubled.map(t=>`
    <div class="tick-item">
      <span class="tick-sym">${t.sym}</span>
      <span class="tick-price">${t.price}</span>
      <span class="${t.up?'tick-up':'tick-down'}">${t.chg} (${t.pct})</span>
    </div>
  `).join('');
  document.getElementById('ticker').innerHTML = html;
}
buildTicker();

// =============================================
// VADER-STYLE SENTIMENT SCORING
// =============================================
const positiveWords = ['surge','rally','bullish','record','growth','profit','beat','exceed','strong','innovation','breakthrough','gains','rise','soar','positive','upgrade','buy','outperform','recovery','expand'];
const negativeWords = ['crash','plunge','bearish','loss','decline','miss','weak','drop','fall','concern','risk','downgrade','sell','recession','layoff','cut','warning','fear','uncertainty','volatile'];

function scoreSentiment(text){
  const lower = text.toLowerCase();
  let score = 50;
  positiveWords.forEach(w=>{ if(lower.includes(w)) score += 6; });
  negativeWords.forEach(w=>{ if(lower.includes(w)) score -= 5; });
  return Math.min(100, Math.max(0, score + (Math.random()-0.5)*10));
}

function getSentimentLabel(score){
  if(score >= 70) return {label:'POSITIVE', cls:'badge-pos'};
  if(score <= 35) return {label:'NEGATIVE', cls:'badge-neg'};
  return {label:'NEUTRAL', cls:'badge-neu'};
}

// =============================================
// NEWS DATA (Simulated live feed)
// =============================================
const newsPool = [
  "Federal Reserve signals potential rate cuts amid cooling inflation data",
  "Apple reports record Q2 earnings, iPhone sales beat analyst expectations",
  "Tesla stock drops after disappointing delivery numbers fall short of forecasts",
  "NVIDIA's AI chip demand continues to surge, supply constraints ease",
  "Goldman Sachs upgrades S&P 500 target citing strong corporate earnings",
  "Crypto markets rally as Bitcoin breaks resistance level at $68,000",
  "Microsoft Azure cloud revenue grows 31% YoY, beating Wall Street estimates",
  "Oil prices decline on demand concerns from weak Chinese economic data",
  "Amazon expanding AI investment, plans to hire 5,000 ML engineers in 2026",
  "Recession fears resurface as manufacturing PMI contracts for third month",
  "Meta's advertising revenue hits all-time high, user growth impresses investors",
  "Bond yields surge creating pressure on growth stocks, tech sector rattled",
  "Google launches breakthrough AI model, shares jump 4% in after-hours",
  "Bank of India raises interest rates, markets react with broad selloff",
  "Netflix subscriber growth beats guidance, ad-supported tier sees strong uptake",
  "Semiconductor stocks soar after Taiwan production capacity expansion announced",
  "Inflation data shows stubborn core CPI, dampening rate cut expectations",
  "Warren Buffett's Berkshire Hathaway increases cash reserves to record $168B",
  "Emerging markets outperform US equities as dollar weakens this quarter",
  "Fintech startup funding drops 34% YoY as venture capital tightens criteria",
];

const sources = ['Bloomberg','Reuters','CNBC','WSJ','FT','MarketWatch','Seeking Alpha','Yahoo Finance'];

let newsItems = [];
function generateNews(){
  return newsPool.map((headline,i)=>({
    headline,
    source: sources[i%sources.length],
    score: scoreSentiment(headline),
    time: `${Math.floor(Math.random()*59).toString().padStart(2,'0')}m ago`,
  }));
}

function renderNews(){
  newsItems = generateNews();
  const feed = document.getElementById('news-feed');
  feed.innerHTML = '';
  newsItems.slice(0,12).forEach((item,i)=>{
    const {label,cls} = getSentimentLabel(item.score);
    const div = document.createElement('div');
    div.className='news-item';
    div.style.animationDelay = (i*0.05)+'s';
    div.innerHTML=`
      <div class="news-meta">
        <span class="sentiment-badge ${cls}">${label}</span>
        <span class="news-source">${item.source}</span>
        <span class="news-time">${item.time}</span>
      </div>
      <div class="news-headline">${item.headline}</div>
    `;
    feed.appendChild(div);
  });
}

// =============================================
// COUNT-UP
// =============================================
function countUp(el, end, duration, suffix='', decimals=0, prefix=''){
  const start = performance.now();
  const fn = now=>{
    const p = Math.min((now-start)/duration,1);
    const e = 1-Math.pow(1-p,4);
    const v = end*e;
    el.textContent = prefix+(decimals>0?v.toFixed(decimals):Math.round(v))+suffix;
    if(p<1) requestAnimationFrame(fn);
  };
  requestAnimationFrame(fn);
}

// =============================================
// KPI INIT
// =============================================
function initKPIs(){
  setTimeout(()=>{
    countUp(document.getElementById('k-sentiment'),72,1800,'',0);
    countUp(document.getElementById('k-fg'),58,1600,'',0);
    countUp(document.getElementById('k-news'),2847,2000,'',0);
    countUp(document.getElementById('k-pos'),67,1500,'%',0);
    countUp(document.getElementById('k-neg'),18,1200,'%',0);
  },300);
}

// =============================================
// GAUGE
// =============================================
function animateGauge(score){
  const fill = document.getElementById('gauge-fill');
  const needle = document.getElementById('gauge-needle');
  const num = document.getElementById('gauge-num');
  const txt = document.getElementById('gauge-text');

  const totalLen = 283;
  const offset = totalLen - (score/100)*totalLen;
  const angle = -90 + (score/100)*180;

  setTimeout(()=>{
    fill.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.34,1.56,0.64,1)';
    fill.style.strokeDashoffset = offset;
    needle.style.transition = 'transform 2s cubic-bezier(0.34,1.56,0.64,1)';
    needle.style.transform = `rotate(${angle}deg)`;
    countUp(num, score, 2000, '', 0);

    if(score>=70){ txt.textContent='BULLISH'; txt.className='gauge-label-sub col-green'; }
    else if(score<=35){ txt.textContent='BEARISH'; txt.className='gauge-label-sub col-red'; }
    else { txt.textContent='NEUTRAL'; txt.className='gauge-label-sub col-gold'; }
  }, 600);
}

// =============================================
// SPARKLINES
// =============================================
const stockData = [
  {sym:'AAPL',name:'Apple Inc.',price:'182.45',chg:'+1.24',pct:'+0.68%',up:true,data:[178,180,179,181,180,182,183,182,184,182,183,182]},
  {sym:'NVDA',name:'NVIDIA Corp.',price:'875.34',chg:'+12.45',pct:'+1.44%',up:true,data:[848,855,860,852,862,869,875,868,872,877,875,875]},
  {sym:'TSLA',name:'Tesla Inc.',price:'248.30',chg:'-4.12',pct:'-1.63%',up:false,data:[258,255,252,257,254,250,248,252,249,248,247,248]},
  {sym:'MSFT',name:'Microsoft',price:'415.22',chg:'+3.88',pct:'+0.94%',up:true,data:[408,410,411,409,412,413,411,414,415,413,415,415]},
];

function renderSparklines(){
  const grid = document.getElementById('spark-grid');
  grid.innerHTML = stockData.map((s,i)=>`
    <div class="spark-item">
      <div class="spark-header">
        <span class="spark-sym">${s.sym}</span>
        <span class="spark-price">$${s.price}</span>
      </div>
      <div class="spark-chg ${s.up?'col-green':'col-red'}">${s.chg} (${s.pct})</div>
      <canvas id="spark-${i}" height="40"></canvas>
    </div>
  `).join('');

  stockData.forEach((s,i)=>{
    const ctx = document.getElementById(`spark-${i}`).getContext('2d');
    const color = s.up ? '#00ff41' : '#ff2244';
    const grad = ctx.createLinearGradient(0,0,0,40);
    grad.addColorStop(0, s.up?'rgba(0,255,65,0.3)':'rgba(255,34,68,0.3)');
    grad.addColorStop(1,'transparent');
    new Chart(ctx,{
      type:'line',
      data:{labels:s.data.map((_,j)=>j),datasets:[{data:s.data,borderColor:color,borderWidth:1.5,backgroundColor:grad,fill:true,tension:0.4,pointRadius:0}]},
      options:{responsive:true,animation:{duration:1500},plugins:{legend:{display:false},tooltip:{enabled:false}},scales:{x:{display:false},y:{display:false}}}
    });
  });
}

// =============================================
// TREND CHART
// =============================================
function renderTrendChart(){
  const ctx = document.getElementById('trendChart').getContext('2d');
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const bullData = [58,62,55,68,72,69,72];
  const bearData = [42,38,45,32,28,31,28];

  const g1 = ctx.createLinearGradient(0,0,0,130);
  g1.addColorStop(0,'rgba(0,255,65,0.3)'); g1.addColorStop(1,'transparent');
  const g2 = ctx.createLinearGradient(0,0,0,130);
  g2.addColorStop(0,'rgba(255,34,68,0.3)'); g2.addColorStop(1,'transparent');

  new Chart(ctx,{
    type:'line',
    data:{
      labels:days,
      datasets:[
        {label:'Bullish%',data:bullData,borderColor:'#00ff41',borderWidth:2,backgroundColor:g1,fill:true,tension:0.4,pointRadius:3,pointBackgroundColor:'#00ff41'},
        {label:'Bearish%',data:bearData,borderColor:'#ff2244',borderWidth:2,backgroundColor:g2,fill:true,tension:0.4,pointRadius:3,pointBackgroundColor:'#ff2244'},
      ]
    },
    options:{
      responsive:true,
      animation:{duration:2000},
      plugins:{
        legend:{labels:{color:'#555548',font:{size:10,family:'Share Tech Mono'},padding:12,usePointStyle:true}},
        tooltip:{backgroundColor:'rgba(0,0,0,0.9)',borderColor:'#c9a84c',borderWidth:1,titleColor:'#c9a84c',bodyColor:'#e8e8e0',callbacks:{label:c=>` ${c.dataset.label}: ${c.parsed.y}%`}}
      },
      scales:{
        x:{grid:{color:'rgba(201,168,76,0.06)'},ticks:{color:'#555548',font:{size:9,family:'Share Tech Mono'}}},
        y:{grid:{color:'rgba(201,168,76,0.06)'},ticks:{color:'#555548',font:{size:9,family:'Share Tech Mono'},callback:v=>v+'%'},min:0,max:100}
      }
    }
  });
}

// =============================================
// SCATTER CHART
// =============================================
function renderScatterChart(){
  const ctx = document.getElementById('scatterChart').getContext('2d');
  const stocks = [
    {label:'AAPL',data:[{x:72,y:0.68}],bg:'rgba(0,255,65,0.7)'},
    {label:'NVDA',data:[{x:81,y:1.44}],bg:'rgba(201,168,76,0.8)'},
    {label:'TSLA',data:[{x:31,y:-1.63}],bg:'rgba(255,34,68,0.7)'},
    {label:'MSFT',data:[{x:67,y:0.94}],bg:'rgba(0,200,255,0.7)'},
    {label:'AMZN',data:[{x:44,y:-1.18}],bg:'rgba(255,120,0,0.7)'},
    {label:'META',data:[{x:74,y:1.10}],bg:'rgba(150,80,255,0.7)'},
    {label:'GOOGL',data:[{x:63,y:0.52}],bg:'rgba(0,255,150,0.7)'},
    {label:'NFLX',data:[{x:29,y:-1.40}],bg:'rgba(255,200,0,0.7)'},
  ];

  new Chart(ctx,{
    type:'scatter',
    data:{datasets:stocks.map(s=>({label:s.label,data:s.data,backgroundColor:s.bg,pointRadius:10,pointHoverRadius:13}))},
    options:{
      responsive:true,
      animation:{duration:1800},
      plugins:{
        legend:{display:false},
        tooltip:{backgroundColor:'rgba(0,0,0,0.9)',borderColor:'#c9a84c',borderWidth:1,titleColor:'#c9a84c',bodyColor:'#e8e8e0',
          callbacks:{label:c=>`${c.dataset.label} — Sentiment: ${c.parsed.x} | Return: ${c.parsed.y}%`}}
      },
      scales:{
        x:{title:{display:true,text:'SENTIMENT SCORE',color:'#555548',font:{size:9,family:'Share Tech Mono'}},grid:{color:'rgba(201,168,76,0.05)'},ticks:{color:'#555548',font:{size:9,family:'Share Tech Mono'}},min:0,max:100},
        y:{title:{display:true,text:'PRICE CHANGE %',color:'#555548',font:{size:9,family:'Share Tech Mono'}},grid:{color:'rgba(201,168,76,0.05)'},ticks:{color:'#555548',font:{size:9,family:'Share Tech Mono'},callback:v=>v+'%'}}
      }
    }
  });
}

// =============================================
// BREADTH CHART
// =============================================
function renderBreadthChart(){
  const ctx = document.getElementById('breadthChart').getContext('2d');
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  new Chart(ctx,{
    type:'bar',
    data:{
      labels:days,
      datasets:[
        {label:'Advancing',data:[312,289,345,398,421,376,402],backgroundColor:'rgba(0,255,65,0.6)',borderColor:'#00ff41',borderWidth:1},
        {label:'Declining',data:[188,211,155,102,79,124,98],backgroundColor:'rgba(255,34,68,0.5)',borderColor:'#ff2244',borderWidth:1},
      ]
    },
    options:{
      responsive:true,
      animation:{duration:1800},
      plugins:{
        legend:{labels:{color:'#555548',font:{size:9,family:'Share Tech Mono'},usePointStyle:true}},
        tooltip:{backgroundColor:'rgba(0,0,0,0.9)',borderColor:'#c9a84c',borderWidth:1,titleColor:'#c9a84c',bodyColor:'#e8e8e0'}
      },
      scales:{
        x:{stacked:false,grid:{color:'rgba(201,168,76,0.04)'},ticks:{color:'#555548',font:{size:9,family:'Share Tech Mono'}}},
        y:{grid:{color:'rgba(201,168,76,0.04)'},ticks:{color:'#555548',font:{size:9,family:'Share Tech Mono'}}}
      }
    }
  });
}

// =============================================
// RADAR CHART
// =============================================
function renderRadarChart(){
  const ctx = document.getElementById('radarChart').getContext('2d');
  new Chart(ctx,{
    type:'radar',
    data:{
      labels:['Technology','Finance','Healthcare','Energy','Consumer','Materials','Utilities'],
      datasets:[{
        label:'Sentiment Score',
        data:[78,62,55,42,68,48,51],
        borderColor:'#c9a84c',
        backgroundColor:'rgba(201,168,76,0.12)',
        borderWidth:2,
        pointBackgroundColor:'#c9a84c',
        pointRadius:4,
      }]
    },
    options:{
      responsive:true,
      animation:{duration:2000},
      plugins:{legend:{display:false},tooltip:{backgroundColor:'rgba(0,0,0,0.9)',borderColor:'#c9a84c',borderWidth:1,titleColor:'#c9a84c',bodyColor:'#e8e8e0'}},
      scales:{r:{
        grid:{color:'rgba(201,168,76,0.1)'},
        angleLines:{color:'rgba(201,168,76,0.1)'},
        pointLabels:{color:'#555548',font:{size:9,family:'Share Tech Mono'}},
        ticks:{display:false},
        min:0,max:100,
      }}
    }
  });
}

// =============================================
// FEAR & GREED
// =============================================
function animateFG(val){
  const needle = document.getElementById('fg-needle');
  const display = document.getElementById('fg-val');
  const label = document.getElementById('fg-label');
  const angle = -90 + (val/100)*180;
  setTimeout(()=>{
    needle.style.transition='transform 2.5s cubic-bezier(0.34,1.56,0.64,1)';
    needle.style.transform=`rotate(${angle}deg)`;
    countUp(display, val, 2200, '', 0);
    if(val>=75){ label.textContent='EXTREME GREED'; label.style.color='#00ff41'; }
    else if(val>=55){ label.textContent='GREED'; label.style.color='#88cc00'; }
    else if(val>=45){ label.textContent='NEUTRAL'; label.style.color='#c9a84c'; }
    else if(val>=25){ label.textContent='FEAR'; label.style.color='#ff8800'; }
    else { label.textContent='EXTREME FEAR'; label.style.color='#ff2244'; }
  }, 800);
}

// =============================================
// SENTIMENT BATTLE
// =============================================
const battleStocks = {
  b1:{sym:'AAPL',name:'APPLE INC.',score:74,pos:64,neu:22,neg:14,color:'#00ff41',data:[62,65,68,71,69,73,74]},
  b2:{sym:'TSLA',name:'TESLA INC.',score:31,pos:28,neu:24,neg:48,color:'#ff2244',data:[45,42,38,34,36,30,31]},
};

function renderBattle(){
  ['b1','b2'].forEach(k=>{
    const d = battleStocks[k];
    setTimeout(()=>{
      countUp(document.getElementById(`${k}-score`), d.score, 2000, '', 0);
      document.getElementById(`${k}-bar`).style.width = d.score+'%';
      countUp(document.getElementById(`${k}-pos`), d.pos, 1500, '%', 0);
      countUp(document.getElementById(`${k}-neu`), d.neu, 1500, '%', 0);
      countUp(document.getElementById(`${k}-neg`), d.neg, 1500, '%', 0);
      document.getElementById(`${k}-sym`).textContent = d.sym;
      document.getElementById(`${k}-name`).textContent = d.name;

      const mood = d.score>=60?'BULLISH':d.score<=40?'BEARISH':'NEUTRAL';
      document.getElementById(`${k}-mood`).textContent = mood;
    }, 600);

    // Mini sparkline
    const ctx = document.getElementById(`${k}-chart`).getContext('2d');
    const grad = ctx.createLinearGradient(0,0,0,80);
    grad.addColorStop(0, d.color.replace(')',',0.3)').replace('rgb','rgba'));
    grad.addColorStop(1,'transparent');
    new Chart(ctx,{
      type:'line',
      data:{labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],datasets:[{data:d.data,borderColor:d.color,borderWidth:2,backgroundColor:grad,fill:true,tension:0.4,pointRadius:3,pointBackgroundColor:d.color}]},
      options:{responsive:true,animation:{duration:2000},plugins:{legend:{display:false},tooltip:{backgroundColor:'rgba(0,0,0,0.9)',borderColor:'#c9a84c',borderWidth:1,titleColor:'#c9a84c',bodyColor:'#e8e8e0',callbacks:{label:c=>` Score: ${c.parsed.y}`}}},
        scales:{x:{grid:{color:'rgba(201,168,76,0.04)'},ticks:{color:'#555548',font:{size:8,family:'Share Tech Mono'}}},y:{grid:{color:'rgba(201,168,76,0.04)'},ticks:{color:'#555548',font:{size:8,family:'Share Tech Mono'}},min:0,max:100}}}
    });
  });
}

// =============================================
// GSAP CARD ANIMATIONS
// =============================================
function animateAll(){
  const els = document.querySelectorAll('.card,.kpi-card,.battle-card');
  els.forEach((el,i)=>{
    gsap.to(el,{opacity:1,y:0,duration:0.55,delay:i*0.07,ease:'power3.out'});
  });
}

// =============================================
// LIVE REFRESH — news every 8s
// =============================================
let newsIndex = 0;
function addLiveNewsItem(){
  const feed = document.getElementById('news-feed');
  if(!feed) return;
  const headline = newsPool[(newsIndex++)%newsPool.length];
  const score = scoreSentiment(headline);
  const {label,cls} = getSentimentLabel(score);
  const source = sources[Math.floor(Math.random()*sources.length)];
  const div = document.createElement('div');
  div.className='news-item';
  div.innerHTML=`
    <div class="news-meta">
      <span class="sentiment-badge ${cls}">${label}</span>
      <span class="news-source">${source}</span>
      <span class="news-time">just now</span>
    </div>
    <div class="news-headline">${headline}</div>
  `;
  feed.insertBefore(div, feed.firstChild);
  if(feed.children.length>20) feed.removeChild(feed.lastChild);
}

// =============================================
// INIT
// =============================================
window.addEventListener('load',()=>{
  renderNews();
  renderSparklines();
  renderTrendChart();
  renderScatterChart();
  renderBreadthChart();
  renderRadarChart();
  renderBattle();
  animateGauge(72);
  animateFG(58);
  initKPIs();
  animateAll();

  // Live updates
  setInterval(addLiveNewsItem, 8000);
  setInterval(()=>{
    const newScore = 55 + Math.random()*30;
    animateGauge(Math.round(newScore));
    countUp(document.getElementById('k-sentiment'), Math.round(newScore), 1000,'',0);
  }, 30000);
});
