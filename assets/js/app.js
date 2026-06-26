const UNI = (() => {
  const keys = {
    users:'uniwork_v6_users', session:'uniwork_v6_session', jobs:'uniwork_v6_jobs', resumes:'uniwork_v6_resumes', apps:'uniwork_v6_apps', posts:'uniwork_v6_posts', reports:'uniwork_v6_reports', requests:'uniwork_v6_requests', orders:'uniwork_v6_orders', theme:'uniwork_v6_theme', lang:'uniwork_v6_lang', saved:'uniwork_v6_saved'
  };
  const seedJobs = [
    {id:'job-101', company:'HYUNDAI Global', logo:'HY', title:'2026 Global Talent Internship', type:'Internship', area:'Seoul', visa:'D-10', lang:'Korean · English', tags:['서울 중구','인턴','영업/CS'], status:'approved', pick:true, salary:'면접 후 결정', desc:'글로벌 고객 커뮤니케이션과 리서치 업무를 함께할 외국인 인턴을 모집합니다.'},
    {id:'job-102', company:'BANILA CO', logo:'BA', title:'Global Marketing Assistant', type:'Part-time', area:'Gyeonggi', visa:'D-2', lang:'English', tags:['경기','파트타임','마케팅/콘텐츠'], status:'approved', pick:true, salary:'시급 12,000원', desc:'해외 SNS 콘텐츠 운영과 번역 보조 업무를 담당합니다.'},
    {id:'job-103', company:'GENTLE MONSTER', logo:'GM', title:'Store Branding Team Assistant', type:'Full-time', area:'Seoul', visa:'E-7 note', lang:'Korean', tags:['E-7 검토','서울 성수','서비스'], status:'approved', pick:true, salary:'연봉 협의', desc:'글로벌 스토어 브랜딩 프로젝트 지원 업무입니다.'},
    {id:'job-104', company:'WEBTOON Bridge', logo:'WB', title:'Localization Specialist - French', type:'Contract', area:'Remote', visa:'F-series', lang:'French · English', tags:['재택','계약직','번역/콘텐츠'], status:'approved', pick:false, salary:'프로젝트 단가', desc:'프랑스어 현지화 품질 검수와 콘텐츠 번역을 담당합니다.'},
    {id:'job-105', company:'Korea Medical Link', logo:'KM', title:'Medical Coordinator', type:'Full-time', area:'Busan', visa:'F-series', lang:'Russian · Korean', tags:['부산','정규직','의료/통역'], status:'approved', pick:false, salary:'연봉 3,000만원~', desc:'외국인 환자 통역 및 병원 예약 관리를 담당합니다.'},
    {id:'job-106', company:'Hotel Skypark', logo:'HS', title:'Front Desk Staff', type:'Part-time', area:'Seoul', visa:'D-2', lang:'English · Korean', tags:['서울 명동','파트타임','호텔'], status:'approved', pick:false, salary:'시급 13,000원', desc:'호텔 프론트 고객 응대와 외국어 안내 업무입니다.'}
  ];
  const seedPosts = [
    {id:'post-1', category:'취업 질문', title:'D-2 학생도 방학 중에는 더 오래 일할 수 있나요?', body:'시간제 취업 허가 조건이 헷갈립니다. 준비 서류를 알고 싶어요.', author:'Mina', reports:0, created:new Date().toISOString()},
    {id:'post-2', category:'아르바이트 후기', title:'면접 전에 근로계약서 꼭 확인하세요', body:'시급, 근무시간, 휴게시간을 문자로만 받지 말고 계약서로 확인하는 게 좋아요.', author:'Anu', reports:0, created:new Date().toISOString()}
  ];
  const qs = (s, r=document) => r.querySelector(s);
  const qsa = (s, r=document) => [...r.querySelectorAll(s)];
  const get = (k, fallback) => JSON.parse(localStorage.getItem(k) || JSON.stringify(fallback));
  const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const uid = (p='id') => `${p}-${Date.now()}-${Math.random().toString(16).slice(2,7)}`;
  const now = () => new Date().toISOString();
  const session = () => get(keys.session, null);
  const currentUser = () => {
    const s = session(); if(!s) return null;
    return get(keys.users, []).find(u => u.id === s.userId) || null;
  };
  function money(n){ return `₩${Number(n).toLocaleString('ko-KR')}`; }
  function boot(){
    if(!localStorage.getItem(keys.jobs)) set(keys.jobs, seedJobs);
    if(!localStorage.getItem(keys.posts)) set(keys.posts, seedPosts);
    [keys.users, keys.apps, keys.resumes, keys.reports, keys.requests, keys.orders, keys.saved].forEach(k => { if(!localStorage.getItem(k)) set(k, []); });
    document.documentElement.dataset.theme = localStorage.getItem(keys.theme) || 'light';
    document.documentElement.dataset.lang = localStorage.getItem(keys.lang) || 'ko';
    bindGlobal();
    renderAuthState(); renderJobs(); renderResumePreview(); renderCommunity(); renderAdmin(); renderAccount(); renderCompanyDashboard(); renderCounters(); reveal();
  }
  function bindGlobal(){
    qsa('[data-theme-toggle]').forEach(btn => btn.onclick = () => { const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = next; localStorage.setItem(keys.theme,next); });
    qsa('[data-lang-toggle]').forEach(btn => btn.onclick = () => { const next = document.documentElement.dataset.lang === 'en' ? 'ko' : 'en'; document.documentElement.dataset.lang = next; localStorage.setItem(keys.lang,next); translateLite(next); });
    translateLite(document.documentElement.dataset.lang);
    const menu = qs('[data-mobile-menu]'); qsa('[data-menu-toggle]').forEach(btn => btn.onclick = () => menu?.classList.toggle('open'));
    qsa('[data-modal-open]').forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset.modalOpen)));
    qsa('[data-modal-close]').forEach(btn => btn.addEventListener('click', () => btn.closest('.modal')?.classList.remove('open')));
    qsa('.modal').forEach(m => m.addEventListener('click', e => { if(e.target === m) m.classList.remove('open'); }));
    qsa('.faq-q').forEach(q => q.addEventListener('click', () => q.parentElement.classList.toggle('open')));
    qs('#loginForm') && (qs('#loginForm').onsubmit = login);
    qsa('[data-register-role]').forEach(f => f.onsubmit = register);
    qs('#jobForm') && (qs('#jobForm').onsubmit = addJob);
    qs('#resumeForm') && (qs('#resumeForm').onsubmit = addResume);
    qs('#postForm') && (qs('#postForm').onsubmit = addPost);
    qs('#requestForm') && (qs('#requestForm').onsubmit = addRequest);
    qs('#reportForm') && (qs('#reportForm').onsubmit = addReport);
    qs('#consultForm') && (qs('#consultForm').onsubmit = addConsult);
    qsa('[data-premium-plan]').forEach(btn => btn.onclick = () => orderPremium(btn.dataset.premiumPlan));
    qsa('[data-logout]').forEach(btn => btn.onclick = logout);
    qsa('[data-reset]').forEach(btn => btn.onclick = resetDemo);
    qsa('[data-export]').forEach(btn => btn.onclick = exportData);
    qs('#filterForm') && (qs('#filterForm').oninput = renderJobs);
  }
  function translateLite(lang){
    qsa('[data-en]').forEach(el => { if(!el.dataset.ko) el.dataset.ko = el.innerHTML; el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.ko; });
    qsa('[data-lang-label]').forEach(el => el.textContent = lang === 'en' ? 'KO' : 'EN');
  }
  function openModal(id){ qs(`#${id}`)?.classList.add('open'); }
  function reveal(){ const obs = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('on'); }), {threshold:.12}); qsa('.fade-up').forEach(el => obs.observe(el)); }
  function formObj(form){ return Object.fromEntries(new FormData(form).entries()); }
  function register(e){
    e.preventDefault(); const form=e.target; const role=form.dataset.registerRole; const data=formObj(form); const users=get(keys.users,[]);
    if(users.some(u => u.email === data.email)){ alert('이미 가입된 이메일입니다. 로그인해주세요.'); return; }
    const user={id:uid('user'), role, email:data.email, password:data.password, name:data.name || data.companyName || data.managerName, created:now(), profile:data};
    users.push(user); set(keys.users, users); set(keys.session, {userId:user.id, role:user.role, created:now()});
    alert(role === 'company' ? '기업 회원가입이 완료되었습니다.' : '개인 회원가입이 완료되었습니다.');
    location.href = role === 'company' ? 'company-dashboard.html' : 'account.html';
  }
  function login(e){
    e.preventDefault(); const data=formObj(e.target); const user=get(keys.users,[]).find(u => u.email === data.email && u.password === data.password);
    if(!user){ alert('이메일 또는 비밀번호를 확인해주세요. 데모에서는 회원가입한 정보로 로그인합니다.'); return; }
    set(keys.session, {userId:user.id, role:user.role, created:now()});
    location.href = user.role === 'company' ? 'company-dashboard.html' : 'account.html';
  }
  function logout(){ localStorage.removeItem(keys.session); location.href='index.html'; }
  function renderAuthState(){
    const u = currentUser();
    qsa('[data-auth-state]').forEach(box => {
      if(!u){ box.innerHTML = `<a class="auth-link" href="login.html">로그인</a><a class="auth-link primary" href="signup-seeker.html">회원가입</a>`; return; }
      const dash = u.role === 'company' ? 'company-dashboard.html' : 'account.html';
      box.innerHTML = `<a class="auth-link primary" href="${dash}">${u.name || u.email}</a><button class="auth-link logout" data-logout>로그아웃</button>`;
    });
    qsa('[data-logout]').forEach(btn => btn.onclick = logout);
  }
  function filteredJobs(){
    let jobs = get(keys.jobs, seedJobs).filter(j => j.status === 'approved'); const f=qs('#filterForm');
    if(f){ const term=(f.querySelector('[name="term"]')?.value || '').toLowerCase(); const area=f.querySelector('[name="area"]')?.value || ''; const type=f.querySelector('[name="type"]')?.value || ''; const visa=f.querySelector('[name="visa"]')?.value || '';
      jobs = jobs.filter(j => (!term || `${j.title} ${j.company} ${j.desc}`.toLowerCase().includes(term)) && (!area || j.area===area) && (!type || j.type===type) && (!visa || j.visa.includes(visa)) ); }
    return jobs;
  }
  function renderJobs(){
    qsa('[data-job-list]').forEach(list => {
      const compact = list.dataset.compact === 'true'; const jobs=filteredJobs();
      list.innerHTML = jobs.map(j => `<article class="job-card fade-up ${j.pick?'pick':''}"><div class="job-logo">${j.logo||'UW'}</div><div><h3 class="job-title">${j.title}</h3><p class="job-meta"><b>${j.company}</b> · ${j.area} · ${j.visa}</p><p class="job-desc">${compact ? j.desc.slice(0,70)+'...' : j.desc}</p><div class="job-tags">${(j.tags||[]).map(t=>`<span>${t}</span>`).join('')}</div></div><div class="job-actions"><button class="heart" data-save-job="${j.id}">♡</button><button class="smallbtn" data-apply-job="${j.id}">지원</button></div></article>`).join('');
    });
    qsa('[data-recent-jobs]').forEach(el => { const jobs=filteredJobs().slice(0,3); el.innerHTML = jobs.map(j=>`<div class="mini-row"><div><b>${j.title}</b><br><span>${j.company} · ${j.visa}</span></div><span class="pill">최근</span></div>`).join(''); });
    qsa('[data-apply-job]').forEach(btn => btn.onclick = () => applyJob(btn.dataset.applyJob)); qsa('[data-save-job]').forEach(btn => btn.onclick = () => { btn.textContent='♥'; btn.style.color='#ef4444'; });
  }
  function applyJob(jobId){
    const u=currentUser(); if(!u || u.role!=='seeker'){ alert('개인회원으로 로그인해야 지원할 수 있습니다.'); location.href='login.html'; return; }
    const job=get(keys.jobs,[]).find(j=>j.id===jobId); const resumes=get(keys.resumes,[]); const latest=resumes.filter(r=>r.userId===u.id).at(-1);
    const apps=get(keys.apps,[]); apps.push({id:uid('app'), jobId, jobTitle:job?.title, company:job?.company, userId:u.id, applicant:u.name, visa:u.profile?.visa || latest?.visa || '-', status:'submitted', created:now()}); set(keys.apps,apps);
    alert('지원이 완료되었습니다. 개인 대시보드와 관리자 페이지에서 확인할 수 있습니다.'); renderAccount(); renderAdmin();
  }
  function addJob(e){
    e.preventDefault(); const d=formObj(e.target); const u=currentUser();
    const jobs=get(keys.jobs,[]); jobs.push({id:uid('job'), company:d.company || u?.profile?.companyName || 'Demo Company', logo:(d.company||'UW').slice(0,2).toUpperCase(), title:d.title, type:d.type, area:d.area, visa:d.visa||'검토 필요', lang:d.lang||'Korean', tags:[d.area,d.type,d.category||'일반'], status:'pending', pick:false, salary:d.salary, desc:d.desc, ownerId:u?.id || 'guest', created:now()}); set(keys.jobs,jobs);
    alert('공고가 등록되었습니다. 관리자 승인 후 노출됩니다.'); e.target.reset(); renderAdmin(); renderCompanyDashboard();
  }
  function addResume(e){
    e.preventDefault(); const u=currentUser(); const d=formObj(e.target); const resumes=get(keys.resumes,[]);
    resumes.push({...d,id:uid('resume'),userId:u?.id||'guest',created:now()}); set(keys.resumes,resumes); alert('이력서가 저장되었습니다.'); renderResumePreview(); renderAccount(); e.target.reset();
  }
  function renderResumePreview(){
    const u=currentUser(); const resumes=get(keys.resumes,[]); const latest=(u?resumes.filter(r=>r.userId===u.id):resumes).at(-1) || {name:'Ariunaa B.', nationality:'Mongolia', school:'Partner University', major:'Business', visa:'D-2', korean:'TOPIK 4', english:'Business', intro:'Marketing internship seeker'};
    qsa('[data-resume-preview]').forEach(el => { el.innerHTML = `<div class="app-card"><h3>${latest.name||'Unnamed Student'}</h3><p class="job-meta">${latest.nationality||'-'} · ${latest.school||'-'} · ${latest.visa||'-'}</p><div class="job-tags"><span>${latest.major||'Major'}</span><span>${latest.korean||'Korean'}</span><span>${latest.english||'English'}</span></div><p>${latest.intro||'자기소개가 표시됩니다.'}</p></div>`; });
  }
  function addPost(e){ e.preventDefault(); const d=formObj(e.target); const u=currentUser(); const posts=get(keys.posts,[]); posts.unshift({id:uid('post'),category:d.category,title:d.title,body:d.body,author:u?.name||d.author||'Guest',reports:0,created:now()}); set(keys.posts,posts); e.target.reset(); renderCommunity(); alert('커뮤니티 글이 등록되었습니다.'); }
  function renderCommunity(){ qsa('[data-post-list]').forEach(el => { const posts=get(keys.posts,[]); el.innerHTML = posts.map(p=>`<article class="post-card"><div class="post-meta">${p.category} · ${p.author} · 신고 ${p.reports||0}</div><h3>${p.title}</h3><p>${p.body}</p><button class="smallbtn red" data-report-post="${p.id}">신고</button></article>`).join(''); }); qsa('[data-report-post]').forEach(btn=>btn.onclick=()=>{ const posts=get(keys.posts,[]); const p=posts.find(x=>x.id===btn.dataset.reportPost); if(p)p.reports=(p.reports||0)+1; set(keys.posts,posts); const reports=get(keys.reports,[]); reports.push({id:uid('report'),target:'community',targetTitle:p?.title||'post',reason:'커뮤니티 신고',status:'received',created:now()}); set(keys.reports,reports); renderCommunity(); renderAdmin(); }); }
  function addReport(e){ e.preventDefault(); const d=formObj(e.target); const reports=get(keys.reports,[]); reports.push({id:uid('report'),target:d.target||'job',targetTitle:d.title||'위험 공고',reason:d.reason,status:'received',created:now()}); set(keys.reports,reports); e.target.reset(); alert('신고가 접수되었습니다.'); renderAdmin(); }
  function addRequest(e){ e.preventDefault(); const d=formObj(e.target); const u=currentUser(); const requests=get(keys.requests,[]); requests.push({id:uid('req'),userId:u?.id||'guest',name:u?.name||d.name||'Guest',type:d.type,desc:d.desc,status:'received',created:now()}); set(keys.requests,requests); e.target.reset(); alert('상담 신청이 접수되었습니다.'); renderAdmin(); renderAccount(); }
  function addConsult(e){ e.preventDefault(); const d=formObj(e.target); const requests=get(keys.requests,[]); requests.push({id:uid('req'),name:d.company,type:'기업 채용 상담',desc:d.desc||d.contact,status:'received',created:now()}); set(keys.requests,requests); e.target.reset(); alert('기업 채용 상담이 접수되었습니다.'); renderAdmin(); }
  function orderPremium(plan){
    const u=currentUser(); if(!u || u.role!=='seeker'){ alert('개인회원 로그인 후 신청할 수 있습니다.'); location.href='login.html'; return; }
    const plans={admin_fast:{label:'행정 패스트트랙',en:'Admin Fast Track',amount:49000},match_boost:{label:'매칭 부스트',en:'Match Boost',amount:39000}}; const p=plans[plan];
    if(!p) return; const orders=get(keys.orders,[]); orders.push({id:uid('pay'),userId:u.id,userName:u.name,plan:p.label,amount:p.amount,status:'paid_demo',created:now()}); set(keys.orders,orders);
    alert(`${p.label} 데모 결제가 완료되었습니다. 실제 결제는 PG 연동 후 가능합니다.`); renderAccount(); renderAdmin();
  }
  function renderAccount(){
    const u=currentUser(); qsa('[data-account-name]').forEach(el=>el.textContent=u?.name||'Guest'); qsa('[data-account-role]').forEach(el=>el.textContent=u?.role==='company'?'기업회원':'개인회원');
    const resumes=get(keys.resumes,[]).filter(r=>!u || r.userId===u.id); const apps=get(keys.apps,[]).filter(a=>!u || a.userId===u.id); const orders=get(keys.orders,[]).filter(o=>!u || o.userId===u.id); const reqs=get(keys.requests,[]).filter(r=>!u || r.userId===u.id);
    const percent = Math.min(100, 25 + (resumes.length?45:0) + (orders.length?20:0) + (apps.length?10:0)); qsa('[data-profile-progress]').forEach(el=>{el.style.width=percent+'%';}); qsa('[data-profile-progress-text]').forEach(el=>el.textContent=percent+'%');
    qsa('[data-my-apps]').forEach(el=>{ el.innerHTML = apps.length? apps.map(a=>`<div class="mini-row"><div><b>${a.jobTitle}</b><br><span>${a.company} · ${new Date(a.created).toLocaleDateString()}</span></div><span class="pill green">${a.status}</span></div>`).join('') : `<div class="empty-state">아직 지원한 공고가 없습니다.</div>`; });
    qsa('[data-my-orders]').forEach(el=>{ el.innerHTML = orders.length? orders.map(o=>`<div class="mini-row"><div><b>${o.plan}</b><br><span>${money(o.amount)} · 데모 결제</span></div><span class="pill gold">${o.status}</span></div>`).join('') : `<div class="empty-state">유료 서비스 신청 내역이 없습니다.</div>`; });
    qsa('[data-my-requests]').forEach(el=>{ el.innerHTML = reqs.length? reqs.map(r=>`<div class="mini-row"><div><b>${r.type}</b><br><span>${r.desc}</span></div><span class="pill">${r.status}</span></div>`).join('') : `<div class="empty-state">상담 신청 내역이 없습니다.</div>`; });
  }
  function renderCompanyDashboard(){
    const u=currentUser(); const jobs=get(keys.jobs,[]).filter(j=>!u || j.ownerId===u.id); const apps=get(keys.apps,[]).filter(a=>jobs.some(j=>j.id===a.jobId));
    qsa('[data-company-jobs]').forEach(el=>{ el.innerHTML = jobs.length? jobs.map(j=>`<div class="mini-row"><div><b>${j.title}</b><br><span>${j.area} · ${j.type}</span></div><span class="pill ${j.status==='approved'?'green':'gold'}">${j.status}</span></div>`).join('') : `<div class="empty-state">등록한 공고가 없습니다.</div>`; });
    qsa('[data-company-apps]').forEach(el=>{ el.innerHTML = apps.length? apps.map(a=>`<div class="mini-row"><div><b>${a.applicant}</b><br><span>${a.jobTitle} · ${a.visa}</span></div><span class="pill">${a.status}</span></div>`).join('') : `<div class="empty-state">아직 지원자가 없습니다.</div>`; });
  }
  function renderAdmin(){
    const jobs=get(keys.jobs,[]), apps=get(keys.apps,[]), reports=get(keys.reports,[]), requests=get(keys.requests,[]), users=get(keys.users,[]), orders=get(keys.orders,[]);
    const metric={jobs:jobs.length,pending:jobs.filter(j=>j.status==='pending').length,apps:apps.length,reports:reports.length,requests:requests.length,users:users.length,orders:orders.length}; Object.entries(metric).forEach(([k,v])=>qsa(`[data-metric="${k}"]`).forEach(el=>el.textContent=v));
    qsa('[data-admin-jobs]').forEach(tb=>tb.innerHTML = jobs.map(j=>`<tr><td><b>${j.title}</b><br><span class="job-meta">${j.company}</span></td><td>${j.area} · ${j.type}<br>${j.visa}</td><td><span class="status ${j.status}">${j.status}</span></td><td><button class="smallbtn" data-job-status="${j.id}:approved">승인</button><button class="smallbtn red" data-job-status="${j.id}:rejected">반려</button></td></tr>`).join(''));
    qsa('[data-admin-apps]').forEach(tb=>tb.innerHTML = apps.map(a=>`<tr><td>${a.applicant}</td><td>${a.jobTitle}<br><span class="job-meta">${a.company}</span></td><td>${a.visa}</td><td><span class="status reviewing">${a.status}</span></td></tr>`).join(''));
    qsa('[data-admin-reports]').forEach(tb=>tb.innerHTML = reports.map(r=>`<tr><td>${r.targetTitle||r.target}</td><td>${r.reason}</td><td><span class="status ${r.status}">${r.status}</span></td><td><button class="smallbtn" data-report-resolve="${r.id}">처리</button></td></tr>`).join(''));
    qsa('[data-admin-requests]').forEach(tb=>tb.innerHTML = requests.map(r=>`<tr><td>${r.name}</td><td>${r.type}</td><td>${r.desc}</td><td><span class="status ${r.status}">${r.status}</span></td></tr>`).join(''));
    qsa('[data-admin-users]').forEach(tb=>tb.innerHTML = users.map(u=>`<tr><td><b>${u.name}</b><br><span class="job-meta">${u.email}</span></td><td>${u.role}</td><td>${u.profile?.nationality || u.profile?.companyName || '-'}</td><td>${new Date(u.created).toLocaleDateString()}</td></tr>`).join(''));
    qsa('[data-admin-orders]').forEach(tb=>tb.innerHTML = orders.map(o=>`<tr><td>${o.userName}</td><td>${o.plan}</td><td>${money(o.amount)}</td><td><span class="status completed">${o.status}</span></td></tr>`).join(''));
    qsa('[data-job-status]').forEach(btn=>btn.onclick=()=>{ const [id,status]=btn.dataset.jobStatus.split(':'); const j=jobs.find(x=>x.id===id); if(j) j.status=status; set(keys.jobs,jobs); renderAdmin(); renderJobs(); });
    qsa('[data-report-resolve]').forEach(btn=>btn.onclick=()=>{ const r=reports.find(x=>x.id===btn.dataset.reportResolve); if(r) r.status='resolved'; set(keys.reports,reports); renderAdmin(); });
  }
  function renderCounters(){ qsa('[data-count]').forEach(el=>{ const type=el.dataset.count; if(type==='seekers') el.textContent=get(keys.users,[]).filter(u=>u.role==='seeker').length; if(type==='companies') el.textContent=get(keys.users,[]).filter(u=>u.role==='company').length; }); }
  function exportData(){ const data={users:get(keys.users,[]),jobs:get(keys.jobs,[]),resumes:get(keys.resumes,[]),applications:get(keys.apps,[]),posts:get(keys.posts,[]),reports:get(keys.reports,[]),requests:get(keys.requests,[]),orders:get(keys.orders,[])}; const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='uniwork-v6-data.json'; a.click(); }
  function resetDemo(){ if(!confirm('데모 데이터를 초기화할까요?')) return; Object.values(keys).forEach(k=>localStorage.removeItem(k)); location.reload(); }
  document.addEventListener('DOMContentLoaded', boot);
  return {boot};
})();
