/* ─── DATA ─── */
const POSTS = [
  { id:'jun01',day:10,wday:'Ter',pillar:'c',num:'01/10',
    title:'Chegamos. E o que voce vai ver aqui e real.',
    desc:'Reel de abertura. A academia sem filtro — professores, alunos, estrutura, rotina. O novo padrao de conteudo da It\'s Power.',
    tags:['Reel de abertura','Autenticidade cinematografica','Primeiro contato com a marca']},
  { id:'jun02',day:12,wday:'Qui',pillar:'v',num:'02/10 - Namorados',
    title:'O que casais que treinam juntos dividem — alem do treino.',
    desc:'Cumplicidade real no esforco compartilhado. Sem cliche. Fechamento elegante para o Dia dos Namorados.',
    tags:['Data especial 12/06','Estilo de vida e conexao','Alto reshare organico']},
  { id:'jun03',day:14,wday:'Sab',pillar:'a',num:'03/10',
    title:'O exercicio que voce faz todo treino — provavelmente errado.',
    desc:'Professor demonstra versao errada vs. correta. Camera lateral, didatica limpa. Informacao que vale o salvamento.',
    tags:['Alto salvamento','Autoridade tecnica','Diferencial de acompanhamento']},
  { id:'jun04',day:17,wday:'Ter',pillar:'c',num:'04/10',
    title:'O que acontece aqui quando ninguem esta filmando.',
    desc:'Camera ativa desde a abertura. Professor preparando, alunos chegando pelo nome. O cuidado invisivel que define a experiencia.',
    tags:['Humanizacao premium','Cuidado como diferencial','Estilo documental']},
  { id:'jun05',day:19,wday:'Qui',pillar:'a',num:'05/10',
    title:'Tres razoes para nao abandonar o treino no frio.',
    desc:'O inverno vai passar. A decisao de hoje, nao. Argumentos diretos com urgencia elegante — sem pressao.',
    tags:['Timing sazonal','Compartilhamento organico','Construcao de longo prazo']},
  { id:'jun06',day:21,wday:'Sab',pillar:'c',num:'06/10 - Inverno',
    title:'Primeiro dia de inverno. A It\'s Power esta assim.',
    desc:'Contraste cinematografico: frio la fora, energia aqui dentro. Frase iconica para reshare: "Aqui o frio nao e desculpa. E combustivel."',
    tags:['Data especial 21/06','Pertencimento visual','Frase iconica para reshare']},
  { id:'jun07',day:24,wday:'Ter',pillar:'v',num:'07/10',
    title:'[Nome] — uma historia que comecou aqui dentro.',
    desc:'Depoimento real. Fala natural, camera proxima. Sem roteiro. A melhor prova do que a gente faz nao esta em numeros — esta nas pessoas.',
    tags:['Prova social autentica','Legendado obrigatorio','Comunidade como diferencial']},
  { id:'jun08',day:26,wday:'Qui',pillar:'a',num:'08/10',
    title:'As 3 perguntas que todo aluno faz — respondidas sem filtro.',
    desc:'Sem enrolacao. Sem resposta generica. So o que funciona. Autoridade acessivel — formato que pode virar serie semanal.',
    tags:['Q&A — autoridade acessivel','Potencial de serie','Alto salvamento e compartilhamento']},
  { id:'jun09',day:28,wday:'Sab',pillar:'c',num:'09/10',
    title:'30 segundos. Sem pausar. Sem desculpa. Voce aguenta?',
    desc:'Parece pouco — ate voce tentar. Desafio real com reacao genuina. Formato viral com alta retencao.',
    tags:['Formato viral','Desafio com autenticidade','Alta retencao e marcacoes']},
  { id:'jun10',day:30,wday:'Seg',pillar:'v',num:'10/10',
    title:'Junho acabou. O que a gente construiu, fica.',
    desc:'Montagem dos melhores momentos do mes. Gratidao genuina + convite direto: "Primeira visita por nossa conta."',
    tags:['Fechamento com proposito','Convite — nao panfleto','Antecipacao para julho']},
];

const PILLAR = {
  a:{label:'Autoridade',icon:'\u{1F3C6}',badge:'cb-a',calCls:'a-p',
     typeCss:'background:var(--blue-light);color:var(--blue-dark)',dateBg:'background:linear-gradient(135deg,#1D4ED8,#2563EB)',stripe:'background:linear-gradient(180deg,var(--blue),#60A5FA)'},
  c:{label:'Conexao',icon:'\u{1F91D}',badge:'cb-c',calCls:'c-p',
     typeCss:'background:var(--green-light);color:var(--green-dark)',dateBg:'background:linear-gradient(135deg,#065F46,#10B981)',stripe:'background:linear-gradient(180deg,var(--green),#34D399)'},
  v:{label:'Conversao',icon:'\u{1F3AF}',badge:'cb-v',calCls:'v-p',
     typeCss:'background:var(--orange-light);color:#92400E',dateBg:'background:linear-gradient(135deg,#C2410C,var(--orange))',stripe:'background:linear-gradient(180deg,var(--orange),#FB923C)'},
};
POSTS.forEach(p => { p.icon = PILLAR[p.pillar].icon; });

const STATUS_OPT = ['pendente','producao','aprovado','publicado'];
const STATUS_LBL = {pendente:'Pendente',producao:'Em producao',aprovado:'Aprovado',publicado:'Publicado'};
const STATUS_COLOR = {pendente:'#94A3B8',producao:'#8B5CF6',aprovado:'#F59E0B',publicado:'#10B981'};

/* ─── STATE ─── */
let STATE = {};
POSTS.forEach(p => { STATE[p.id] = {status:'pendente',note:'',stars:0,fb:''}; });
let APPROVED = {essencial:false,growth:false};
let MONTH_NOTE = '';

/* ─── LOAD DATA ─── */
async function loadData() {
  setConnStatus('connecting');
  try {
    const [posts, settings, reqs, acts] = await Promise.all([
      API.getPosts(), API.getSettings(), API.getRequests(), API.getActivity(),
    ]);
    if (posts) posts.forEach(r => {
      STATE[r.post_id] = {status:r.status||'pendente',stars:r.stars||0,fb:r.feedback||'',note:r.note||''};
    });
    if (settings) settings.forEach(r => {
      if (r.key==='month_note') MONTH_NOTE = r.value||'';
      if (r.key==='approved_essencial') APPROVED.essencial = r.value==='true';
      if (r.key==='approved_growth') APPROVED.growth = r.value==='true';
      if (r.key==='timeline_steps') { try { TIMELINE = JSON.parse(r.value); } catch {} }
    });
    if (!TIMELINE.length) TIMELINE = JSON.parse(JSON.stringify(DEFAULT_TIMELINE));
    if (reqs) renderRequests(reqs);
    if (acts) renderActivity(acts);
    setConnStatus('online');
  } catch(e) {
    console.warn('Load error:', e);
    setConnStatus('offline');
  }
}

/* ─── SAVE ─── */
async function savePost(postId) {
  const s = STATE[postId];
  await API.updatePost(postId, s);
}

async function saveSetting(key, value) {
  await API.updateSetting(key, value);
}

/* ─── CALENDAR ─── */
function buildCalendar() {
  const container = document.getElementById('calJunho');
  if (!container) return;
  const byDay = {};
  POSTS.forEach(p => byDay[p.day] = p);
  const today = new Date().toISOString().slice(0,10);
  let html = `<div class="cal-mhdr"><span class="t">Junho 2026</span><span class="s">10 posts - inicio 08/06 - Ter/Qui/Sab</span></div><div class="cal-grid">`;
  ['Seg','Ter','Qua','Qui','Sex','Sab','Dom'].forEach(d => html += `<div class="cal-head">${d}</div>`);
  for (let d=1;d<=30;d++) {
    const p = byDay[d], isToday = `2026-06-${String(d).padStart(2,'0')}` === today;
    const inactive = d < 8;
    if (p) {
      const pl = PILLAR[p.pillar], st = STATE[p.id]?.status||'pendente';
      html += `<div class="cal-cell hp ${pl.calCls}${isToday?' today':''}" onclick="scrollToPost('${p.id}')">
        <span class="cal-dn">${d}</span><span class="cal-badge ${pl.badge}">${pl.icon}</span>
        <div class="cal-ev">${p.title.slice(0,20)}...</div>
        <div class="cal-sdot" style="background:${STATUS_COLOR[st]}"></div></div>`;
    } else {
      html += `<div class="cal-cell${inactive?' inactive':''}${isToday?' today':''}"><span class="cal-dn">${d}</span></div>`;
    }
  }
  for (let i=0;i<5;i++) html += '<div class="cal-cell empty"></div>';
  html += '</div>';
  container.innerHTML = html;
}

/* ─── POST LIST ─── */
function buildPosts() {
  const c = document.getElementById('postsJunho');
  if (!c) return;
  let html = '';
  POSTS.forEach(p => {
    const pl = PILLAR[p.pillar], st = STATE[p.id]?.status||'pendente';
    const note = STATE[p.id]?.note||'', stars = STATE[p.id]?.stars||0;
    const opts = STATUS_OPT.map(s => `<option value="${s}"${s===st?' selected':''}>${STATUS_LBL[s]}</option>`).join('');
    const tags = p.tags.map(t => `<span class="post-tag">${t}</span>`).join('');
    const starsHtml = [1,2,3,4,5].map(i => `<span class="post-fb-star${i<=stars?' active':''}" onclick="setStars('${p.id}',${i})" data-pid="${p.id}" data-i="${i}">&#9733;</span>`).join('');
    html += `<div class="post-item" id="pi_${p.id}">
      <div class="post-date" style="${pl.dateBg}"><div class="post-day-n">${String(p.day).padStart(2,'0')}</div><div class="post-wday">${p.wday}</div></div>
      <div class="post-stripe" style="${pl.stripe}"></div>
      <div class="post-body">
        <div class="post-top"><span class="post-type-badge" style="${pl.typeCss}">${pl.icon} ${pl.label}</span><span class="post-num">${p.num}</span></div>
        <div class="post-title">${p.title}</div><div class="post-desc">${p.desc}</div>
        <div class="post-tags">${tags}</div>
      </div>
      <div class="post-actions">
        <select class="s-sel" onchange="setStatus('${p.id}',this.value)">${opts}</select>
        <div class="post-fb-row">${starsHtml}</div>
        <div class="post-note-btn" onclick="openNoteModal('${p.id}','${p.title.replace(/'/g,"\\'")}')">${note||'+ Observacao'}</div>
      </div></div>`;
  });
  c.innerHTML = html;
}

/* ─── FEEDBACK BOARD ─── */
function buildFeedbackBoard() {
  const g = document.getElementById('feedbackGrid');
  if (!g) return;
  let html = '';
  POSTS.forEach(p => {
    const stars = STATE[p.id]?.stars||0, fb = STATE[p.id]?.fb||'';
    const starsHtml = [1,2,3,4,5].map(i => `<span class="fb-star${i<=stars?' active':''}" onclick="setStars('${p.id}',${i},true)">&#9733;</span>`).join('');
    const saved = stars>0||fb;
    html += `<div class="feedback-card" id="fbc_${p.id}">
      <div class="fb-post-title">${PILLAR[p.pillar].icon} ${p.title}</div>
      <div class="fb-stars">${starsHtml}</div>
      <textarea class="fb-note" id="fbnote_${p.id}" placeholder="Comentario opcional sobre este conteudo..." oninput="setFbNote('${p.id}',this.value)">${fb}</textarea>
      <div class="fb-actions">
        <div class="fb-saved${saved?' show':''}" id="fbsaved_${p.id}">&#10003; Feedback salvo</div>
        <button class="btn btn-primary" style="padding:6px 14px;font-size:10px" onclick="saveFb('${p.id}')">Salvar</button>
      </div></div>`;
  });
  g.innerHTML = html;
}

/* ─── INTERACTIONS ─── */
function setStatus(id, val) {
  STATE[id].status = val;
  const dot = document.querySelector(`[onclick="scrollToPost('${id}')"] .cal-sdot`);
  if (dot) dot.style.background = STATUS_COLOR[val];
  updateStats();
  showToast('Status atualizado');
  savePost(id);
  const post = POSTS.find(p=>p.id===id);
  const target = Auth.isAdmin() ? 'client' : 'admin';
  API.notify(target, 'status_change', 'Status alterado: ' + (post?.title?.slice(0,40)||id), 'Novo status: ' + (STATUS_LBL[val]||val));
  API.addActivity('Status do post "' + (post?.title?.slice(0,35)||id) + '..." alterado para ' + (STATUS_LBL[val]||val) + '.', 'Status do post');
}

function setStars(id, n, fromBoard) {
  STATE[id].stars = n;
  document.querySelectorAll(`[data-pid="${id}"]`).forEach(s => s.classList.toggle('active', parseInt(s.dataset.i) <= n));
  document.querySelectorAll(`#fbc_${id} .fb-star`).forEach((s,i) => s.classList.toggle('active', i < n));
  if (fromBoard) { const saved = document.getElementById('fbsaved_'+id); if (saved) saved.classList.add('show'); }
  updateStats();
  savePost(id);
}

function setFbNote(id, val) { STATE[id].fb = val; }

function saveFb(id) {
  const saved = document.getElementById('fbsaved_'+id);
  if (saved) saved.classList.add('show');
  showToast('Feedback salvo');
  updateStats();
  savePost(id);
  const post = POSTS.find(p=>p.id===id);
  const stars = STATE[id]?.stars||0;
  API.notify('admin', 'feedback', 'Feedback recebido: ' + (post?.title?.slice(0,35)||id), stars + ' estrelas' + (STATE[id]?.fb ? ' — "' + STATE[id].fb.slice(0,60) + '"' : ''));
}

let noteDebounce = null;
function saveMonthNote(val) {
  MONTH_NOTE = val;
  document.getElementById('noteSavedLbl').textContent = 'Salvando...';
  clearTimeout(noteDebounce);
  noteDebounce = setTimeout(() => {
    saveSetting('month_note', val).then(() => {
      document.getElementById('noteSavedLbl').textContent = 'Salvo no servidor';
      setTimeout(() => { const el = document.getElementById('noteSavedLbl'); if (el) el.textContent = ''; }, 3000);
    });
    const target = Auth.isAdmin() ? 'client' : 'admin';
    API.notify(target, 'note', 'Nota do mes atualizada', val.slice(0,80) + (val.length>80?'...':''));
  }, 800);
}

let activeNote = {id:null};
function openNoteModal(id, title) {
  activeNote.id = id;
  document.getElementById('noteModalTitle').textContent = title.slice(0,50);
  document.getElementById('noteModalText').value = STATE[id]?.note||'';
  document.getElementById('noteModal').classList.add('open');
}
function closeNoteModal() { document.getElementById('noteModal').classList.remove('open'); activeNote.id = null; }
function savePostNote() {
  if (!activeNote.id) return;
  const val = document.getElementById('noteModalText').value;
  STATE[activeNote.id].note = val;
  document.querySelectorAll('.post-note-btn').forEach(n => {
    if (n.getAttribute('onclick')?.includes(`'${activeNote.id}'`)) n.textContent = val || '+ Observacao';
  });
  showToast('Observacao salva');
  const post = POSTS.find(p=>p.id===activeNote.id);
  const target = Auth.isAdmin() ? 'client' : 'admin';
  API.notify(target, 'note', 'Observacao em post: ' + (post?.title?.slice(0,30)||''), val.slice(0,80));
  closeNoteModal();
  savePost(activeNote.id);
}

async function approvePhase(phase) {
  if (APPROVED[phase]) {
    APPROVED[phase] = false;
    renderApprovalState();
    const label = phase === 'essencial' ? 'Essencial' : 'Growth';
    showToast('Aprovacao do Plano ' + label + ' revogada');
    await saveSetting('approved_' + phase, 'false');
    await API.addActivity('Aprovacao do Plano ' + label + ' revogada.', 'Plano revogado');
    await API.notify('admin', 'approval', 'Aprovacao revogada', 'O cliente revogou o Plano ' + label + '.');
  } else {
    const other = phase === 'essencial' ? 'growth' : 'essencial';
    APPROVED[phase] = true;
    APPROVED[other] = false;
    renderApprovalState();
    const label = phase === 'essencial' ? 'Essencial' : 'Growth';
    showToast('Plano ' + label + ' aprovado!');
    await saveSetting('approved_' + phase, 'true');
    await saveSetting('approved_' + other, 'false');
    await API.addActivity('Plano ' + label + ' aprovado pelo cliente.', 'Plano ' + label + ' aprovado');
    await API.notify('admin', 'approval', 'Plano ' + label + ' APROVADO!', 'O cliente confirmou a continuidade com o Plano ' + label + '.');
  }
}

function scrollToPost(id) {
  switchTab('junho');
  setTimeout(() => { const el = document.getElementById('pi_'+id); if (el) el.scrollIntoView({behavior:'smooth',block:'center'}); }, 200);
}

/* ─── REQUESTS ─── */
function renderRequests(reqs) {
  const c = document.getElementById('requestsBody');
  if (!c) return;
  const icons = {pendente:'\u{1F4CC}',done:'\u{2705}',novo:'\u{1F514}'};
  const statusCls = {pendente:'rs-pendente',done:'rs-done',novo:'rs-novo'};
  const statusLbl = {pendente:'Pendente',done:'Feito',novo:'Novo'};
  const priLabel = {normal:'',urgente:'\u{1F7E1} Urgente',critico:'\u{1F534} Critico'};
  const sorted = [...reqs].sort((a,b) => {
    if (a.status==='done'&&b.status!=='done') return 1;
    if (a.status!=='done'&&b.status==='done') return -1;
    return new Date(b.created_at) - new Date(a.created_at);
  });
  const pendingCount = sorted.filter(r => r.status !== 'done').length;
  const badge = document.getElementById('actionsBadge');
  if (badge) { badge.style.display = pendingCount ? 'inline-flex' : 'none'; badge.textContent = pendingCount; }
  c.innerHTML = sorted.map(r => `
    <div class="request-item${r.source==='client'?' req-item-client':''}">
      <div class="req-icon" style="background:${r.source==='client'?'var(--orange-light)':'var(--surface2)'}">${icons[r.status]||'\u{1F4CC}'}</div>
      <div class="req-content">
        <div class="req-title">${r.source==='client'?'<span class="req-source-tag">CLIENTE</span>':''}${r.title}${r.priority&&r.priority!=='normal'?' <span style="font-size:9px;color:var(--amber)">'+priLabel[r.priority]+'</span>':''}</div>
        <div class="req-desc">${r.description}</div>
        <div class="req-date">\u{23F0} ${r.due_date}</div>
        <div class="req-admin-btns">
          ${r.status!=='done'?`<button onclick="markRequestDone('${r.id}')" style="font-size:9px;padding:3px 10px;border-radius:6px;border:none;background:var(--green-light);color:var(--green-dark);cursor:pointer;font-weight:700">Concluido</button>`:''}
          <button onclick="deleteRequest('${r.id}')" style="font-size:9px;padding:3px 10px;border-radius:6px;border:none;background:var(--red-light);color:var(--red);cursor:pointer;font-weight:700">Remover</button>
        </div>
      </div>
      <span class="req-status ${statusCls[r.status]||'rs-pendente'}">${statusLbl[r.status]||r.status}</span>
    </div>`).join('');
}

function renderActivity(acts) {
  const c = document.getElementById('activityFeed');
  if (!c) return;
  c.innerHTML = acts.map(r => activityHTML(r)).join('');
}
function activityHTML(r) {
  const t = new Date(r.created_at);
  const label = isNaN(t) ? 'agora' : t.toLocaleString('pt-BR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
  const msg = r.bold_part ? r.message.replace(r.bold_part, `<strong>${r.bold_part}</strong>`) : r.message;
  const delBtn = Auth.isAdmin() ? `<button class="act-del-btn admin-ctrl" onclick="deleteActivityItem('${r.id}')" title="Remover">&#10005;</button>` : '';
  return `<div class="activity-item"><div class="act-dot" style="background:var(--blue)"></div><div class="act-content"><div class="act-text">${msg}</div><div class="act-time">${label}</div></div>${delBtn}</div>`;
}

function renderApprovalState() {
  const ac = document.getElementById('approvalCard'), aok = document.getElementById('approvedCard');
  if (!ac||!aok) return;
  if (APPROVED.essencial || APPROVED.growth) {
    ac.style.display = 'none';
    aok.style.display = 'flex';
    const plan = APPROVED.essencial ? 'Essencial' : 'Growth';
    const price = APPROVED.essencial ? 'R$ 2.800' : 'R$ 4.500';
    const phase = APPROVED.essencial ? 'essencial' : 'growth';
    aok.innerHTML = `<span style="font-size:26px">&#9989;</span>
      <div style="flex:1">
        <div style="font-size:15px;font-weight:700;color:#fff;font-family:var(--font-heading)">Plano ${plan} aprovado!</div>
        <div style="font-size:11.5px;color:rgba(255,255,255,.75);margin-top:4px;line-height:1.6">O proximo ciclo esta confirmado (${price}/mes). Rafael entrara em contato para agendar a reuniao de inicio.</div>
      </div>
      <div style="display:flex;gap:8px;flex-shrink:0">
        <button class="btn" style="padding:6px 14px;font-size:10px;border-radius:8px;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.1);color:#fff;cursor:pointer;font-weight:600" onclick="switchTab('fases')">Alterar plano</button>
        <button class="btn" style="padding:6px 14px;font-size:10px;border-radius:8px;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.1);color:#fff;cursor:pointer;font-weight:600" onclick="approvePhase('${phase}')">Revogar</button>
      </div>`;
  } else {
    ac.style.display = '';
    aok.style.display = 'none';
  }
  updateFasesPlanCards();
}

function updateFasesPlanCards() {
  const essBtn = document.getElementById('planBtnEssencial');
  const growthBtn = document.getElementById('planBtnGrowth');
  if (essBtn) {
    if (APPROVED.essencial) {
      essBtn.innerHTML = '&#9989; Aprovado — Clique para revogar';
      essBtn.style.background = 'var(--green)';
      essBtn.style.borderColor = 'var(--green)';
    } else {
      essBtn.innerHTML = '&#10003; Aprovar Plano Essencial';
      essBtn.style.background = '';
      essBtn.style.borderColor = '';
    }
  }
  if (growthBtn) {
    if (APPROVED.growth) {
      growthBtn.innerHTML = '&#9989; Aprovado — Clique para revogar';
      growthBtn.style.background = 'var(--green)';
      growthBtn.style.borderColor = 'var(--green)';
    } else {
      growthBtn.innerHTML = '&#10003; Aprovar Plano Growth';
      growthBtn.style.background = '';
      growthBtn.style.borderColor = '';
    }
  }
}

/* ─── CLIENT REQUEST ─── */
function openClientReqModal() {
  document.getElementById('clientReqTitle').value = '';
  document.getElementById('clientReqDesc').value = '';
  document.getElementById('clientReqPriority').value = 'normal';
  document.getElementById('clientReqError').style.display = 'none';
  document.getElementById('clientReqModal').classList.add('open');
  setTimeout(() => document.getElementById('clientReqTitle').focus(), 120);
}
function closeClientReqModal() { document.getElementById('clientReqModal').classList.remove('open'); }

async function submitClientRequest() {
  const title = document.getElementById('clientReqTitle').value.trim();
  const desc = document.getElementById('clientReqDesc').value.trim();
  const priority = document.getElementById('clientReqPriority').value;
  if (!title) { document.getElementById('clientReqError').style.display = 'block'; return; }
  const dueMap = {normal:'Quando possivel',urgente:'Urgente - esta semana',critico:'Critico - hoje'};
  const btn = document.getElementById('clientReqSendBtn');
  btn.disabled = true; btn.textContent = 'Enviando...';
  try {
    await API.createRequest({title, description:desc||'-', due_date:dueMap[priority], priority, source:'client'});
    closeClientReqModal();
    showToast('Pedido enviado! Responderemos em breve.');
    await API.notify('admin', 'request', 'Novo pedido do cliente: ' + title.slice(0,40), desc.slice(0,80) || 'Sem descricao');
    await API.addActivity('Cliente enviou pedido: "' + title.slice(0,40) + '"', 'pedido');
    const reqs = await API.getRequests();
    if (reqs) renderRequests(reqs);
  } finally {
    btn.disabled = false; btn.textContent = 'Enviar pedido';
  }
}

async function markRequestDone(id) {
  if (!Auth.isAdmin()) return;
  await API.updateRequest(id, {status:'done'});
  showToast('Pedido concluido');
  await API.notify('client', 'request', 'Pedido concluido pelo admin', 'Um dos seus pedidos foi marcado como feito.');
  const reqs = await API.getRequests();
  if (reqs) renderRequests(reqs);
}

async function deleteRequest(id) {
  if (!Auth.isAdmin()) return;
  if (!confirm('Remover este pedido permanentemente?')) return;
  await API.deleteRequest(id);
  showToast('Pedido removido');
  const reqs = await API.getRequests();
  if (reqs) renderRequests(reqs);
}

async function submitAdminRequest() {
  const title = document.getElementById('adminReqTitle').value.trim();
  const desc = document.getElementById('adminReqDesc').value.trim();
  const date = document.getElementById('adminReqDate').value.trim();
  if (!title) return;
  await API.createRequest({title, description:desc||'-', due_date:date||'Sem prazo definido', priority:'normal', source:'admin'});
  document.getElementById('adminReqModal').classList.remove('open');
  ['adminReqTitle','adminReqDesc','adminReqDate'].forEach(id => { document.getElementById(id).value = ''; });
  showToast('Pedido criado');
  await API.notify('client', 'request', 'Novo pedido do admin: ' + title.slice(0,40), desc.slice(0,80) || title);
  await API.addActivity('Admin criou pedido: "' + title.slice(0,40) + '"', 'pedido');
  const reqs = await API.getRequests();
  if (reqs) renderRequests(reqs);
}

async function submitAdminActivity() {
  const msg = document.getElementById('adminActMsg').value.trim();
  if (!msg) return;
  await API.addActivity(msg, msg.slice(0,40));
  document.getElementById('adminActModal').classList.remove('open');
  document.getElementById('adminActMsg').value = '';
  showToast('Atividade registrada');
  await API.notify('client', 'activity', 'Nova atividade registrada', msg.slice(0,80));
  const acts = await API.getActivity();
  if (acts) renderActivity(acts);
}

/* ─── CRONOGRAMA INLINE ─── */
function buildCronogramaInline() {
  const el = document.getElementById('cronInlineJunho');
  if (!el) return;
  const ps = {a:{bg:'var(--blue-light)',color:'var(--blue-dark)',label:'Autoridade'},c:{bg:'var(--green-light)',color:'var(--green-dark)',label:'Conexao'},v:{bg:'var(--orange-light)',color:'#92400E',label:'Conversao'}};
  let html = '<div class="cron-inline-grid">';
  POSTS.forEach(p => {
    const s = ps[p.pillar]||ps.a, st = STATE[p.id]||{status:'pendente'};
    html += `<div class="cron-inline-card" data-pillar="${p.pillar}">
      <div class="cron-inline-hdr"><div><div class="cron-inline-day">${p.day} Jun</div><div class="cron-inline-wday">${p.wday} - Post ${p.num}</div></div>
      <span class="cron-inline-pillar" style="background:${s.bg};color:${s.color}">${PILLAR[p.pillar].icon} ${s.label}</span></div>
      <div class="cron-inline-title">${p.title}</div><div class="cron-inline-desc">${p.desc}</div>
      <div class="cron-inline-tags">${p.tags.map(t=>'<span class="cron-inline-tag">'+t+'</span>').join('')}</div>
      <div class="cron-inline-status"><span class="cron-inline-status-dot" style="background:${STATUS_COLOR[st.status]||'#94A3B8'}"></span>${STATUS_LBL[st.status]||'Pendente'}</div></div>`;
  });
  html += '</div>';
  el.innerHTML = html;
}

/* ─── TIMELINE (dynamic) ─── */
const DEFAULT_TIMELINE = [
  {title:'Periodo de Teste',status:'done',badge:'Encerrado',desc:'Analise inicial da academia, proposta aprovada e inicio do projeto.',date:'Maio 2026',price:''},
  {title:'Fase Teste — Descoberta',status:'active',badge:'Agora',desc:'10 posts, 3 pilares, identificacao das narrativas com maior engajamento. Relatorio final em 30/06.',date:'08 Jun – 30 Jun 2026',price:'R$ 1.200 / mes unico'},
  {title:'Reuniao de Alinhamento',status:'upcoming',badge:'Proximo',desc:'Apresentacao dos resultados da Fase Teste. Decisao sobre continuidade e qual plano seguir.',date:'Final de Junho 2026',price:''},
  {title:'Plano Essencial',status:'upcoming',badge:'Aguardando aprovacao',desc:'12 videos/mes, reuniao mensal, relatorio de desempenho, stories estrategicos.',date:'Jul – Set 2026 (apos aprovacao)',price:'R$ 2.800 / mes · Meses 2 a 4'},
  {title:'Plano Growth',status:'locked',badge:'Futuro',desc:'Meta Ads, lookalike audience, stories diarios, campanhas sazonais, relatorio CPL/ROI.',date:'Out 2026 em diante',price:'R$ 4.500 / mes · Mes 5+'},
];
let TIMELINE = [];

function buildTimeline() {
  const c = document.getElementById('timelineContainer');
  if (!c) return;
  const sm = {
    done:{dot:'done',icon:'&#10003;',bcls:'tl-b-done'},
    active:{dot:'active',icon:'&#9679;',bcls:'tl-b-active'},
    upcoming:{dot:'upcoming',icon:'&#10227;',bcls:'tl-b-next'},
    locked:{dot:'locked',icon:'&#128274;',bcls:'tl-b-locked'}
  };
  let html = '';
  TIMELINE.forEach((s,i) => {
    const m = sm[s.status]||sm.upcoming;
    const adminBtns = Auth.isAdmin() ? `<div class="tl-admin-btns">
      <button class="tl-edit-btn" onclick="editTimelineStep(${i})" title="Editar">&#9998;</button>
      <button class="tl-del-btn" onclick="deleteTimelineStep(${i})" title="Remover">&#10005;</button>
    </div>` : '';
    html += `<div class="tl-item"><div class="tl-dot ${m.dot}">${m.icon}</div><div class="tl-content"><div class="tl-header"><span class="tl-title">${s.title}</span><span class="tl-badge ${m.bcls}">${s.badge}</span>${adminBtns}</div><div class="tl-desc">${s.desc}</div>${s.price?'<div class="tl-price">'+s.price+'</div>':''}<div class="tl-date">${s.date}</div></div></div>`;
  });
  if (Auth.isAdmin()) {
    html += `<div style="padding:8px 0 0 42px"><button class="btn" style="font-size:10px;padding:6px 14px;background:var(--surface2);border:1.5px dashed var(--border);color:var(--muted);border-radius:8px;cursor:pointer;font-weight:600" onclick="addTimelineStep()">&#10133; Adicionar etapa</button></div>`;
  }
  c.innerHTML = html;
}

let _tlEditIdx = -1;
function addTimelineStep() {
  _tlEditIdx = -1;
  document.getElementById('tlModalTitle').textContent = 'Adicionar Etapa';
  document.getElementById('tlStepTitle').value = '';
  document.getElementById('tlStepDesc').value = '';
  document.getElementById('tlStepDate').value = '';
  document.getElementById('tlStepPrice').value = '';
  document.getElementById('tlStepStatus').value = 'upcoming';
  document.getElementById('tlStepBadge').value = 'Proximo';
  document.getElementById('tlModal').classList.add('open');
}

function editTimelineStep(i) {
  _tlEditIdx = i;
  const s = TIMELINE[i];
  document.getElementById('tlModalTitle').textContent = 'Editar Etapa';
  document.getElementById('tlStepTitle').value = s.title;
  document.getElementById('tlStepDesc').value = s.desc;
  document.getElementById('tlStepDate').value = s.date;
  document.getElementById('tlStepPrice').value = s.price;
  document.getElementById('tlStepStatus').value = s.status;
  document.getElementById('tlStepBadge').value = s.badge;
  document.getElementById('tlModal').classList.add('open');
}

async function saveTimelineStep() {
  const step = {
    title: document.getElementById('tlStepTitle').value.trim(),
    desc: document.getElementById('tlStepDesc').value.trim(),
    date: document.getElementById('tlStepDate').value.trim(),
    price: document.getElementById('tlStepPrice').value.trim(),
    status: document.getElementById('tlStepStatus').value,
    badge: document.getElementById('tlStepBadge').value.trim()
  };
  if (!step.title) return;
  if (_tlEditIdx >= 0) TIMELINE[_tlEditIdx] = step;
  else TIMELINE.push(step);
  document.getElementById('tlModal').classList.remove('open');
  buildTimeline();
  showToast(_tlEditIdx >= 0 ? 'Etapa atualizada' : 'Etapa adicionada');
  await saveSetting('timeline_steps', JSON.stringify(TIMELINE));
}

async function deleteTimelineStep(i) {
  if (!confirm('Remover esta etapa?')) return;
  TIMELINE.splice(i, 1);
  buildTimeline();
  showToast('Etapa removida');
  await saveSetting('timeline_steps', JSON.stringify(TIMELINE));
}

/* ─── ACTIVITY CRUD (admin) ─── */
async function deleteActivityItem(id) {
  if (!Auth.isAdmin()) return;
  if (!confirm('Remover esta atividade?')) return;
  await API.deleteActivity(id);
  showToast('Atividade removida');
  const acts = await API.getActivity();
  if (acts) renderActivity(acts);
}

/* ─── STATS ─── */
function updateStats() {
  let pub=0,fbCount=0,aP=0,cP=0,vP=0,aTot=0,cTot=0,vTot=0;
  POSTS.forEach(p => {
    const s = STATE[p.id]||{};
    if (s.status==='publicado') pub++;
    if (s.stars>0||s.fb) fbCount++;
    if (p.pillar==='a'){aTot++;if(s.status==='publicado')aP++;}
    if (p.pillar==='c'){cTot++;if(s.status==='publicado')cP++;}
    if (p.pillar==='v'){vTot++;if(s.status==='publicado')vP++;}
  });
  const pct = Math.round(pub/POSTS.length*100), fbPct = Math.round(fbCount/POSTS.length*100);
  const circ = 238.76;
  const ids = {sbPct:pct+'%',pctJunho:pct+'%',statPub:pub,sJunhoPub:pub,statFeedback:fbCount,ringTotalPct:pct+'%',ringFbPct:fbPct+'%'};
  Object.entries(ids).forEach(([id,val]) => { const el=document.getElementById(id); if(el)el.textContent=val; });
  document.getElementById('sbFill').style.width = pct+'%';
  setRing('ringTotal',pct,circ); setRing('ringFb',fbPct,circ);
  setPBar('a',aP,aTot); setPBar('c',cP,cTot); setPBar('v',vP,vTot);
}
function setRing(id,pct,circ) { const el=document.getElementById(id); if(el) el.style.strokeDashoffset=circ-(circ*pct/100); }
function setPBar(key,done,total) {
  const pct=total?Math.round(done/total*100):0;
  const bar=document.getElementById('pbar-'+key),lbl=document.getElementById('pb-'+key);
  if(bar)bar.style.width=pct+'%'; if(lbl)lbl.textContent=`${done}/${total}`;
}

/* ─── CONN STATUS ─── */
function setConnStatus(state) {
  const el = document.getElementById('connStatus');
  if (!el) return;
  const cfg = {
    online:{dot:'#22C55E',label:'Online',title:'Conectado ao servidor'},
    offline:{dot:'#EF4444',label:'Offline',title:'Sem conexao'},
    connecting:{dot:'#F59E0B',label:'Conectando...',title:'Conectando ao servidor'},
  };
  const c = cfg[state]||cfg.offline;
  el.title = c.title;
  el.querySelector('.conn-dot').style.background = c.dot;
  el.querySelector('.conn-label').textContent = c.label;
}

/* ─── NAVIGATION ─── */
function switchTab(tab) { Router.navigate(tab); }
function toggleCron(m) {
  const w = document.getElementById('cron-wrap-'+m), a = document.getElementById('cron-arrow-'+m);
  const o = w.classList.toggle('open'); a.classList.toggle('open', o);
}
function goBack() { Router.back(); }

/* ─── DARK MODE ─── */
function toggleDark() {
  const h = document.documentElement, d = h.dataset.theme==='dark';
  h.dataset.theme = d?'light':'dark';
  try { localStorage.setItem('ip3_dark', !d); } catch {}
}

/* ─── SIDEBAR ─── */
function toggleSidebar() {document.getElementById('sidebar').classList.toggle('open');document.getElementById('sbOverlay').classList.toggle('show');}
function closeSidebar() {document.getElementById('sidebar').classList.remove('open');document.getElementById('sbOverlay').classList.remove('show');}
function smartToggleSidebar() { if(window.innerWidth<=900) toggleSidebar(); else toggleSidebarCollapse(); }
function toggleSidebarCollapse() { document.body.classList.toggle('sidebar-collapsed'); closeSidebar(); }
function switchProfile() { Auth.logout(); }

/* ─── TOAST ─── */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
}

/* ─── NOTIFICATIONS ─── */
const NOTIF_ICONS = {
  request:  { cls:'n-request',  icon:'\u{1F4E8}' },
  feedback: { cls:'n-feedback', icon:'\u{2B50}' },
  status_change: { cls:'n-status', icon:'\u{1F504}' },
  activity: { cls:'n-activity', icon:'\u{1F4E2}' },
  approval: { cls:'n-approval', icon:'\u{2705}' },
  note:     { cls:'n-note',     icon:'\u{1F4DD}' },
};

function toggleNotifPanel() {
  const panel = document.getElementById('notifPanel');
  panel.classList.toggle('open');
  if (panel.classList.contains('open')) loadNotifications();
  document.addEventListener('click', closeNotifOnOutside, { once: true });
}
function closeNotifOnOutside(e) {
  const panel = document.getElementById('notifPanel');
  const wrap = panel?.closest('.notif-wrap');
  if (wrap && !wrap.contains(e.target)) panel.classList.remove('open');
}

async function loadNotifications() {
  const role = Auth.user?.role || 'client';
  const notifs = await API.getNotifications(role);
  renderNotifications(notifs);
}

async function updateNotifBadge() {
  const role = Auth.user?.role || 'client';
  const count = await API.getUnreadCount(role);
  const el = document.getElementById('notifCount');
  if (!el) return;
  if (count > 0) { el.textContent = count > 99 ? '99+' : count; el.style.display = 'flex'; }
  else el.style.display = 'none';
}

function renderNotifications(notifs) {
  const list = document.getElementById('notifList');
  if (!list) return;
  if (!notifs.length) { list.innerHTML = '<div class="notif-empty">Nenhuma notificacao ainda.</div>'; return; }
  list.innerHTML = notifs.map(n => {
    const ic = NOTIF_ICONS[n.type] || NOTIF_ICONS.activity;
    const t = new Date(n.created_at);
    const ago = timeAgo(t);
    return `<div class="notif-item${n.read?'':' unread'}" onclick="markNotifRead('${n.id}',this)">
      <div class="notif-icon ${ic.cls}">${ic.icon}</div>
      <div class="notif-body">
        <div class="notif-title">${n.title}</div>
        ${n.message ? '<div class="notif-msg">' + n.message + '</div>' : ''}
        <div class="notif-time">${ago}</div>
      </div></div>`;
  }).join('');
}

function timeAgo(date) {
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return 'Agora';
  if (diff < 3600) return Math.floor(diff/60) + ' min atras';
  if (diff < 86400) return Math.floor(diff/3600) + 'h atras';
  return date.toLocaleString('pt-BR', {day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
}

async function markNotifRead(id, el) {
  if (el) el.classList.remove('unread');
  await API.markRead(id);
  updateNotifBadge();
}

async function markAllNotifRead() {
  const role = Auth.user?.role || 'client';
  await API.markAllRead(role);
  document.querySelectorAll('.notif-item.unread').forEach(el => el.classList.remove('unread'));
  updateNotifBadge();
  showToast('Todas marcadas como lidas');
}

function setupRealtimeNotifications() {
  const role = Auth.user?.role || 'client';
  API.subscribeNotifications(role, (notif) => {
    updateNotifBadge();
    showToast('\u{1F514} ' + (notif.title||'Nova notificacao'));
    const panel = document.getElementById('notifPanel');
    if (panel?.classList.contains('open')) loadNotifications();
  });
  API.subscribeChanges('requests', async () => {
    const reqs = await API.getRequests();
    if (reqs) renderRequests(reqs);
  });
  API.subscribeChanges('activity', async () => {
    const acts = await API.getActivity();
    if (acts) renderActivity(acts);
  });
  API.subscribeChanges('post_data', async () => {
    const posts = await API.getPosts();
    if (posts) {
      posts.forEach(r => { STATE[r.post_id] = {status:r.status||'pendente',stars:r.stars||0,fb:r.feedback||'',note:r.note||''}; });
      buildPosts(); buildFeedbackBoard(); updateStats(); buildCronogramaInline();
    }
  });
}

/* ─── LGPD ─── */
async function checkLGPD() {
  try {
    const userId = Auth.user?.user || 'unknown';
    const localKey = 'ip_lgpd_' + userId;
    if (localStorage.getItem(localKey) === 'true') return true;
    const data = await API.lgpdStatus(userId);
    if (data && data.accepted) {
      try { localStorage.setItem(localKey, 'true'); } catch {}
      return true;
    }
    document.getElementById('lgpdModal').classList.add('open');
    return false;
  } catch { return true; }
}

async function acceptLGPD() {
  const checkbox = document.getElementById('lgpdCheckbox');
  if (!checkbox.checked) { document.getElementById('lgpdError').style.display = 'block'; return; }
  const userId = Auth.user?.user || 'unknown';
  await API.lgpdAccept(userId);
  try { localStorage.setItem('ip_lgpd_' + userId, 'true'); } catch {}
  document.getElementById('lgpdModal').classList.remove('open');
  showToast('Termos aceitos com sucesso');
}

/* ─── LANDING PAGE ─── */
function showLoginFromLanding() {
  const landing = document.getElementById('landingPage');
  const gate = document.getElementById('authGate');
  landing.classList.add('hide');
  setTimeout(() => {
    landing.style.display = 'none';
    gate.style.display = '';
    document.getElementById('authUser').focus();
  }, 500);
}

/* ─── AUTH GATE ─── */
let _cooldownInterval = null;
async function handleLogin() {
  const user = document.getElementById('authUser').value.trim().toLowerCase();
  const pass = document.getElementById('authPass').value;
  const btn = document.querySelector('.auth-btn');
  const cooldownEl = document.getElementById('authCooldown');

  if (Auth.isLocked()) {
    const secs = Auth.getRemainingLock();
    if (cooldownEl) cooldownEl.textContent = `Aguarde ${secs}s para tentar novamente.`;
    return;
  }

  btn.disabled = true; btn.textContent = 'Verificando...';
  const result = await Auth.login(user, pass);
  btn.disabled = false; btn.textContent = 'Entrar';

  if (result.ok) {
    Auth.applyRole();
    const gate = document.getElementById('authGate');
    gate.classList.add('hide');
    document.body.style.overflow = '';
    setTimeout(() => gate.style.display = 'none', 500);
    if (cooldownEl) cooldownEl.textContent = '';
    await initApp();
  } else {
    const box = document.getElementById('authBox');
    const err = document.getElementById('authErr');
    box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake');
    err.textContent = result.error;
    err.classList.remove('hide');
    document.getElementById('authPass').value = '';
    document.getElementById('authUser').focus();
    setTimeout(() => err.classList.add('hide'), 3000);

    if (result.locked) {
      btn.disabled = true;
      const fields = document.querySelectorAll('.auth-field');
      fields.forEach(f => f.disabled = true);
      _cooldownInterval = setInterval(() => {
        const secs = Auth.getRemainingLock();
        if (secs <= 0) {
          clearInterval(_cooldownInterval);
          btn.disabled = false;
          fields.forEach(f => f.disabled = false);
          if (cooldownEl) cooldownEl.textContent = '';
        } else {
          if (cooldownEl) cooldownEl.textContent = `Bloqueado. Tente novamente em ${secs}s.`;
        }
      }, 1000);
    }
  }
}

/* ─── GALLERY ─── */
function filterGallery(type, btn) {
  document.querySelectorAll('.gallery-filter').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  const cards = grid.querySelectorAll('.gallery-card');
  cards.forEach(c => {
    if (type === 'all') { c.style.display = ''; return; }
    c.style.display = c.dataset.type === type ? '' : 'none';
  });
}

function buildGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  const types = ['video','video','foto','video','video','foto','video','video','video','video'];
  const typeLabels = {video:'Video',foto:'Foto',design:'Design'};
  const typeBg = {video:'background:var(--purple-light);color:var(--purple-dark)',foto:'background:var(--blue-light);color:var(--blue-dark)',design:'background:var(--orange-light);color:#92400E'};
  let html = '';
  POSTS.forEach((p, i) => {
    const pl = PILLAR[p.pillar];
    const st = STATE[p.id]?.status || 'pendente';
    const t = types[i] || 'video';
    html += `<div class="gallery-card fade-in" data-type="${t}">
      <div class="gallery-thumb" style="${pl.dateBg}">
        <span style="font-size:42px;color:rgba(255,255,255,.9)">${pl.icon}</span>
        <div class="gallery-thumb-overlay"><span>&#128065;</span></div>
      </div>
      <div class="gallery-info">
        <div class="gallery-title">${p.title}</div>
        <div class="gallery-meta">
          <span class="gallery-badge" style="${typeBg[t]}">${typeLabels[t]}</span>
          <span>${String(p.day).padStart(2,'0')}/06</span>
          <span style="margin-left:auto;width:7px;height:7px;border-radius:50%;background:${STATUS_COLOR[st]}" title="${STATUS_LBL[st]}"></span>
        </div>
      </div>
    </div>`;
  });
  grid.innerHTML = html;
}

/* ─── RESULTADOS (computed from post data) ─── */
function buildResultados() {
  const pub = POSTS.filter(p => STATE[p.id]?.status === 'publicado').length;
  const prod = POSTS.filter(p => STATE[p.id]?.status === 'producao').length;
  const aprov = POSTS.filter(p => STATE[p.id]?.status === 'aprovado').length;
  const pend = POSTS.filter(p => STATE[p.id]?.status === 'pendente').length;
  const fbCount = POSTS.filter(p => (STATE[p.id]?.stars||0) > 0).length;

  // Update metric cards
  const mf = document.getElementById('metricFollowers');
  const mr = document.getElementById('metricReach');
  const me = document.getElementById('metricEngagement');
  const mc = document.getElementById('metricConversions');
  if (mf) mf.textContent = pub + '/10';
  if (mr) mr.textContent = fbCount + '/10';
  if (me) me.textContent = Math.round((pub + aprov) / 10 * 100) + '%';
  if (mc) mc.textContent = prod + aprov + pub;

  // Update labels
  const labels = document.querySelectorAll('#panel-resultados .metric-label');
  if (labels[0]) labels[0].textContent = 'Publicados';
  if (labels[1]) labels[1].textContent = 'Com Feedback';
  if (labels[2]) labels[2].textContent = 'Aprovacao';
  if (labels[3]) labels[3].textContent = 'Em Progresso';

  // Post status list
  const list = document.getElementById('resultadosPostList');
  if (list) {
    let html = '<div style="display:flex;flex-direction:column;gap:10px">';
    POSTS.forEach(p => {
      const st = STATE[p.id]?.status || 'pendente';
      const stars = STATE[p.id]?.stars || 0;
      const starsHtml = stars > 0 ? '&#9733;'.repeat(stars) + '<span style="opacity:.3">' + '&#9733;'.repeat(5 - stars) + '</span>' : '<span style="opacity:.3">&#9733;&#9733;&#9733;&#9733;&#9733;</span>';
      html += `<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:var(--r);background:var(--surface2);border:1px solid var(--border)">
        <span style="font-size:16px">${PILLAR[p.pillar].icon}</span>
        <div style="flex:1;min-width:0">
          <div style="font-size:12px;font-weight:600;color:var(--heading);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.title}</div>
          <div style="font-size:10px;color:var(--muted);margin-top:2px">${String(p.day).padStart(2,'0')}/06 · ${PILLAR[p.pillar].label}</div>
        </div>
        <div style="font-size:12px;color:#FBBF24">${starsHtml}</div>
        <span style="font-size:9px;font-weight:700;padding:3px 10px;border-radius:10px;background:${STATUS_COLOR[st]}20;color:${STATUS_COLOR[st]};white-space:nowrap">${STATUS_LBL[st]}</span>
      </div>`;
    });
    html += '</div>';
    list.innerHTML = html;
  }

  // Top posts by feedback
  const top = document.getElementById('resultadosTopPosts');
  if (top) {
    const ranked = [...POSTS].filter(p => (STATE[p.id]?.stars||0) > 0).sort((a,b) => (STATE[b.id]?.stars||0) - (STATE[a.id]?.stars||0));
    if (ranked.length === 0) {
      top.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#127942;</div><div class="empty-state-title">Sem feedbacks ainda</div><div class="empty-state-desc">Avalie os posts na aba Junho para ver o ranking aqui.</div></div>';
    } else {
      let html = '<div style="display:flex;flex-direction:column;gap:8px">';
      ranked.slice(0,5).forEach((p, i) => {
        const stars = STATE[p.id]?.stars || 0;
        html += `<div style="display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:var(--r);background:var(--surface2)">
          <span style="font-size:14px;font-weight:800;color:${i===0?'var(--orange)':i===1?'var(--blue)':'var(--muted)'};width:22px;text-align:center">${i+1}</span>
          <span>${PILLAR[p.pillar].icon}</span>
          <div style="flex:1;font-size:11px;font-weight:600;color:var(--heading);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.title}</div>
          <div style="font-size:11px;color:#FBBF24">${'&#9733;'.repeat(stars)}</div>
        </div>`;
      });
      html += '</div>';
      top.innerHTML = html;
    }
  }

  // Pillar summary
  const pilares = document.getElementById('resultadosPilares');
  if (pilares) {
    const summary = {};
    ['a','c','v'].forEach(k => {
      const posts = POSTS.filter(p => p.pillar === k);
      const pubCount = posts.filter(p => STATE[p.id]?.status === 'publicado').length;
      const avgStars = posts.reduce((sum,p) => sum + (STATE[p.id]?.stars||0), 0) / posts.length;
      summary[k] = { total: posts.length, pub: pubCount, avg: avgStars };
    });
    let html = '<div style="display:flex;flex-direction:column;gap:12px">';
    ['a','c','v'].forEach(k => {
      const s = summary[k];
      const pl = PILLAR[k];
      const pct = Math.round(s.pub / s.total * 100);
      html += `<div style="padding:14px 16px;border-radius:var(--r);background:var(--surface2);border:1px solid var(--border)">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <span style="font-size:16px">${pl.icon}</span>
          <span style="font-size:13px;font-weight:700;color:var(--heading)">${pl.label}</span>
          <span style="margin-left:auto;font-size:10px;color:var(--muted)">${s.pub}/${s.total} publicados</span>
        </div>
        <div class="prog-bar" style="height:6px;background:var(--border)">
          <div style="height:100%;border-radius:3px;width:${pct}%;${pl.stripe};transition:width .6s"></div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:6px">
          <span style="font-size:10px;color:var(--muted)">Media: ${s.avg.toFixed(1)} &#9733;</span>
          <span style="font-size:10px;font-weight:600;color:var(--heading)">${pct}%</span>
        </div>
      </div>`;
    });
    html += '</div>';
    pilares.innerHTML = html;
  }
}

/* ─── PDF EXPORT ─── */
function exportPDF() {
  // Add a class to optimize print layout
  document.body.classList.add('pdf-export');
  window.print();
  setTimeout(() => document.body.classList.remove('pdf-export'), 1000);
}

/* ─── INIT ─── */
async function initApp() {
  try { if (localStorage.getItem('ip3_dark')==='true') document.documentElement.dataset.theme = 'dark'; } catch {}
  TIMELINE = JSON.parse(JSON.stringify(DEFAULT_TIMELINE));
  buildCalendar(); buildPosts(); buildFeedbackBoard(); updateStats(); buildCronogramaInline();
  buildGallery(); buildResultados(); buildTimeline();
  renderApprovalState();
  document.querySelectorAll('.modal-bg').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
  });
  Router.init();
  await loadData();
  buildPosts(); buildFeedbackBoard(); updateStats(); buildCronogramaInline();
  buildGallery(); buildResultados(); buildTimeline();
  if (MONTH_NOTE) { const el = document.getElementById('monthNote'); if (el) el.value = MONTH_NOTE; }
  renderApprovalState();
  await updateNotifBadge();
  setupRealtimeNotifications();
  await checkLGPD();
  logSession();
}

/* ─── SESSION LOG ─── */
async function logSession() {
  try {
    const user = Auth.user?.user || 'unknown';
    const role = Auth.user?.role || 'unknown';
    await API.addActivity(
      `${Auth.user?.name || 'Usuario'} acessou o portal.`,
      Auth.user?.name || 'Usuario'
    );
  } catch {}
}

/* ─── BOOT ─── */
(function boot() {
  try { if (localStorage.getItem('ip3_dark')==='true') document.documentElement.dataset.theme = 'dark'; } catch {}
  const hasSession = Auth.checkSession();
  if (hasSession) {
    Auth.applyRole();
    const landing = document.getElementById('landingPage');
    const gate = document.getElementById('authGate');
    if (landing) landing.style.display = 'none';
    if (gate) gate.style.display = 'none';
    document.body.style.overflow = '';
    initApp();
  } else {
    document.body.style.overflow = 'hidden';
    // Show landing page, auth gate starts hidden
  }
})();
