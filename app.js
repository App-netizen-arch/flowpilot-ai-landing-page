(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const safeStore = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch {} }
  };

  const body = document.body;
  const header = $('#siteHeader');

  // Theme -------------------------------------------------------------
  const themeToggle = $('#themeToggle');
  const savedTheme = safeStore.get('flowpilot-theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const setTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    safeStore.set('flowpilot-theme', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0a0d12' : '#f7f8fb');
    if (themeToggle) themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
  };
  setTheme(savedTheme || (systemDark ? 'dark' : 'light'));
  themeToggle?.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));

  // Announcement persistence ------------------------------------------
  const announcement = $('#announcement');
  if (safeStore.get('flowpilot-announcement-dismissed') === '1') announcement?.remove();
  $('#dismissAnnouncement')?.addEventListener('click', () => {
    safeStore.set('flowpilot-announcement-dismissed', '1');
    announcement?.remove();
  });

  // Header state ------------------------------------------------------
  const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  // Navigation dropdowns ----------------------------------------------
  const menus = $$('.nav-menu');
  const closeMenus = () => menus.forEach(menu => {
    const trigger = $('.nav-trigger', menu); const dropdown = $('.dropdown', menu);
    trigger?.setAttribute('aria-expanded', 'false');
    if (dropdown) dropdown.hidden = true;
  });
  menus.forEach(menu => {
    const trigger = $('.nav-trigger', menu); const dropdown = $('.dropdown', menu);
    trigger?.addEventListener('click', (event) => {
      event.stopPropagation();
      const wasOpen = trigger.getAttribute('aria-expanded') === 'true';
      closeMenus();
      if (!wasOpen) { trigger.setAttribute('aria-expanded', 'true'); dropdown.hidden = false; }
    });
  });
  document.addEventListener('click', (event) => { if (!event.target.closest('.nav-menu')) closeMenus(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenus(); });
  $$('.dropdown').forEach(dropdown => {
    dropdown.addEventListener('keydown', (event) => {
      if (!['ArrowDown','ArrowUp'].includes(event.key)) return;
      const items = $$('a', dropdown); const current = document.activeElement; const i = items.indexOf(current);
      event.preventDefault(); items[(i + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length]?.focus();
    });
  });

  // Mobile navigation -------------------------------------------------
  const mobileMenuToggle = $('#mobileMenuToggle');
  const mobileNav = $('#mobileNav');
  const closeMobileNav = () => { if (!mobileNav) return; mobileNav.hidden = true; mobileMenuToggle?.setAttribute('aria-expanded', 'false'); body.classList.remove('lock'); };
  mobileMenuToggle?.addEventListener('click', () => {
    const open = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
    mobileMenuToggle.setAttribute('aria-expanded', String(!open)); mobileNav.hidden = open; body.classList.toggle('lock', !open);
  });
  $$('.mobile-nav a').forEach(link => link.addEventListener('click', closeMobileNav));
  window.addEventListener('resize', () => { if (window.innerWidth > 760) closeMobileNav(); }, { passive: true });

  // Reveal on scroll ---------------------------------------------------
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -40px' });
  $$('.reveal').forEach(el => revealObserver.observe(el));

  // Hero demo behaviour -----------------------------------------------
  const progress = $('#heroProgress'); const progressValue = $('#heroProgressValue'); const taskCheck = $('#heroTaskCheck');
  const updateTask = () => {
    const done = taskCheck.classList.toggle('is-done');
    progress.style.width = done ? '100%' : '64%';
    progressValue.textContent = done ? '100%' : '64%';
    taskCheck.setAttribute('aria-label', done ? 'Reopen portfolio case study task' : 'Complete portfolio case study task');
  };
  taskCheck?.addEventListener('click', updateTask);
  taskCheck?.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateTask(); } });
  let seconds = 24 * 60 + 18; let timerRunning = true; let timer;
  const focusTimer = $('#focusTimer'); const focusToggle = $('#focusToggle');
  const renderTimer = () => { const min = String(Math.floor(seconds / 60)).padStart(2,'0'); const sec = String(seconds % 60).padStart(2,'0'); if (focusTimer) focusTimer.textContent = `${min}:${sec}`; };
  const startTimer = () => { clearInterval(timer); timer = setInterval(() => { if (!timerRunning) return; seconds = seconds <= 0 ? 24 * 60 + 18 : seconds - 1; renderTimer(); }, 1000); };
  startTimer();
  focusToggle?.addEventListener('click', () => { timerRunning = !timerRunning; focusToggle.textContent = timerRunning ? 'Pause' : 'Resume'; });
  $('#applyPlan')?.addEventListener('click', (e) => { e.currentTarget.textContent = 'Plan applied ✓'; e.currentTarget.disabled = true; });

  // Demo modal ---------------------------------------------------------
  const demoModal = $('#demoModal'); const watchDemo = $('#watchDemo');
  let previousFocus = null;
  const openModal = (modal) => { if (!modal) return; previousFocus = document.activeElement; modal.hidden = false; body.classList.add('lock'); $('[data-close-modal]', modal)?.focus(); };
  const closeModal = () => { if (!demoModal) return; demoModal.hidden = true; body.classList.remove('lock'); previousFocus?.focus?.(); };
  watchDemo?.addEventListener('click', () => openModal(demoModal));
  $$('#demoModal [data-close-modal]').forEach(btn => btn.addEventListener('click', closeModal));

  // Demo tabs ----------------------------------------------------------
  const demoTabs = $$('[data-demo-tab]');
  demoTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      demoTabs.forEach(t => t.setAttribute('aria-selected', 'false'));
      tab.setAttribute('aria-selected', 'true');
      $$('.demo-panel').forEach(panel => panel.hidden = true);
      $(`#panel-${tab.dataset.demoTab}`).hidden = false;
    });
    tab.addEventListener('keydown', e => {
      if (!['ArrowRight','ArrowLeft','Home','End'].includes(e.key)) return;
      e.preventDefault();
      const target = e.key === 'Home' ? 0 : e.key === 'End' ? demoTabs.length - 1 : (index + (e.key === 'ArrowRight' ? 1 : -1) + demoTabs.length) % demoTabs.length;
      demoTabs[target].focus(); demoTabs[target].click();
    });
  });

  // Feature storytelling ---------------------------------------------
  const featureItems = $$('.feature-item');
  const featureScreen = $('[data-feature-screen]');
  const featureStates = {
    planning: { label: 'AI PLANNER', title: 'Launch client portal', progress: '68%', tone: 'planning' },
    prioritization: { label: 'PRIORITIES', title: 'Ship onboarding before polish', progress: '82%', tone: 'prioritization' },
    focus: { label: 'FOCUS MODE', title: 'Deep work · 47:12 remaining', progress: '74%', tone: 'focus' },
    automation: { label: 'AUTOMATIONS', title: 'Weekly report → scheduled', progress: '91%', tone: 'automation' },
    knowledge: { label: 'KNOWLEDGE', title: '12 useful project decisions', progress: '57%', tone: 'knowledge' },
    intelligence: { label: 'INTELLIGENCE', title: 'Momentum ↑ 18% this week', progress: '88%', tone: 'intelligence' }
  };
  const updateFeatureVisual = key => {
    const data = featureStates[key]; if (!featureScreen || !data) return;
    featureScreen.style.opacity = '0'; featureScreen.style.transform = 'translateY(8px)';
    window.setTimeout(() => {
      const small = $('.screen-heading small', featureScreen); const title = $('.screen-heading b', featureScreen); const bar = $('.screen-progress span', featureScreen);
      if (small) small.textContent = data.label; if (title) title.textContent = data.title; if (bar) bar.style.width = data.progress;
      featureScreen.dataset.featureScreen = data.tone; featureScreen.style.opacity = '1'; featureScreen.style.transform = 'none';
    }, 120);
  };
  const featureObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { featureItems.forEach(i => i.classList.remove('is-active')); entry.target.classList.add('is-active'); updateFeatureVisual(entry.target.dataset.feature); }
  }), { rootMargin:'-40% 0px -45% 0px', threshold:0 });
  featureItems.forEach(item => { featureObserver.observe(item); item.addEventListener('click', () => { featureItems.forEach(i => i.classList.remove('is-active')); item.classList.add('is-active'); updateFeatureVisual(item.dataset.feature); }); });

  // Persona switcher --------------------------------------------------
  const personaData = {
    student: { label:'FOR STUDENTS', title:'Turn deadlines into a calm weekly rhythm.', copy:'Balance classes, tuition, projects, and revision without rebuilding the plan every Sunday.', benefits:['↗ Study blocks that move with deadlines','✓ Revision queue with clear next actions','◌ Focus sessions built around your real day'], cta:'Build my student flow', goal:'Physics exam prep', rows:[['MON','Review mechanics','done'],['TUE','Practice problems','current'],['WED','Timed paper',''],['THU','Weak-topic pass','']] },
    freelancer: { label:'FOR FREELANCERS', title:'Ship client work without living in your inbox.', copy:'Keep delivery, outreach, revisions, and admin visible without letting urgent messages define your week.', benefits:['↗ Protect billable focus blocks','✓ Turn client feedback into next actions','◌ Batch follow-up automatically'], cta:'Build my freelance flow', goal:'Client portal v2', rows:[['MON','Draft case study','done'],['TUE','Client revision block','current'],['WED','Invoice + follow-up',''],['THU','Portfolio publish','']] },
    developer: { label:'FOR DEVELOPERS', title:'Keep the build moving when priorities shift.', copy:'Break large technical goals into shippable slices, protect debugging time, and keep the next useful commit obvious.', benefits:['↗ Decompose epics into focused slices','✓ Protect uninterrupted coding blocks','◌ Surface blockers before they stall a sprint'], cta:'Build my developer flow', goal:'Ship API v2', rows:[['MON','Schema migration','done'],['TUE','Endpoint implementation','current'],['WED','Integration tests',''],['THU','Release checklist','']] },
    founder: { label:'FOR FOUNDERS', title:'Keep the company moving without carrying it all in your head.', copy:'Connect strategy to the week’s highest-leverage actions while making room for customers, hiring, and operations.', benefits:['↗ Prioritize by leverage, not noise','✓ Create a realistic founder week','◌ Turn decisions into follow-up automatically'], cta:'Build my founder flow', goal:'Q3 launch', rows:[['MON','Customer interviews','done'],['TUE','Product decision block','current'],['WED','Hiring outreach',''],['THU','Launch review','']] },
    team: { label:'FOR TEAMS', title:'Give everyone a shared sense of next.', copy:'Keep goals, ownership, and follow-through aligned without adding a layer of process that slows the work down.', benefits:['↗ Shared priorities with clear ownership','✓ Lightweight weekly planning','◌ Automate status and reporting'], cta:'Build my team flow', goal:'Release 2.4', rows:[['MON','Bug triage','done'],['TUE','Release candidate','current'],['WED','QA pass',''],['THU','Launch notes','']] }
  };
  const personaButtons = $$('.persona-tabs button');
  const renderPersona = key => {
    const d = personaData[key] || personaData.student;
    $('#personaLabel').textContent=d.label; $('#personaTitle').textContent=d.title; $('#personaCopy').textContent=d.copy; $('#personaCta').childNodes[0].textContent=`${d.cta} `; $('#personaGoal').textContent=d.goal;
    $('#personaBenefits').innerHTML = d.benefits.map(x=>`<span>${x}</span>`).join('');
    $('.persona-timeline').innerHTML = d.rows.map(r=>`<div><span>${r[0]}</span><b>${r[1]}</b><i class="${r[2]==='done'?'done':r[2]==='current'?'current':''}">${r[2]==='done'?'✓':r[2]==='current'?'•':'○'}</i></div>`).join('');
  };
  personaButtons.forEach((button,index) => {
    button.addEventListener('click',()=>{ const key=button.dataset.persona; personaButtons.forEach(b=>{b.classList.remove('is-active');b.setAttribute('aria-selected','false')});button.classList.add('is-active');button.setAttribute('aria-selected','true');renderPersona(key); });
    button.addEventListener('keydown',e=>{ if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?personaButtons.length-1:(index+(e.key==='ArrowRight'?1:-1)+personaButtons.length)%personaButtons.length;personaButtons[next].focus();personaButtons[next].click(); });
  });

  // Metric count-up ----------------------------------------------------
  const counted = new WeakSet();
  const metricObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting || counted.has(entry.target)) return;
    counted.add(entry.target); const el=entry.target; const target=Number(el.dataset.count); const suffix=el.dataset.suffix||''; const duration=900; const start=performance.now();
    const tick=now=>{ const p=Math.min((now-start)/duration,1); const eased=1-Math.pow(1-p,3); const value=target<10?Number((target*eased).toFixed(1)):Math.round(target*eased); el.textContent=`${value}${suffix}`; if(p<1)requestAnimationFrame(tick); }; requestAnimationFrame(tick);
  }),{threshold:.5});
  $$('[data-count]').forEach(el=>metricObserver.observe(el));

  // Testimonials ------------------------------------------------------
  const testimonials = [
    {quote:'“FlowPilot is the first productivity tool that feels like it is reducing my workload instead of giving me another dashboard to maintain.”',name:'Ari Rahman',role:'Product Designer · Frame',avatar:'AR'},
    {quote:'“It changed my Monday completely. I spend the first hour shipping instead of deciding what Monday should be.”',name:'Farah Khan',role:'Independent Creator',avatar:'FK'},
    {quote:'“The best part is how it notices when the plan is no longer realistic and helps me recover without the guilt spiral.”',name:'Minh Tran',role:'Startup Founder',avatar:'MT'}
  ];
  const quote=$('#testimonialQuote'), tName=$('#testimonialName'), tRole=$('#testimonialRole'), tAvatar=$('#testimonialAvatar'), tIndex=$('#testimonialIndex'); let testimonialIndex=0; let carouselTimer;
  const renderTestimonial = idx => { testimonialIndex=(idx+testimonials.length)%testimonials.length; const t=testimonials[testimonialIndex]; quote.textContent=t.quote;tName.textContent=t.name;tRole.textContent=t.role;tAvatar.textContent=t.avatar;tIndex.textContent=String(testimonialIndex+1).padStart(2,'0'); $$('.testimonial-card').forEach((c,i)=>c.classList.toggle('is-active',i===testimonialIndex)); };
  $('#testimonialPrev')?.addEventListener('click',()=>renderTestimonial(testimonialIndex-1)); $('#testimonialNext')?.addEventListener('click',()=>renderTestimonial(testimonialIndex+1));
  $$('.testimonial-card').forEach((card,i)=>card.addEventListener('click',()=>renderTestimonial(i)));
  const testimonialArea=$('.testimonial-layout'); const startCarousel=()=>{clearInterval(carouselTimer);carouselTimer=setInterval(()=>renderTestimonial(testimonialIndex+1),6500)};const stopCarousel=()=>clearInterval(carouselTimer);testimonialArea?.addEventListener('mouseenter',stopCarousel);testimonialArea?.addEventListener('mouseleave',startCarousel);testimonialArea?.addEventListener('focusin',stopCarousel);testimonialArea?.addEventListener('focusout',startCarousel);startCarousel();

  // Pricing ------------------------------------------------------------
  let billing='monthly'; const billingButtons=$$('[data-billing]'); const proPrice=$('[data-price-pro]'); const proPeriod=$('[data-price-period]'); const teamPrice=$('[data-price-team]'); const teamPeriod=$('[data-price-team-period]'); const teamRange=$('#teamSeats'); const teamOutput=$('#teamSeatsOutput'); const teamEstimate=$('#teamEstimate');
  const renderPricing=()=>{ const yearly=billing==='yearly'; const pro=yearly?12:15; const team=yearly?23:29; proPrice.textContent=`$${pro}`;proPeriod.textContent=yearly?'/ month equivalent':'/ month';teamPrice.textContent=`$${team}`;teamPeriod.textContent=yearly?'/ user / month equivalent':'/ user / month';const seats=Number(teamRange.value);teamOutput.value=seats;teamOutput.textContent=seats;teamEstimate.textContent=`$${seats*team}`;billingButtons.forEach(b=>b.classList.toggle('is-active',b.dataset.billing===billing)); };
  billingButtons.forEach(b=>b.addEventListener('click',()=>{billing=b.dataset.billing;renderPricing()}));teamRange?.addEventListener('input',renderPricing);renderPricing();

  // FAQ: one open on mobile, multiple on desktop ---------------------
  const faqDetails=$$('#faqAccordion details');
  faqDetails.forEach(detail=>detail.addEventListener('toggle',()=>{ if(!detail.open || window.innerWidth>760)return; faqDetails.forEach(other=>{if(other!==detail)other.open=false}); }));

  // Signup form -------------------------------------------------------
  const form=$('#signupForm'), email=$('#email'), firstName=$('#firstName'), emailError=$('#emailError'), formStatus=$('#formStatus'), submit=$('#signupSubmit');
  const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  form?.addEventListener('submit', async (event)=>{
    event.preventDefault(); emailError.textContent=''; formStatus.textContent=''; email.classList.remove('field-invalid');
    const value=email.value.trim();
    if(!value){emailError.textContent='Enter your email to continue.';email.classList.add('field-invalid');email.focus();return;}
    if(value.length>254){emailError.textContent='That email address is too long.';email.classList.add('field-invalid');email.focus();return;}
    if(!emailPattern.test(value)){emailError.textContent='Enter a valid email address, like you@example.com.';email.classList.add('field-invalid');email.focus();return;}
    form.classList.add('is-loading');submit.disabled=true;
    await new Promise(resolve=>setTimeout(resolve,950));
    form.classList.remove('is-loading');submit.disabled=false;
    formStatus.textContent=`You're on the list${firstName.value.trim()?`, ${firstName.value.trim()}`:''}. Check your inbox for the next step.`;
    form.reset();
  });

  // Newsletter --------------------------------------------------------
  $('#newsletterForm')?.addEventListener('submit', e=>{ e.preventDefault(); const input=$('#newsletterEmail'); const status=$('#newsletterStatus'); const valid=emailPattern.test(input.value.trim()); status.textContent=valid?'Subscribed — see you next month.':'Enter a valid email address.'; if(valid) input.value=''; });

  // Command palette ---------------------------------------------------
  const palette=$('#commandPalette'), commandInput=$('#commandInput'), commandList=$('#commandList'); let commandIndex=0; let commandPreviousFocus=null;
  const commands=[...$$('[data-command-action]',commandList)];
  const closeCommand=()=>{if(!palette)return;palette.hidden=true;body.classList.remove('lock');commandPreviousFocus?.focus?.()};
  const openCommand=()=>{commandPreviousFocus=document.activeElement;palette.hidden=false;body.classList.add('lock');commandInput.value='';commandIndex=0;renderCommandFilter();commandInput.focus()};
  const renderCommandFilter=()=>{const query=commandInput.value.toLowerCase().trim();let visible=[];commands.forEach(c=>{const show=!query||c.textContent.toLowerCase().includes(query);c.hidden=!show;if(show)visible.push(c);c.classList.remove('is-active')});if(visible.length){visible[commandIndex=Math.min(commandIndex,visible.length-1)].classList.add('is-active')}};
  const activateCommand=()=>{const visible=commands.filter(c=>!c.hidden);const cmd=visible[commandIndex];if(!cmd)return;const action=cmd.dataset.commandAction;closeCommand();if(action==='focus')$('#focusToggle')?.click();if(action==='task'){$('#heroTaskCheck')?.focus();$('#heroTaskCheck')?.click()}if(action==='planner')document.querySelector('#product-demo')?.scrollIntoView({behavior:'smooth'});if(action==='analytics')document.querySelector('#metrics')?.scrollIntoView({behavior:'smooth'});if(action==='ai'){openModal(demoModal)}};
  commandInput?.addEventListener('input',()=>{commandIndex=0;renderCommandFilter()});commandInput?.addEventListener('keydown',e=>{const visible=commands.filter(c=>!c.hidden);if(e.key==='ArrowDown'){e.preventDefault();commandIndex=(commandIndex+1)%visible.length;renderCommandFilter()}if(e.key==='ArrowUp'){e.preventDefault();commandIndex=(commandIndex-1+visible.length)%visible.length;renderCommandFilter()}if(e.key==='Enter'){e.preventDefault();activateCommand()}if(e.key==='Escape')closeCommand()});commands.forEach(c=>c.addEventListener('click',()=>{const visible=commands.filter(x=>!x.hidden);commandIndex=visible.indexOf(c);activateCommand()}));$$('[data-close-command]').forEach(el=>el.addEventListener('click',closeCommand));
  document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCommand()}if(!palette?.hidden&&e.key==='Escape')closeCommand();if(!demoModal?.hidden&&e.key==='Escape')closeModal()});

  // Modal focus handling ----------------------------------------------
  document.addEventListener('keydown', e=>{
    if (e.key !== 'Tab' || demoModal?.hidden) return;
    const focusable=$$('button:not([disabled]),a[href],input,textarea,[tabindex]:not([tabindex="-1"])',demoModal).filter(el=>el.offsetParent!==null); if(!focusable.length)return;
    const first=focusable[0], last=focusable[focusable.length-1]; if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  });

  // Apply a small visual pulse to the hero activity without loops -----
  window.setTimeout(()=>{$('.assistant-state')?.classList.add('is-live')},900);

})();