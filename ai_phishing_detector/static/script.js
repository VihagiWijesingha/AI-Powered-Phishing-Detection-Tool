/* ===== Theme (with icon swap + persistence) ===== */
function setTheme(theme){
  const body = document.body;
  if(theme === 'dark'){ body.classList.add('dark-mode'); }
  else { body.classList.remove('dark-mode'); theme = 'light'; }
  localStorage.setItem('theme', theme);
  const btn = document.getElementById('theme-toggle');
  if(btn){
    const icon = btn.querySelector('i');
    if(icon){ icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon'); lucide.createIcons(); }
  }
}
function toggleTheme(){
  const cur = localStorage.getItem('theme') || 'light';
  setTheme(cur === 'light' ? 'dark' : 'light');
}

/* Helpers */
function escapeHtml(s){return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));}
function getSelectedType(){ return document.querySelector('input[name="type"]:checked').value; }

function loadExample(){
  const type = getSelectedType();
  const samples = {
    email:`Subject: Urgent: Your Account Has Been Suspended!
From: service@paypal-security.com
To: user@example.com

Dear Valued Customer,
We detected unusual activity. Verify now: http://verify-paypal.co.uk/login?id=12345
Failure to act within 24 hours may result in permanent account termination.`,
    sms:`(SMS) Your bank account is compromised. Verify now: https://bit.ly/secure-my-bank`,
    voice:`(Voicemail) This is Officer Miller from the IRS. You must call 1-800-555-0137 immediately to avoid legal action.`
  };
  document.getElementById('content').value = samples[type];
  document.getElementById('result').innerHTML = '';
}

function showProgressRing(el, percent, severity){
  el.style.setProperty('--angle', `${percent * 3.6}deg`);
  const color = severity === 'high' ? 'var(--high)' : severity === 'mid' ? 'var(--mid)' : 'var(--safe)';
  el.style.setProperty('--color', color);
}

/* Title text */
function buildTitleText(severity, type){
  const thing = type === 'voice' ? 'voice call transcript' : type.toUpperCase();
  if(severity === 'high'){
    return `This ${thing} is a highly sophisticated phishing attempt designed to steal credentials by creating extreme urgency and directing you to a deceptive, non-official website.`;
  }
  if(severity === 'mid'){
    return `This ${thing} shows multiple warning signs and may be a phishing attempt. Verify independently and proceed with caution.`;
  }
  return `This ${thing} appears safe based on the analyzed content. No major phishing indicators were detected.`;
}

/* Default reasons */
function defaultReasons(type){
  if(type === 'sms'){
    return [
      'Shortened link obscures the destination (bit.ly).',
      'Creates urgency to secure funds immediately.',
      'Generic message not personalized to the recipient.'
    ];
  }
  if(type === 'voice'){
    return [
      'Claims to be a government agency demanding immediate action.',
      'Threatens legal consequences to pressure a response.',
      'Requests a call back to a non-official number.'
    ];
  }
  return [
    'Uses urgent and threatening language in the subject and body.',
    'Employs a generic greeting (“Dear Valued Customer”).',
    'Sender domain does not match the official brand.',
    'Embedded link points to a deceptive, non-official domain.',
    'Demands immediate “verification” via an external link.'
  ];
}

/* Render result */
function renderResult(payload, type){
  const result = document.getElementById('result');

  let score = 0;
  if(typeof payload.phishingScore === 'number'){
    score = payload.phishingScore <= 1 ? Math.round(payload.phishingScore * 100) : Math.round(payload.phishingScore);
  }
  score = Math.max(0, Math.min(100, score));

  const reasons = Array.isArray(payload.reasons) && payload.reasons.length ? payload.reasons : defaultReasons(type);
  const severity = score >= 70 ? 'high' : score >= 40 ? 'mid' : 'safe';
  const titleText = buildTitleText(severity, type);

  result.innerHTML = `
    <div class="title-banner ${severity}">
      <i data-lucide="shield-alert"></i>
      <div>${escapeHtml(titleText)}</div>
    </div>

    <div class="conf-row">
      <div class="conf-label">Phishing Confidence:</div>
      <div class="ring ${severity}" id="ring"><span>${score}%</span></div>
    </div>

    <h3 class="flags-title">AI Detected Red Flags:</h3>
    <ul class="flags">
      ${reasons.map(r=>`<li><i data-lucide="alert-circle"></i><span>${escapeHtml(r)}</span></li>`).join('')}
    </ul>
  `;

  const ring = document.getElementById('ring');
  showProgressRing(ring, score, severity);
  lucide.createIcons();
}

/* Analyze */
async function analyze(){
  const text = document.getElementById('content').value.trim();
  if(!text){ document.getElementById('result').innerHTML = '<p>Please paste content to analyze.</p>'; return; }

  const type = getSelectedType();
  try{
    const res = await fetch('/analyze', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ text, type })
    });
    const data = await res.json();
    const payload = typeof data.result === 'string' ? JSON.parse(data.result) : (data.result || data);

    if(data.success === false){
      document.getElementById('result').innerHTML = `<p style="color:var(--high)">Error: ${escapeHtml(data.error || 'Unknown error')}</p>`;
      return;
    }
    renderResult(payload || {}, type);
  }catch(err){
    document.getElementById('result').innerHTML = `<p style="color:var(--high)">Network error: ${escapeHtml(err.message || String(err))}</p>`;
  }
}

/* Init */
document.addEventListener('DOMContentLoaded', ()=>{
  setTheme(localStorage.getItem('theme') || 'light');
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  // Clear button (simplified)
  document.getElementById('clear-btn').addEventListener('click', ()=>{
    document.getElementById('content').value='';
    document.getElementById('result').innerHTML='';
  });

  document.getElementById('load-example').addEventListener('click', loadExample);
  document.getElementById('analyze-btn').addEventListener('click', analyze);

  lucide.createIcons();
});


