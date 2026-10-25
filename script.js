(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const canvas = $('#starfield');
  const ctx = canvas.getContext('2d');
  let stars = [], width = 0, height = 0, dpr = 1;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resizeStars() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = width * dpr; canvas.height = height * dpr;
    canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(220, Math.floor(width * height / 6500));
    stars = Array.from({length: count}, () => ({x: Math.random()*width, y:Math.random()*height, r:Math.random()*1.25+.2, a:Math.random()*.65+.15, s:Math.random()*.18+.025, p:Math.random()*Math.PI*2}));
  }
  function drawStars(t=0) {
    ctx.clearRect(0,0,width,height);
    for (const s of stars) {
      const flicker = reduced ? 0 : Math.sin(t*.0007*s.s*8+s.p)*.18;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle = `rgba(190,211,255,${Math.max(.08,Math.min(.95,s.a+flicker))})`; ctx.fill();
      if(s.r>1.1){ctx.beginPath();ctx.arc(s.x,s.y,s.r*3,0,Math.PI*2);ctx.fillStyle='rgba(108,244,255,.035)';ctx.fill();}
    }
    if(!reduced) requestAnimationFrame(drawStars);
  }
  resizeStars(); drawStars();
  window.addEventListener('resize', resizeStars);

  const progress = $('#scrollProgress');
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
  }, {passive:true});

  const glow = $('#cursorGlow');
  window.addEventListener('pointermove', e => {
    if(e.pointerType === 'mouse') { glow.style.left = e.clientX+'px'; glow.style.top = e.clientY+'px'; }
  }, {passive:true});

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){ entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
    });
  }, {threshold:.12});
  $$('.reveal').forEach(el => revealObserver.observe(el));

  // Subtle pointer-responsive tilt for the orbital illustration.
  const cosmos = $('#cosmos');
  cosmos?.addEventListener('pointermove', e => {
    if(e.pointerType !== 'mouse' || reduced) return;
    const r = cosmos.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    cosmos.style.transform = `translateY(-4px) rotateX(${y*-5}deg) rotateY(${x*7}deg)`;
  });
  cosmos?.addEventListener('pointerleave', () => cosmos.style.transform = '');

  // Project filtering
  $$('.filter').forEach(btn => btn.addEventListener('click', () => {
    $$('.filter').forEach(b => b.classList.toggle('active', b===btn));
    const filter = btn.dataset.filter;
    $$('.project-card').forEach(card => {
      const show = filter === 'all' || card.dataset.category.split(' ').includes(filter);
      card.classList.toggle('hidden', !show);
    });
  }));

  // Mobile navigation
  const nav = $('.desktop-nav');
  $('#menuToggle').addEventListener('click', () => nav.classList.toggle('open'));
  $$('.desktop-nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

  // Command palette
  const overlay = $('#commandOverlay'), input = $('#commandInput'), results = $('#commandResults');
  let selected = 0;
  function openCommand(){overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');input.value='';filterCommands();setTimeout(()=>input.focus(),30);}
  function closeCommand(){overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');}
  function filterCommands(){
    const q=input.value.toLowerCase().trim();let visible=0;
    $$('.command-results button').forEach(btn=>{
      const show=btn.textContent.toLowerCase().includes(q);btn.hidden=!show;if(show){btn.classList.toggle('selected',visible===selected);visible++;}
    });selected=0;
  }
  function jump(btn){if(!btn)return;const target=$(btn.dataset.target);closeCommand();target?.scrollIntoView({behavior:reduced?'auto':'smooth'});}
  $('#commandOpen').addEventListener('click',openCommand);
  $('#commandClose').addEventListener('click',closeCommand);
  overlay.addEventListener('click',e=>{if(e.target===overlay)closeCommand();});
  input.addEventListener('input',filterCommands);
  $$('.command-results button').forEach(btn=>btn.addEventListener('click',()=>jump(btn)));
  document.addEventListener('keydown',e=>{
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCommand();}
    if(e.key==='Escape')closeCommand();
    if(!overlay.classList.contains('open'))return;
    const visible=$$('.command-results button:not([hidden])');
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();selected=(selected+(e.key==='ArrowDown'?1:-1)+visible.length)%Math.max(visible.length,1);visible.forEach((b,i)=>b.classList.toggle('selected',i===selected));}
    if(e.key==='Enter'){e.preventDefault();jump(visible[selected]);}
  });

  // Copy-to-clipboard helper with graceful fallback.
  const toast = $('#toast'); let toastTimer;
  function notify(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2200);}
  $('#copyEmail').addEventListener('click', async()=>{
    try { await navigator.clipboard.writeText('sadabwinchester@gmail.com'); notify('EMAIL COPIED TO CLIPBOARD'); }
    catch { const area=document.createElement('textarea');area.value='sadabwinchester@gmail.com';document.body.append(area);area.select();document.execCommand('copy');area.remove();notify('EMAIL COPIED TO CLIPBOARD');}
  });
  $('#year').textContent = new Date().getFullYear();
})();