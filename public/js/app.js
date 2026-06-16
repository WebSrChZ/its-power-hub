/* ─── DATA ─── */
const POSTS = [
  { id:'jun01',day:3,wday:'Qua',pillar:'v',num:'01/12',
    title:'Existe um lugar em Cláudio que você ainda não conhece.',
    desc:'Reel de abertura. A academia revelada: estrutura real, profissionais reais, comunidade real. O primeiro convite — sem pressão.',
    tags:['Reel de abertura','Primeiro contato com a marca','CTA suave — link na bio']},
  { id:'jun02',day:6,wday:'Sab',pillar:'c',num:'02/12',
    title:'O inverno separa intenção de compromisso.',
    desc:'Quem levanta no frio escolhe o que é difícil. O inverno não é obstáculo — é filtro. Engajamento emocional puro.',
    tags:['Engajamento emocional','Frase icônica para reshare','Inverno como filtro']},
  { id:'jun03',day:9,wday:'Ter',pillar:'a',num:'03/12',
    title:'As 3 perguntas que todo aluno faz — respondidas sem filtro.',
    desc:'Professor responde as 3 dúvidas mais comuns: whey, descanso e tempo de resultado. Sem enrolação, sem resposta genérica.',
    tags:['Q&A — autoridade acessível','Potencial de série semanal','Alto salvamento']},
  { id:'jun04',day:11,wday:'Qui',pillar:'a',num:'04/12',
    title:'Treinar em jejum emagrece mais — mito ou verdade?',
    desc:'Formato quiz com suspense e resposta direta. A diferença entre resultado e frustração é informação de qualidade.',
    tags:['Formato quiz — alta retenção','Alto salvamento','Autoridade técnica']},
  { id:'jun05',day:12,wday:'Sex',pillar:'c',num:'05/12 — Namorados',
    title:'O que casais que treinam juntos dividem — além do treino.',
    desc:'Cumplicidade real no esforço compartilhado. Sem clichê — o cuidado com a saúde como ato de amor.',
    tags:['Data especial 12/06','Estilo de vida e conexão','Alto reshare orgânico']},
  { id:'jun06',day:16,wday:'Ter',pillar:'a',num:'06/12',
    title:'Três razões para não abandonar o treino no frio.',
    desc:'Três argumentos diretos para não pausar no inverno. Metabolismo, atenção exclusiva e vantagem competitiva.',
    tags:['Timing sazonal','Compartilhamento orgânico','Construção de longo prazo']},
  { id:'jun07',day:19,wday:'Sex',pillar:'c',num:'07/12',
    title:'[Nome] — uma história que começou aqui dentro.',
    desc:'Depoimento real, fala natural, câmera próxima. A melhor prova do que a academia faz — não está em números, está nas pessoas.',
    tags:['Prova social autêntica','Legendado obrigatório','Comunidade como diferencial']},
  { id:'jun08',day:21,wday:'Dom',pillar:'c',num:'08/12 — Inverno',
    title:'Primeiro dia de inverno. A It\'s Power está assim.',
    desc:'Contraste cinematográfico: frio lá fora, energia aqui dentro. Frase icônica para reshare.',
    tags:['Data especial 21/06','Pertencimento visual','Frase icônica para reshare']},
  { id:'jun09',day:23,wday:'Ter',pillar:'c',num:'09/12',
    title:'O que acontece aqui quando ninguém está filmando.',
    desc:'Câmera ativa desde as 6h. Professor preparando, alunos chegando pelo nome. O cuidado invisível que define a experiência.',
    tags:['Humanização premium','Cuidado como diferencial','Estilo documental']},
  { id:'jun10',day:25,wday:'Qui',pillar:'a',num:'10/12',
    title:'O exercício que você faz todo treino — provavelmente errado.',
    desc:'Demonstração errado vs. correto com câmera lateral. Didática limpa, informação que vale o salvamento.',
    tags:['Alto salvamento','Autoridade técnica','Diferencial de acompanhamento']},
  { id:'jun11',day:27,wday:'Sab',pillar:'c',num:'11/12',
    title:'30 segundos. Sem pausar. Sem desculpa. Você aguenta?',
    desc:'Parece pouco — até tentar. Desafio real com reação genuína. Formato viral com alta retenção e marcações.',
    tags:['Formato viral','Desafio com autenticidade','Alta retenção e marcações']},
  { id:'jun12',day:30,wday:'Ter',pillar:'v',num:'12/12',
    title:'Junho acabou. O que a gente construiu, fica.',
    desc:'Montagem dos melhores momentos do mês. Gratidão genuína e convite direto para julho.',
    tags:['Fechamento com propósito','Convite — não panfleto','Antecipação para julho']},
];

const PILLAR = {
  a:{label:'Autoridade',icon:'\u{1F3C6}',badge:'cb-a',calCls:'a-p',
     typeCss:'background:var(--blue-light);color:var(--blue-dark)',dateBg:'background:linear-gradient(135deg,#1D4ED8,#2563EB)',stripe:'background:linear-gradient(180deg,var(--blue),#60A5FA)'},
  c:{label:'Conexão',icon:'\u{1F91D}',badge:'cb-c',calCls:'c-p',
     typeCss:'background:var(--green-light);color:var(--green-dark)',dateBg:'background:linear-gradient(135deg,#065F46,#10B981)',stripe:'background:linear-gradient(180deg,var(--green),#34D399)'},
  v:{label:'Conversão',icon:'\u{1F3AF}',badge:'cb-v',calCls:'v-p',
     typeCss:'background:var(--orange-light);color:#92400E',dateBg:'background:linear-gradient(135deg,#C2410C,var(--orange))',stripe:'background:linear-gradient(180deg,var(--orange),#FB923C)'},
};
POSTS.forEach(p => { p.month = 'jun'; p.icon = PILLAR[p.pillar].icon; });

const SEDE = {
  bv:{label:'Bela Vista',short:'BV',color:'#8B5CF6',bg:'rgba(139,92,237,.12)',border:'rgba(139,92,237,.3)'},
  centro:{label:'Centro',short:'Centro',color:'#0EA5E9',bg:'rgba(14,165,233,.12)',border:'rgba(14,165,233,.3)'},
  ambas:{label:'Ambas',short:'Ambas',color:'#6B7280',bg:'rgba(107,114,128,.12)',border:'rgba(107,114,128,.3)'},
};

const SEDE_MAP = {
  jun01:'centro',jun02:'ambas',jun03:'ambas',jun04:'ambas',jun05:'ambas',
  jun06:'ambas',jun07:'centro',jun08:'centro',jun09:'centro',jun10:'ambas',
  jun11:'ambas',jun12:'ambas',
  jul01:'ambas',jul02:'ambas',jul03:'ambas',jul04:'centro',jul05:'bv',
  jul06:'ambas',jul07:'ambas',jul08:'centro',jul09:'bv',jul10:'centro',
  jul11:'bv',jul12:'centro',
  ago01:'ambas',ago02:'bv',ago03:'centro',ago04:'ambas',ago05:'bv',
  ago06:'centro',ago07:'ambas',ago08:'bv',ago09:'centro',ago10:'bv',
  ago11:'centro',ago12:'ambas',
};
POSTS.forEach(p => { p.sede = SEDE_MAP[p.id] || 'ambas'; });

/* ─── JULHO 2026 — Construção de Autoridade ─── */
[
  { id:'jul01',day:1,wday:'Qua',pillar:'a',num:'01/12',
    title:'Duas unidades. Um compromisso. Conheça a It\'s Power.',
    desc:'Tour das duas unidades pelo que elas têm em comum: equipamentos completos, atendimento humanizado e professores prontos para ajudar. A mesma It\'s Power, mais perto de você.',
    tags:['Diferenciais','Tour','Duas unidades']},
  { id:'jul02',day:3,wday:'Sex',pillar:'v',num:'02/12 — Campanha Inverno',
    title:'O que acontece no seu corpo quando você treina no frio.',
    desc:'Ciência acessível do treino no frio — termogênese, circulação, endorfina — com CTA da Campanha de Inverno. Começar agora é o investimento que se colhe no verão.',
    tags:['Campanha de Inverno','Ciência acessível','CTA conversão']},
  { id:'jul03',day:4,wday:'Sab',pillar:'a',num:'03/12',
    title:'24 anos construindo a maior referência fitness de Cláudio.',
    desc:'A história da It\'s Power: 24 anos de evolução, milhares de vidas transformadas e a autoridade de quem é tradição em Cláudio. Legado como diferencial.',
    tags:['24 anos','Autoridade','História da marca']},
  { id:'jul04',day:8,wday:'Qua',pillar:'c',num:'04/12',
    title:'Eu achava que academia não era pra mim.',
    desc:'Depoimento real: vergonha, insegurança e a descoberta de que o lugar certo faz toda a diferença.',
    tags:['Prova social','Depoimento autêntico','Conexão emocional']},
  { id:'jul05',day:10,wday:'Sex',pillar:'a',num:'05/12',
    title:'Aqui tem muito mais que musculação.',
    desc:'Power Training, 4move (mobilidade e longevidade), dança, personal, avaliação física, lojinha.',
    tags:['Além da musculação','Modalidades','4move','Dança']},
  { id:'jul06',day:11,wday:'Sab',pillar:'v',num:'06/12 — Power Club',
    title:'Power Club: muito mais que uma matrícula.',
    desc:'Professor dedicado para no máximo 3 alunos, nutri, fisio, bioimpedância, recovery, suplementação. Acompanhamento de verdade.',
    tags:['Power Club','Acompanhamento premium','Conversão']},
  { id:'jul07',day:15,wday:'Qua',pillar:'c',num:'07/12 — Aniversário',
    title:'Aniversário It\'s Power — 24 anos transformando vidas em Cláudio.',
    desc:'Celebração emotiva: 24 anos de evolução, depoimentos de alunos, gratidão do fundador.',
    tags:['Aniversário 15/07','24 anos','Celebração']},
  { id:'jul08',day:17,wday:'Sex',pillar:'a',num:'08/12',
    title:'O exercício mais feito é o mais mal feito.',
    desc:'Abre com a provocação "o exercício mais feito é o mais mal feito" e revela o agachamento: comparativo errado vs. correto, didática visual.',
    tags:['Técnica','Correção de exercício','Alto salvamento']},
  { id:'jul09',day:18,wday:'Sab',pillar:'c',num:'09/12',
    title:'Cadeira na parede. 1 minuto. Você aguenta?',
    desc:'Desafio escalado: da prancha de 30s (junho) para 1 minuto de cadeira na parede (wall sit). Isometria que queima — alta retenção e marcações.',
    tags:['Desafio','Entretenimento','Formato viral']},
  { id:'jul10',day:20,wday:'Seg',pillar:'c',num:'10/12 — Dia do Amigo',
    title:'Dia do Amigo: quem treina junto, evolui junto.',
    desc:'Campanha Dia do Amigo: cada aluno convida um amigo para treinar grátis. Duplas treinando, depoimentos e CTA de marcação + convite.',
    tags:['Data especial 20/07','Dia do Amigo','Campanha · convide um amigo']},
  { id:'jul11',day:25,wday:'Sab',pillar:'c',num:'11/12 — Dia dos Avós',
    title:'A força não tem idade. Feliz Dia dos Avós.',
    desc:'Homenagem à terceira idade. Representatividade, treino adaptado, conexão intergeracional.',
    tags:['Data especial 26/07','Dia dos Avós','Representatividade']},
  { id:'jul12',day:31,wday:'Sex',pillar:'c',num:'12/12',
    title:'As fases de quem promete treinar no inverno.',
    desc:'Humor leve e universal: as 4 fases da preguiça do inverno, terminando no acolhimento. Sem julgamento, gera marcação.',
    tags:['Vídeo engraçado','Humor','Marcação']},
].forEach(p => { p.month = 'jul'; p.icon = PILLAR[p.pillar].icon; POSTS.push(p); });

/* ─── AGOSTO 2026 — Consolidação e Crescimento ─── */
[
  { id:'ago01',day:1,wday:'Sab',pillar:'c',num:'01/12',
    title:'Agosto chegou: horários, equipe e as duas unidades.',
    desc:'Informativo operacional: horários de funcionamento, apresentação da equipe e as duas unidades (BV + Centro). Card salvável.',
    tags:['Informativo','Horários','Equipe','2 unidades']},
  { id:'ago02',day:4,wday:'Ter',pillar:'a',num:'02/12',
    title:'O treino que mais muda o corpo — e ninguém faz.',
    desc:'Treino de pernas é o mais evitado e o mais transformador. Ciência + demonstração na prática.',
    tags:['Educativo','Alto salvamento','Desmistificação']},
  { id:'ago03',day:6,wday:'Qui',pillar:'c',num:'03/12',
    title:'[Nome] — antes e depois de 60 dias.',
    desc:'Depoimento real com fotos comparativas. Transformação visível, fala autêntica. A prova que convence.',
    tags:['Depoimento','Transformação','Prova social']},
  { id:'ago04',day:8,wday:'Sab',pillar:'c',num:'04/12 — Dia dos Pais',
    title:'Dia dos Pais: a força que ele nunca pediu, mas sempre deu.',
    desc:'Homenagem ao Dia dos Pais. Pais que treinam, pais que dão exemplo, presença como força.',
    tags:['Data especial 09/08','Dia dos Pais','Homenagem']},
  { id:'ago05',day:11,wday:'Ter',pillar:'a',num:'05/12',
    title:'4move: o treino que prepara seu corpo pra vida toda.',
    desc:'Mobilidade, longevidade e consciência corporal com yoga e outros recursos. + Power Training e dança.',
    tags:['Além da musculação','4move','Mobilidade','Modalidades']},
  { id:'ago06',day:13,wday:'Qui',pillar:'v',num:'06/12',
    title:'Power Club em ação: acompanhamento que muda tudo.',
    desc:'Professor p/ no máximo 3 alunos, nutri, fisio, bioimpedância, recovery. Depoimento real de membro do Power Club.',
    tags:['Power Club','Metodologia','Conversão']},
  { id:'ago07',day:15,wday:'Sab',pillar:'c',num:'07/12',
    title:'2 minutos. Sem parar. O desafio escalou.',
    desc:'Terceira edição do desafio (30s → 1min → 2min). Prancha com variação. Alta retenção garantida.',
    tags:['Desafio','Formato viral','Série recorrente']},
  { id:'ago08',day:18,wday:'Ter',pillar:'a',num:'08/12',
    title:'Supino reto — o erro que trava seu peitoral.',
    desc:'Comparativo errado vs. correto com câmera frontal e lateral. O detalhe que muda tudo.',
    tags:['Técnica','Correção de exercício','Alto salvamento']},
  { id:'ago09',day:20,wday:'Qui',pillar:'c',num:'09/12',
    title:'O que o professor faz quando o aluno quer desistir.',
    desc:'Humanização do cuidado: como a equipe lida com desânimo. O diferencial invisível.',
    tags:['Humanização','Bastidores','Cuidado']},
  { id:'ago10',day:22,wday:'Sab',pillar:'v',num:'10/12',
    title:'Primavera se constrói agora. Condição especial de agosto.',
    desc:'Campanha pré-primavera: último mês completo antes da virada. Matrícula + 1º mês com desconto.',
    tags:['Campanha','Pré-primavera','Promoção']},
  { id:'ago11',day:25,wday:'Ter',pillar:'a',num:'11/12',
    title:'O que faz a It\'s Power diferente de qualquer outra academia.',
    desc:'Climatização, atendimento personalizado, estrutura moderna, área kids, duas unidades. Diferenciais em cena.',
    tags:['Diferenciais','Estrutura','Atendimento']},
  { id:'ago12',day:28,wday:'Sex',pillar:'c',num:'12/12',
    title:'Tipos de pessoa na academia: você é qual?',
    desc:'Humor leve e carinhoso: os 4 tipos universais de aluno, sem julgamento, terminando no pertencimento. Gera marcação.',
    tags:['Vídeo engraçado','Humor','Marcação','Pertencimento']},
].forEach(p => { p.month = 'ago'; p.icon = PILLAR[p.pillar].icon; p.sede = SEDE_MAP[p.id] || 'ambas'; POSTS.push(p); });

const STATUS_OPT = ['pendente','producao','aprovado','publicado'];
const STATUS_LBL = {pendente:'Pendente',producao:'Em produção',aprovado:'Aprovado',publicado:'Publicado'};
const STATUS_COLOR = {pendente:'#94A3B8',producao:'#8B5CF6',aprovado:'#F59E0B',publicado:'#10B981'};

/* ─── SYNC: Portal ↔ Roteiro Iframes ─── */
const SYNC_ROTEIRO_TO_PORTAL = {pendente:'pendente',gravando:'producao',editando:'producao',pronto:'aprovado',publicado:'publicado'};
const SYNC_PORTAL_TO_ROTEIRO = {pendente:'pendente',producao:'gravando',aprovado:'pronto',publicado:'publicado'};

function portalIdToVideoId(portalId) {
  const num = portalId.replace(/^(jun|jul|ago)/, '');
  return 'V' + num;
}
function portalIdToMonth(portalId) {
  if (portalId.startsWith('ago')) return 'ago';
  if (portalId.startsWith('jul')) return 'jul';
  return 'jun';
}
function videoIdToPortalId(videoId, month) {
  // V01 + jul → jul01
  const num = videoId.replace('V','');
  return month + num;
}

function notifyIframeStatusChange(portalId, portalStatus) {
  const month = portalIdToMonth(portalId);
  const videoId = portalIdToVideoId(portalId);
  const roteiroStatus = SYNC_PORTAL_TO_ROTEIRO[portalStatus] || portalStatus;
  const iframeId = month === 'ago' ? 'iframeAgo' : month === 'jul' ? 'iframeJul' : 'iframeJun';
  const iframe = document.getElementById(iframeId);
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage({
      type: 'portal-status-change',
      videoId: videoId,
      status: roteiroStatus,
      source: 'portal'
    }, '*');
  }
}

function syncAllStatusesToIframes() {
  POSTS.forEach(p => {
    const st = STATE[p.id]?.status || 'pendente';
    notifyIframeStatusChange(p.id, st);
  });
}

function setupIframeSyncListener() {
  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!data || data.type !== 'roteiro-status-change' || data.source === 'portal') return;
    const month = data.month; // 'jun', 'jul' or 'ago'
    const videoId = data.videoId; // 'V01'
    const roteiroStatus = data.status; // roteiro status
    const portalId = videoIdToPortalId(videoId, month);
    const portalStatus = SYNC_ROTEIRO_TO_PORTAL[roteiroStatus] || 'pendente';
    if (!STATE[portalId]) return;
    if (STATE[portalId].status === portalStatus) return; // already in sync
    // Update portal state silently (no re-notify iframe to avoid loop)
    STATE[portalId].status = portalStatus;
    const dot = document.querySelector(`[onclick="scrollToPost('${portalId}')"] .cal-sdot`);
    if (dot) dot.style.background = STATUS_COLOR[portalStatus];
    // Update select dropdowns in post list
    const sel = document.querySelector(`#pi_${portalId} .s-sel`);
    if (sel) sel.value = portalStatus;
    updateStats();
    buildCronogramaInline();
    savePost(portalId);
  });
}

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
    showToast('Não foi possível carregar os dados. Verifique a conexão e recarregue.', true);
    const offMsg = '<div class="empty-state">Sem conexão com o servidor — recarregue a página para tentar de novo.</div>';
    const rb = document.getElementById('requestsBody');
    const af = document.getElementById('activityFeed');
    if (rb && !rb.querySelector('.request-item')) rb.innerHTML = offMsg;
    if (af && !af.querySelector('.activity-item')) af.innerHTML = offMsg;
  }
}

/* ─── SAVE ─── */
async function savePost(postId) {
  const s = STATE[postId];
  try {
    await API.updatePost(postId, s);
  } catch (e) {
    console.warn('Erro ao salvar post:', e);
    showToast('Erro ao salvar. Verifique sua conexão.', true);
  }
}

async function saveSetting(key, value) {
  try {
    await API.updateSetting(key, value);
  } catch (e) {
    console.warn('Erro ao salvar configuração:', e);
    showToast('Erro ao salvar. Verifique sua conexão.', true);
  }
}

/* ─── CALENDAR ─── */
function buildCalendar() {
  buildMonthCalendar('jun','calJunho','Junho 2026',30,'06',0,5);
  buildMonthCalendar('jul','calJulho','Julho 2026',31,'07',2,2);
  buildMonthCalendar('ago','calAgosto','Agosto 2026',31,'08',5,6);
}
function buildMonthCalendar(month,containerId,label,days,monthNum,leadEmpty,trailEmpty) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const mp = POSTS.filter(p=>p.month===month), byDay = {};
  mp.forEach(p => byDay[p.day] = p);
  const today = new Date().toISOString().slice(0,10);
  let html = `<div class="cal-mhdr"><span class="t">${label}</span><span class="s">${mp.length} reels · 3×/semana</span></div><div class="cal-grid">`;
  ['Seg','Ter','Qua','Qui','Sex','Sab','Dom'].forEach(d => html += `<div class="cal-head">${d}</div>`);
  for (let i=0;i<leadEmpty;i++) html += '<div class="cal-cell empty"></div>';
  for (let d=1;d<=days;d++) {
    const p = byDay[d], isToday = `2026-${monthNum}-${String(d).padStart(2,'0')}` === today;
    if (p) {
      const pl = PILLAR[p.pillar], st = STATE[p.id]?.status||'pendente';
      html += `<div class="cal-cell hp ${pl.calCls}${isToday?' today':''}" onclick="scrollToPost('${p.id}')">
        <span class="cal-dn">${d}</span><span class="cal-badge ${pl.badge}">${pl.icon}</span>
        <div class="cal-ev">${p.title.slice(0,20)}...</div>
        <div class="cal-sdot" style="background:${STATUS_COLOR[st]}"></div></div>`;
    } else {
      html += `<div class="cal-cell${isToday?' today':''}"><span class="cal-dn">${d}</span></div>`;
    }
  }
  for (let i=0;i<trailEmpty;i++) html += '<div class="cal-cell empty"></div>';
  html += '</div>';
  container.innerHTML = html;
}

/* ─── HTML ESCAPE (anti-XSS para dados vindos do Supabase/cliente) ─── */
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

/* ─── POST LIST ─── */
function buildPosts() {
  buildMonthPosts('jun','postsJunho');
  buildMonthPosts('jul','postsJulho');
  buildMonthPosts('ago','postsAgosto');
}
function buildMonthPosts(month,containerId) {
  const c = document.getElementById(containerId);
  if (!c) return;
  const mp = POSTS.filter(p=>p.month===month);
  let html = '';
  mp.forEach(p => {
    const pl = PILLAR[p.pillar], st = STATE[p.id]?.status||'pendente';
    const note = STATE[p.id]?.note||'', stars = STATE[p.id]?.stars||0;
    const opts = STATUS_OPT.map(s => `<option value="${s}"${s===st?' selected':''}>${STATUS_LBL[s]}</option>`).join('');
    const tags = p.tags.map(t => `<span class="post-tag">${t}</span>`).join('');
    const starsHtml = [1,2,3,4,5].map(i => `<span class="post-fb-star${i<=stars?' active':''}" onclick="setStars('${p.id}',${i})" data-pid="${p.id}" data-i="${i}">&#9733;</span>`).join('');
    html += `<div class="post-item" id="pi_${p.id}">
      <div class="post-date" style="${pl.dateBg}"><div class="post-day-n">${String(p.day).padStart(2,'0')}</div><div class="post-wday">${p.wday}</div></div>
      <div class="post-stripe" style="${pl.stripe}"></div>
      <div class="post-body">
        <div class="post-top"><span class="post-type-badge" style="${pl.typeCss}">${pl.icon} ${pl.label}</span>${p.sede?`<span class="sede-badge" style="background:${SEDE[p.sede].bg};color:${SEDE[p.sede].color};border:1px solid ${SEDE[p.sede].border}">${SEDE[p.sede].short}</span>`:''}<span class="post-num">${p.num}</span></div>
        <div class="post-title">${p.title}</div><div class="post-desc">${p.desc}</div>
        <div class="post-tags">${tags}</div>
      </div>
      <div class="post-actions">
        <select class="s-sel" aria-label="Status de ${p.title.replace(/"/g,'&quot;')}" onchange="setStatus('${p.id}',this.value)">${opts}</select>
        <div class="post-fb-row">${starsHtml}</div>
        <div class="post-note-btn" onclick="openNoteModal('${p.id}','${p.title.replace(/'/g,"\\'")}')">${note?esc(note):'+ Observação'}</div>
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
      <textarea class="fb-note" id="fbnote_${p.id}" placeholder="Comentário opcional sobre este conteúdo..." oninput="setFbNote('${p.id}',this.value)">${esc(fb)}</textarea>
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
  buildCronogramaInline();
  showToast('Status atualizado');
  savePost(id);
  notifyIframeStatusChange(id, val);
  const post = POSTS.find(p=>p.id===id);
  const target = Auth.isAdmin() ? 'client' : 'admin';
  API.notify(target, 'status_change', 'Status alterado: ' + (post?.title?.slice(0,40)||id), 'Novo status: ' + (STATUS_LBL[val]||val)).catch(()=>{});
  API.addActivity('Status do post "' + (post?.title?.slice(0,35)||id) + '..." alterado para ' + (STATUS_LBL[val]||val) + '.', 'Status do post').catch(()=>{});
}

function flashSaved(id) {
  const saved = document.getElementById('fbsaved_'+id);
  if (!saved) return;
  saved.classList.add('show');
  clearTimeout(saved._t);
  saved._t = setTimeout(() => saved.classList.remove('show'), 2200);
}

function setStars(id, n, fromBoard) {
  STATE[id].stars = n;
  document.querySelectorAll(`[data-pid="${id}"]`).forEach(s => s.classList.toggle('active', parseInt(s.dataset.i) <= n));
  document.querySelectorAll(`#fbc_${id} .fb-star`).forEach((s,i) => s.classList.toggle('active', i < n));
  if (fromBoard) flashSaved(id);
  updateStats();
  savePost(id);
}

function setFbNote(id, val) { STATE[id].fb = val; }

function saveFb(id) {
  flashSaved(id);
  showToast('Feedback salvo');
  updateStats();
  savePost(id);
  const post = POSTS.find(p=>p.id===id);
  const stars = STATE[id]?.stars||0;
  API.notify('admin', 'feedback', 'Feedback recebido: ' + (post?.title?.slice(0,35)||id), stars + ' estrelas' + (STATE[id]?.fb ? ' — "' + STATE[id].fb.slice(0,60) + '"' : '')).catch(()=>{});
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
    API.notify(target, 'note', 'Nota do mês atualizada', val.slice(0,80) + (val.length>80?'...':''));
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
    if (n.getAttribute('onclick')?.includes(`'${activeNote.id}'`)) n.textContent = val || '+ Observação';
  });
  showToast('Observação salva');
  const post = POSTS.find(p=>p.id===activeNote.id);
  const target = Auth.isAdmin() ? 'client' : 'admin';
  API.notify(target, 'note', 'Observação em post: ' + (post?.title?.slice(0,30)||''), val.slice(0,80));
  closeNoteModal();
  savePost(activeNote.id);
}

async function approvePhase(phase) {
  if (APPROVED[phase]) {
    APPROVED[phase] = false;
    renderApprovalState();
    const label = phase === 'essencial' ? 'Essencial' : 'Growth';
    showToast('Aprovação do Plano ' + label + ' revogada');
    await saveSetting('approved_' + phase, 'false');
    await API.addActivity('Aprovação do Plano ' + label + ' revogada.', 'Plano revogado');
    await API.notify('admin', 'approval', 'Aprovação revogada', 'O cliente revogou o Plano ' + label + '.');
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
  switchTab('calendario');
  const month = portalIdToMonth(id) + '2026';
  const mc = document.getElementById('month-'+month);
  if (mc && mc.classList.contains('collapsed')) mc.classList.remove('collapsed');
  setTimeout(() => { const el = document.getElementById('pi_'+id); if (el) el.scrollIntoView({behavior:'smooth',block:'center'}); }, 200);
}

/* ─── REQUESTS ─── */
function renderRequests(reqs) {
  const c = document.getElementById('requestsBody');
  if (!c) return;
  const icons = {pendente:'\u{1F4CC}',done:'\u{2705}',novo:'\u{1F514}'};
  const statusCls = {pendente:'rs-pendente',done:'rs-done',novo:'rs-novo'};
  const statusLbl = {pendente:'Pendente',done:'Feito',novo:'Novo'};
  const priLabel = {normal:'',urgente:'\u{1F7E1} Urgente',critico:'\u{1F534} Crítico'};
  const sorted = [...reqs].sort((a,b) => {
    if (a.status==='done'&&b.status!=='done') return 1;
    if (a.status!=='done'&&b.status==='done') return -1;
    return new Date(b.created_at) - new Date(a.created_at);
  });
  const pendingCount = sorted.filter(r => r.status !== 'done').length;
  const badge = document.getElementById('actionsBadge');
  if (badge) { badge.style.display = pendingCount ? 'inline-flex' : 'none'; badge.textContent = pendingCount; }
  if (!sorted.length) {
    c.innerHTML = '<div class="empty-state">Nenhum pedido por enquanto. Os pedidos enviados pelo formulário aparecem aqui.</div>';
    return;
  }
  c.innerHTML = sorted.map(r => `
    <div class="request-item${r.source==='client'?' req-item-client':''}">
      <div class="req-icon" style="background:${r.source==='client'?'var(--orange-light)':'var(--surface2)'}">${icons[r.status]||'\u{1F4CC}'}</div>
      <div class="req-content">
        <div class="req-title">${r.source==='client'?'<span class="req-source-tag">CLIENTE</span>':''}${esc(r.title)}${r.priority&&r.priority!=='normal'?' <span style="font-size:9px;color:var(--amber)">'+priLabel[r.priority]+'</span>':''}</div>
        <div class="req-desc">${esc(r.description)}</div>
        <div class="req-date">\u{23F0} ${esc(r.due_date)}</div>
        <div class="req-admin-btns">
          ${r.status!=='done'?`<button onclick="markRequestDone('${r.id}')" style="font-size:9px;padding:3px 10px;border-radius:6px;border:none;background:var(--green-light);color:var(--green-dark);cursor:pointer;font-weight:700">Concluído</button>`:''}
          <button onclick="deleteRequest('${r.id}')" style="font-size:9px;padding:3px 10px;border-radius:6px;border:none;background:var(--red-light);color:var(--red);cursor:pointer;font-weight:700">Remover</button>
        </div>
      </div>
      <span class="req-status ${statusCls[r.status]||'rs-pendente'}">${statusLbl[r.status]||r.status}</span>
    </div>`).join('');
}

function renderActivity(acts) {
  const c = document.getElementById('activityFeed');
  if (!c) return;
  if (!acts.length) {
    c.innerHTML = '<div class="empty-state">Nenhuma atividade registrada ainda.</div>';
    return;
  }
  c.innerHTML = acts.map(r => activityHTML(r)).join('');
}
function activityHTML(r) {
  const t = new Date(r.created_at);
  const label = isNaN(t) ? 'agora' : t.toLocaleString('pt-BR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
  const msg = r.bold_part
    ? esc(r.message).replace(esc(r.bold_part), `<strong>${esc(r.bold_part)}</strong>`)
    : esc(r.message);
  const delBtn = Auth.isAdmin() ? `<button class="act-del-btn admin-ctrl" onclick="deleteActivityItem('${r.id}')" title="Remover"><i data-lucide="x"></i></button>` : '';
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
    aok.innerHTML = `<span style="font-size:26px"><i data-lucide="check-circle"></i></span>
      <div style="flex:1">
        <div style="font-size:15px;font-weight:700;color:#fff;font-family:var(--font-heading)">Plano ${plan} aprovado!</div>
        <div style="font-size:11.5px;color:rgba(255,255,255,.75);margin-top:4px;line-height:1.6">O próximo ciclo está confirmado (${price}/mês). Rafael entrará em contato para agendar a reunião de início.</div>
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
      essBtn.innerHTML = '<i data-lucide="check-circle"></i> Aprovado — Clique para revogar';
      essBtn.style.background = 'var(--green)';
      essBtn.style.borderColor = 'var(--green)';
    } else {
      essBtn.innerHTML = '<i data-lucide="check"></i> Aprovar Plano Essencial';
      essBtn.style.background = '';
      essBtn.style.borderColor = '';
    }
  }
  if (growthBtn) {
    if (APPROVED.growth) {
      growthBtn.innerHTML = '<i data-lucide="check-circle"></i> Aprovado — Clique para revogar';
      growthBtn.style.background = 'var(--green)';
      growthBtn.style.borderColor = 'var(--green)';
    } else {
      growthBtn.innerHTML = '<i data-lucide="check"></i> Aprovar Plano Growth';
      growthBtn.style.background = '';
      growthBtn.style.borderColor = '';
    }
  }
  if (typeof lucide !== 'undefined') { try { lucide.createIcons({nameAttr:'data-lucide'}); } catch {} }
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
  const dueMap = {normal:'Quando possível',urgente:'Urgente — esta semana',critico:'Crítico — hoje'};
  const btn = document.getElementById('clientReqSendBtn');
  btn.disabled = true; btn.textContent = 'Enviando...';
  try {
    await API.createRequest({title, description:desc||'-', due_date:dueMap[priority], priority, source:'client'});
    closeClientReqModal();
    showToast('Pedido enviado! Responderemos em breve.');
    await API.notify('admin', 'request', 'Novo pedido do cliente: ' + title.slice(0,40), desc.slice(0,80) || 'Sem descrição');
    await API.addActivity('Cliente enviou pedido: "' + title.slice(0,40) + '"', 'pedido');
    const reqs = await API.getRequests();
    if (reqs) renderRequests(reqs);
  } catch (e) {
    console.warn('Erro ao enviar pedido:', e);
    showToast('Erro ao enviar pedido. Tente novamente.', true);
  } finally {
    btn.disabled = false; btn.textContent = 'Enviar pedido';
  }
}

async function markRequestDone(id) {
  if (!Auth.isAdmin()) return;
  try {
    await API.updateRequest(id, {status:'done'});
    showToast('Pedido concluído');
    await API.notify('client', 'request', 'Pedido concluído pelo admin', 'Um dos seus pedidos foi marcado como feito.');
    const reqs = await API.getRequests();
    if (reqs) renderRequests(reqs);
  } catch (e) {
    console.warn('Erro ao concluir pedido:', e);
    showToast('Erro ao atualizar pedido.', true);
  }
}

async function deleteRequest(id) {
  if (!Auth.isAdmin()) return;
  if (!confirm('Remover este pedido permanentemente?')) return;
  try {
    await API.deleteRequest(id);
    showToast('Pedido removido');
    const reqs = await API.getRequests();
    if (reqs) renderRequests(reqs);
  } catch (e) {
    console.warn('Erro ao remover pedido:', e);
    showToast('Erro ao remover pedido.', true);
  }
}

async function submitAdminRequest() {
  const title = document.getElementById('adminReqTitle').value.trim();
  const desc = document.getElementById('adminReqDesc').value.trim();
  const date = document.getElementById('adminReqDate').value.trim();
  if (!title) return;
  try {
    await API.createRequest({title, description:desc||'-', due_date:date||'Sem prazo definido', priority:'normal', source:'admin'});
    document.getElementById('adminReqModal').classList.remove('open');
    ['adminReqTitle','adminReqDesc','adminReqDate'].forEach(id => { document.getElementById(id).value = ''; });
    showToast('Pedido criado com sucesso');
    await API.notify('client', 'request', 'Novo pedido do admin: ' + title.slice(0,40), desc.slice(0,80) || title);
    await API.addActivity('Admin criou pedido: "' + title.slice(0,40) + '"', 'pedido');
    const reqs = await API.getRequests();
    if (reqs) renderRequests(reqs);
  } catch (e) {
    console.warn('Erro ao criar pedido:', e);
    showToast('Erro ao criar pedido.', true);
  }
}

async function submitAdminActivity() {
  const msg = document.getElementById('adminActMsg').value.trim();
  if (!msg) return;
  try {
    await API.addActivity(msg, msg.slice(0,40));
    document.getElementById('adminActModal').classList.remove('open');
    document.getElementById('adminActMsg').value = '';
    showToast('Atividade registrada');
    await API.notify('client', 'activity', 'Nova atividade registrada', msg.slice(0,80));
    const acts = await API.getActivity();
    if (acts) renderActivity(acts);
  } catch (e) {
    console.warn('Erro ao registrar atividade:', e);
    showToast('Erro ao registrar atividade.', true);
  }
}

/* ─── CRONOGRAMA INLINE ─── */
function buildCronogramaInline() {
  buildMonthCronograma('jun','cronInlineJunho','Jun');
  buildMonthCronograma('jul','cronInlineJulho','Jul');
  buildMonthCronograma('ago','cronInlineAgosto','Ago');
}
function buildMonthCronograma(month,containerId,monthLabel) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const mp = POSTS.filter(p=>p.month===month);
  const ps = {a:{bg:'var(--blue-light)',color:'var(--blue-dark)',label:'Autoridade'},c:{bg:'var(--green-light)',color:'var(--green-dark)',label:'Conexão'},v:{bg:'var(--orange-light)',color:'#92400E',label:'Conversão'}};
  let html = '<div class="cron-inline-grid">';
  mp.forEach(p => {
    const s = ps[p.pillar]||ps.a, st = STATE[p.id]||{status:'pendente'};
    html += `<div class="cron-inline-card" data-pillar="${p.pillar}">
      <div class="cron-inline-hdr"><div><div class="cron-inline-day">${p.day} ${monthLabel}</div><div class="cron-inline-wday">${p.wday} - Post ${p.num}</div></div>
      <span class="cron-inline-pillar" style="background:${s.bg};color:${s.color}">${PILLAR[p.pillar].icon} ${s.label}</span>${p.sede?`<span class="sede-badge" style="background:${SEDE[p.sede].bg};color:${SEDE[p.sede].color};border:1px solid ${SEDE[p.sede].border};font-size:9px;padding:1px 6px">${SEDE[p.sede].short}</span>`:''}</div>
      <div class="cron-inline-title">${p.title}</div><div class="cron-inline-desc">${p.desc}</div>
      <div class="cron-inline-tags">${p.tags.map(t=>'<span class="cron-inline-tag">'+t+'</span>').join('')}</div>
      <div class="cron-inline-status"><span class="cron-inline-status-dot" style="background:${STATUS_COLOR[st.status]||'#94A3B8'}"></span>${STATUS_LBL[st.status]||'Pendente'}</div></div>`;
  });
  html += '</div>';
  el.innerHTML = html;
}

/* ─── TIMELINE (dynamic) ─── */
const DEFAULT_TIMELINE = [
  {title:'Período de Teste',status:'done',badge:'Encerrado',desc:'Análise inicial da academia, proposta aprovada e início do projeto.',date:'Maio 2026',price:''},
  {title:'Fase Teste — Descoberta',status:'active',badge:'Agora',desc:'12 reels, 3 pilares, identificação das narrativas com maior engajamento. Relatório final em 30/06.',date:'03 Jun – 30 Jun 2026',price:'R$ 1.200 / mês único'},
  {title:'Reunião de Alinhamento',status:'upcoming',badge:'Próximo',desc:'Apresentação dos resultados da Fase Teste. Decisão sobre continuidade e qual plano seguir.',date:'Final de Junho 2026',price:''},
  {title:'Plano Essencial',status:'upcoming',badge:'Aguardando aprovação',desc:'12 vídeos/mês, reunião mensal, relatório de desempenho, stories estratégicos.',date:'Jul – Set 2026 (após aprovação)',price:'R$ 2.800 / mês · Meses 2 a 4'},
  {title:'Plano Growth',status:'locked',badge:'Futuro',desc:'Meta Ads, lookalike audience, stories diários, campanhas sazonais, relatório CPL/ROI.',date:'Out 2026 em diante',price:'R$ 4.500 / mês · Mês 5+'},
];
let TIMELINE = [];

function buildTimeline() {
  const c = document.getElementById('timelineContainer');
  if (!c) return;
  const sm = {
    done:{dot:'done',icon:'<i data-lucide="check"></i>',bcls:'tl-b-done'},
    active:{dot:'active',icon:'<i data-lucide="circle-dot"></i>',bcls:'tl-b-active'},
    upcoming:{dot:'upcoming',icon:'<i data-lucide="clock"></i>',bcls:'tl-b-next'},
    locked:{dot:'locked',icon:'<i data-lucide="lock"></i>',bcls:'tl-b-locked'}
  };
  let html = '';
  TIMELINE.forEach((s,i) => {
    const m = sm[s.status]||sm.upcoming;
    const adminBtns = Auth.isAdmin() ? `<div class="tl-admin-btns">
      <button class="tl-edit-btn" onclick="editTimelineStep(${i})" title="Editar"><i data-lucide="pencil"></i></button>
      <button class="tl-del-btn" onclick="deleteTimelineStep(${i})" title="Remover"><i data-lucide="x"></i></button>
    </div>` : '';
    html += `<div class="tl-item"><div class="tl-dot ${m.dot}">${m.icon}</div><div class="tl-content"><div class="tl-header"><span class="tl-title">${s.title}</span><span class="tl-badge ${m.bcls}">${s.badge}</span>${adminBtns}</div><div class="tl-desc">${s.desc}</div>${s.price?'<div class="tl-price">'+s.price+'</div>':''}<div class="tl-date">${s.date}</div></div></div>`;
  });
  if (Auth.isAdmin()) {
    html += `<div style="padding:8px 0 0 42px"><button class="btn" style="font-size:10px;padding:6px 14px;background:var(--surface2);border:1.5px dashed var(--border);color:var(--muted);border-radius:8px;cursor:pointer;font-weight:600" onclick="addTimelineStep()"><i data-lucide="plus"></i> Adicionar etapa</button></div>`;
  }
  c.innerHTML = html;
  if (typeof lucide !== 'undefined') { try { lucide.createIcons({nameAttr:'data-lucide'}); } catch {} }
  buildEtapasSummary();
}

function buildEtapasSummary() {
  const el = document.getElementById('etapasSummary');
  if (!el || !TIMELINE.length) return;
  const active = TIMELINE.find(s => s.status === 'active');
  const doneCount = TIMELINE.filter(s => s.status === 'done').length;
  const activeIdx = TIMELINE.findIndex(s => s.status === 'active');
  const nextStep = TIMELINE.find((s,i) => i > activeIdx && (s.status === 'upcoming' || s.status === 'locked'));
  const progressSteps = TIMELINE.map(s => `<div class="ep-step ${s.status}"></div>`).join('');
  const stepLabel = active ? `Etapa ${activeIdx+1} de ${TIMELINE.length}` : `${doneCount} de ${TIMELINE.length} concluídas`;
  let html = '<div class="etapas-summary">';
  if (active) {
    html += `<div class="etapas-summary-current"><div class="es-dot"><i data-lucide="circle-dot"></i></div><div class="es-info"><div class="es-label">Etapa atual</div><div class="es-title">${active.title}</div><div class="es-date">${active.date}</div></div></div>`;
  }
  html += `<div><div class="etapas-progress-label"><span>${stepLabel}</span><span>${doneCount>0?doneCount+' concluída'+(doneCount>1?'s':''):''}</span></div><div class="etapas-progress">${progressSteps}</div></div>`;
  if (nextStep) {
    html += `<div class="etapas-next"><span class="en-icon"><i data-lucide="arrow-right"></i></span><span><strong>Próximo:</strong> ${nextStep.title}${nextStep.date?' — '+nextStep.date:''}</span></div>`;
  }
  html += '</div>';
  el.innerHTML = html;
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
  try {
    await API.deleteActivity(id);
    showToast('Atividade removida');
    const acts = await API.getActivity();
    if (acts) renderActivity(acts);
  } catch (e) {
    console.warn('Erro ao remover atividade:', e);
    showToast('Erro ao remover atividade.', true);
  }
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
  // Per-month stats
  const junPosts = POSTS.filter(p=>p.month==='jun'), julPosts = POSTS.filter(p=>p.month==='jul'), agoPosts = POSTS.filter(p=>p.month==='ago');
  const junPub = junPosts.filter(p=>(STATE[p.id]||{}).status==='publicado').length;
  const julPub = julPosts.filter(p=>(STATE[p.id]||{}).status==='publicado').length;
  const agoPub = agoPosts.filter(p=>(STATE[p.id]||{}).status==='publicado').length;
  const junPct = junPosts.length ? Math.round(junPub/junPosts.length*100) : 0;
  const julPct = julPosts.length ? Math.round(julPub/julPosts.length*100) : 0;
  const agoPct = agoPosts.length ? Math.round(agoPub/agoPosts.length*100) : 0;
  const ids = {
    sbPct:pct+'%', statPub:pub, statFeedback:fbCount,
    pctJunho:junPct+'%', monthJunPct:junPct+'%', sJunhoPub:junPub,
    pctJulho:julPct+'%', monthJulPct:julPct+'%', sJulhoPub:julPub,
    pctAgosto:agoPct+'%', monthAgoPct:agoPct+'%', sAgostoPub:agoPub,
    ringTotalPct:pct+'%', ringFbPct:fbPct+'%',
    statPillarSub:`${aTot} · ${cTot} · ${vTot}`
  };
  Object.entries(ids).forEach(([id,val]) => { const el=document.getElementById(id); if(el)el.textContent=val; });
  const sbFill = document.getElementById('sbFill'); if(sbFill) sbFill.style.width = pct+'%';
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
    offline:{dot:'#EF4444',label:'Offline',title:'Sem conexão'},
    connecting:{dot:'#F59E0B',label:'Conectando...',title:'Conectando ao servidor'},
  };
  const c = cfg[state]||cfg.offline;
  el.title = c.title;
  el.querySelector('.conn-dot').style.background = c.dot;
  el.querySelector('.conn-label').textContent = c.label;
}

/* ─── NAVIGATION ─── */
function switchTab(tab) { Router.navigate(tab); if (window.innerWidth <= 900) closeSidebar(); }

/* Lazy-load dos iframes de roteiro: só carregam na primeira visita à aba.
   (loading="lazy" não basta — em abas display:none o Chromium carrega eager.) */
function loadRoteiroIframes() {
  document.querySelectorAll('iframe.roteiro-iframe[data-src]').forEach(f => {
    f.src = f.dataset.src;
    f.removeAttribute('data-src');
  });
}
function toggleCron(m) {
  const w = document.getElementById('cron-wrap-'+m), a = document.getElementById('cron-arrow-'+m);
  if (!w || !a) return;
  const o = w.classList.toggle('open'); a.classList.toggle('open', o);
}
function toggleCard(id, evt) {
  if (evt && evt.target.closest('button')) return;
  const card = document.getElementById(id);
  if (!card) return;
  const collapsed = card.classList.toggle('collapsed');
  try { const key = 'ip3_card_' + id; if (collapsed) localStorage.setItem(key, '1'); else localStorage.removeItem(key); } catch {}
}
function restoreCardStates() {
  document.querySelectorAll('.card[id]').forEach(c => {
    try { if (localStorage.getItem('ip3_card_' + c.id) === '1') c.classList.add('collapsed'); } catch {}
  });
}
function goBack() { Router.back(); }

/* ─── DARK MODE ─── */
let _themeAnimTimer;
function toggleDark() {
  const h = document.documentElement, d = h.dataset.theme==='dark';
  // transição suave e coesa de cores durante a troca (removida após 320ms)
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if (!reduce) {
    h.classList.add('theme-anim');
    clearTimeout(_themeAnimTimer);
    _themeAnimTimer = setTimeout(() => h.classList.remove('theme-anim'), 320);
  }
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
function showToast(msg, isError) {
  const t = document.getElementById('toast');
  if (!t) { console.warn('toast:', msg); return; }   // null-guard: não mascara o erro original
  const icon = isError ? 'alert-triangle' : 'check';
  t.innerHTML = `<i data-lucide="${icon}"></i> ${esc(msg)}`;
  t.classList.toggle('toast-error', !!isError);
  t.setAttribute('aria-live', isError ? 'assertive' : 'polite');  // erros interrompem o leitor de tela
  t.classList.add('show');
  if (typeof lucide !== 'undefined') { try { lucide.createIcons(); } catch {} }
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.classList.remove('show'); t.classList.remove('toast-error'); }, isError ? 4000 : 2500);
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
  if (!panel) return;
  const opening = !panel.classList.contains('open');
  panel.classList.toggle('open', opening);
  const bell = document.querySelector('.notif-bell');
  if (bell) bell.setAttribute('aria-expanded', opening ? 'true' : 'false');
  if (opening) {
    loadNotifications();
    // adia o registro p/ o clique atual não fechar na hora; só 1 listener ativo
    setTimeout(() => document.addEventListener('click', closeNotifOnOutside, { once: true }), 0);
  } else {
    document.removeEventListener('click', closeNotifOnOutside);
  }
}
function closeNotifOnOutside(e) {
  const panel = document.getElementById('notifPanel');
  const wrap = panel?.closest('.notif-wrap');
  if (wrap && !wrap.contains(e.target)) {
    panel.classList.remove('open');
    const bell = document.querySelector('.notif-bell');
    if (bell) bell.setAttribute('aria-expanded', 'false');
  }
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
  if (!notifs.length) { list.innerHTML = '<div class="notif-empty">Nenhuma notificação ainda.</div>'; return; }
  list.innerHTML = notifs.map(n => {
    const ic = NOTIF_ICONS[n.type] || NOTIF_ICONS.activity;
    const t = new Date(n.created_at);
    const ago = timeAgo(t);
    return `<div class="notif-item${n.read?'':' unread'}" onclick="markNotifRead('${n.id}',this)">
      <div class="notif-icon ${ic.cls}">${ic.icon}</div>
      <div class="notif-body">
        <div class="notif-title">${esc(n.title)}</div>
        ${n.message ? '<div class="notif-msg">' + esc(n.message) + '</div>' : ''}
        <div class="notif-time">${ago}</div>
      </div></div>`;
  }).join('');
}

function timeAgo(date) {
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return 'Agora';
  if (diff < 3600) return Math.floor(diff/60) + ' min atrás';
  if (diff < 86400) return Math.floor(diff/3600) + 'h atrás';
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
    showToast('\u{1F514} ' + (notif.title||'Nova notificação'));
    const panel = document.getElementById('notifPanel');
    if (panel?.classList.contains('open')) loadNotifications();
  });
  API.subscribeChanges('requests', async () => {
    try { const reqs = await API.getRequests(); if (reqs) renderRequests(reqs); }
    catch (e) { console.warn('realtime requests:', e); }
  });
  API.subscribeChanges('activity', async () => {
    try { const acts = await API.getActivity(); if (acts) renderActivity(acts); }
    catch (e) { console.warn('realtime activity:', e); }
  });
  // post_data: debounce p/ não re-renderizar a cada echo (evita flicker/perda de foco)
  API.subscribeChanges('post_data', () => {
    clearTimeout(_postDataTimer);
    _postDataTimer = setTimeout(async () => {
      try {
        const posts = await API.getPosts();
        if (posts) {
          posts.forEach(r => { STATE[r.post_id] = {status:r.status||'pendente',stars:r.stars||0,fb:r.feedback||'',note:r.note||''}; });
          buildCalendar(); buildPosts(); buildFeedbackBoard(); updateStats(); buildCronogramaInline();
          syncAllStatusesToIframes();
        }
      } catch (e) { console.warn('realtime post_data:', e); }
    }, 300);
  });
}
let _postDataTimer;

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
  const types = ['video','video','video','video','foto','video','video','video','video','video','video','foto'];
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
        <div class="gallery-thumb-overlay"><span><i data-lucide="eye"></i></span></div>
      </div>
      <div class="gallery-info">
        <div class="gallery-title">${p.title}</div>
        <div class="gallery-meta">
          <span class="gallery-badge" style="${typeBg[t]}">${typeLabels[t]}</span>
          <span>${String(p.day).padStart(2,'0')}/${MONTH_NUM[p.month]||'06'}</span>
          <span style="margin-left:auto;width:7px;height:7px;border-radius:50%;background:${STATUS_COLOR[st]}" title="${STATUS_LBL[st]}"></span>
        </div>
      </div>
    </div>`;
  });
  grid.innerHTML = html;
  if (typeof lucide !== 'undefined') { try { lucide.createIcons({nameAttr:'data-lucide'}); } catch {} }
}

/* ─── RESULTADOS (Instagram metrics + production status) ─── */
let IG_POSTS_DATA = {};
let IG_ACCOUNT_DATA = null;
let IG_ACCOUNT_PREV = null;
let igMonthFilter = 'todos';

const MONTH_NUM = {jun:'06',jul:'07',ago:'08'};

function fmtN(n) { if (n==null||n===0) return '-'; if (n>=1e6) return (n/1e6).toFixed(1)+'M'; if (n>=1e3) return (n/1e3).toFixed(1)+'K'; return String(n); }
function fmtPct(n) { if (n==null) return '-'; return n.toFixed(1)+'%'; }
function changeBadge(cur, prev, suffix) {
  if (cur==null||prev==null||prev===0) return '<span class="metric-change metric-neutral">--</span>';
  const diff = cur - prev; const pct = (diff/prev*100).toFixed(1);
  if (diff > 0) return `<span class="metric-change metric-up">+${pct}%${suffix?' '+suffix:''}</span>`;
  if (diff < 0) return `<span class="metric-change metric-down">${pct}%${suffix?' '+suffix:''}</span>`;
  return '<span class="metric-change metric-neutral">0%</span>';
}

async function loadIgData() {
  try {
    const [acctRows, postRows] = await Promise.all([API.getIgAccount(), API.getIgPosts()]);
    if (acctRows.length > 0) IG_ACCOUNT_DATA = acctRows[0];
    if (acctRows.length > 1) IG_ACCOUNT_PREV = acctRows[1];
    IG_POSTS_DATA = {};
    postRows.forEach(r => { IG_POSTS_DATA[r.post_id] = r; });
  } catch {}
}

function buildResultados() {
  buildIgAccount();
  buildIgPostsTable();
  buildIgTopPosts();
  buildIgPilares();
  buildIgSedes();
  buildProductionStatus();
  if (typeof lucide !== 'undefined') { try { lucide.createIcons({nameAttr:'data-lucide'}); } catch {} }
}

function buildIgAccount() {
  const a = IG_ACCOUNT_DATA;
  const p = IG_ACCOUNT_PREV;
  document.getElementById('igFollowers').textContent = a ? fmtN(a.followers) : '--';
  document.getElementById('igReach').textContent = a ? fmtN(a.reach) : '--';
  document.getElementById('igEngagement').textContent = a ? fmtPct(a.engagement_rate) : '--';
  document.getElementById('igProfileVisits').textContent = a ? fmtN(a.profile_visits) : '--';
  document.getElementById('igFollowersChange').innerHTML = a&&p ? changeBadge(a.followers, p.followers) : '<span class="metric-change metric-neutral">--</span>';
  document.getElementById('igReachChange').innerHTML = a&&p ? changeBadge(a.reach, p.reach) : '<span class="metric-change metric-neutral">--</span>';
  document.getElementById('igEngagementChange').innerHTML = a&&p ? changeBadge(a.engagement_rate, p.engagement_rate, 'pp') : '<span class="metric-change metric-neutral">--</span>';
  document.getElementById('igProfileVisitsChange').innerHTML = a&&p ? changeBadge(a.profile_visits, p.profile_visits) : '<span class="metric-change metric-neutral">--</span>';
}

function buildIgPostsTable() {
  const tbody = document.getElementById('igPostsBody');
  const tfoot = document.getElementById('igPostsFoot');
  if (!tbody) return;
  let html = '';
  let totals = {views:0,likes:0,comments:0,shares:0,saves:0,reach:0,count:0};

  POSTS.forEach(p => {
    const ig = IG_POSTS_DATA[p.id] || {};
    const hasData = ig.views || ig.likes || ig.comments || ig.shares || ig.saves;
    const v = (n) => n ? `<span class="ig-val">${fmtN(n)}</span>` : '<span class="ig-val zero">-</span>';
    const sedeInfo = SEDE[p.sede] || SEDE.ambas;
    const monthCode = p.month || p.id.replace(/\d+/,'');
    const monthLabel = MONTH_NUM[monthCode] || '06';
    const engRate = ig.reach > 0 ? ((ig.likes||0)+(ig.comments||0)+(ig.shares||0)+(ig.saves||0))/ig.reach*100 : 0;
    const engClass = engRate >= 8 ? 'high' : engRate >= 3 ? 'mid' : 'low';

    if (hasData) { totals.views+=(ig.views||0); totals.likes+=(ig.likes||0); totals.comments+=(ig.comments||0); totals.shares+=(ig.shares||0); totals.saves+=(ig.saves||0); totals.reach+=(ig.reach||0); totals.count++; }

    const hidden = igMonthFilter !== 'todos' && monthCode !== igMonthFilter ? ' data-ig-hidden' : '';
    html += `<tr${hidden}>
      <td><div class="ig-post-cell">
        <div class="ig-post-icon" style="background:${PILLAR[p.pillar]?.bg||'var(--surface2)'}">${PILLAR[p.pillar]?.icon||'&#128249;'}</div>
        <div class="ig-post-info">
          <div class="ig-post-title">${p.title}</div>
          <div class="ig-post-meta">${String(p.day).padStart(2,'0')}/${monthLabel} · ${PILLAR[p.pillar]?.label||''}</div>
        </div>
      </div></td>
      <td style="text-align:center"><span class="ig-sede-badge" style="background:${sedeInfo.bg};color:${sedeInfo.color};border:1px solid ${sedeInfo.border}">${sedeInfo.short}</span></td>
      <td>${v(ig.views)}</td>
      <td>${v(ig.likes)}</td>
      <td>${v(ig.comments)}</td>
      <td>${v(ig.shares)}</td>
      <td>${v(ig.saves)}</td>
      <td>${v(ig.reach)}</td>
      <td><span class="ig-eng ${hasData?engClass:'low'}">${hasData?fmtPct(engRate):'-'}</span></td>
    </tr>`;
  });
  tbody.innerHTML = html;

  if (tfoot) {
    const totalEng = totals.reach > 0 ? (totals.likes+totals.comments+totals.shares+totals.saves)/totals.reach*100 : 0;
    tfoot.innerHTML = totals.count > 0 ? `<tr>
      <td colspan="2" style="text-align:left">Total (${totals.count} posts com dados)</td>
      <td>${fmtN(totals.views)}</td><td>${fmtN(totals.likes)}</td><td>${fmtN(totals.comments)}</td>
      <td>${fmtN(totals.shares)}</td><td>${fmtN(totals.saves)}</td><td>${fmtN(totals.reach)}</td>
      <td><span class="ig-eng ${totalEng>=8?'high':totalEng>=3?'mid':'low'}">${fmtPct(totalEng)}</span></td>
    </tr>` : `<tr><td colspan="9" style="text-align:center;color:var(--muted);font-weight:400;font-style:italic">Nenhum dado do Instagram ainda. Insira via Supabase (tabela instagram_posts).</td></tr>`;
  }
}

function buildIgTopPosts() {
  const el = document.getElementById('igTopPosts');
  if (!el) return;
  const withData = POSTS.filter(p => IG_POSTS_DATA[p.id]?.views > 0)
    .map(p => ({...p, ig: IG_POSTS_DATA[p.id], eng: IG_POSTS_DATA[p.id].reach > 0 ? ((IG_POSTS_DATA[p.id].likes||0)+(IG_POSTS_DATA[p.id].comments||0)+(IG_POSTS_DATA[p.id].shares||0)+(IG_POSTS_DATA[p.id].saves||0))/IG_POSTS_DATA[p.id].reach*100 : 0}))
    .sort((a,b) => b.eng - a.eng);

  if (withData.length === 0) {
    el.innerHTML = '<div class="empty-state"><div class="empty-state-icon"><i data-lucide="trophy"></i></div><div class="empty-state-title">Sem dados de engajamento</div><div class="empty-state-desc">Os posts aparecerão aqui quando tiverem métricas do Instagram.</div></div>';
    return;
  }
  let html = '<div style="display:flex;flex-direction:column;gap:8px">';
  withData.slice(0,5).forEach((p, i) => {
    html += `<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:var(--r);background:var(--surface2)">
      <span style="font-size:14px;font-weight:800;color:${i===0?'#E1306C':i===1?'var(--orange)':'var(--muted)'};width:22px;text-align:center">${i+1}</span>
      <span>${PILLAR[p.pillar]?.icon||''}</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:11px;font-weight:600;color:var(--heading);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.title}</div>
        <div style="font-size:9px;color:var(--muted);margin-top:2px">${fmtN(p.ig.views)} views · ${fmtN(p.ig.likes)} likes · ${fmtN(p.ig.saves)} salvos</div>
      </div>
      <span class="ig-eng ${p.eng>=8?'high':p.eng>=3?'mid':'low'}">${fmtPct(p.eng)}</span>
    </div>`;
  });
  html += '</div>';
  el.innerHTML = html;
}

function buildIgPilares() {
  const el = document.getElementById('igPilares');
  if (!el) return;
  let html = '<div style="display:flex;flex-direction:column;gap:12px">';
  ['a','c','v'].forEach(k => {
    const posts = POSTS.filter(p => p.pillar === k);
    const withIg = posts.filter(p => IG_POSTS_DATA[p.id]?.views > 0);
    const pl = PILLAR[k];
    const sumViews = withIg.reduce((s,p) => s + (IG_POSTS_DATA[p.id]?.views||0), 0);
    const sumLikes = withIg.reduce((s,p) => s + (IG_POSTS_DATA[p.id]?.likes||0), 0);
    const sumReach = withIg.reduce((s,p) => s + (IG_POSTS_DATA[p.id]?.reach||0), 0);
    const sumSaves = withIg.reduce((s,p) => s + (IG_POSTS_DATA[p.id]?.saves||0), 0);
    const eng = sumReach > 0 ? (sumLikes+sumSaves)/sumReach*100 : 0;
    html += `<div style="padding:14px 16px;border-radius:var(--r);background:var(--surface2);border:1px solid var(--border)">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="font-size:16px">${pl.icon}</span>
        <span style="font-size:13px;font-weight:700;color:var(--heading)">${pl.label}</span>
        <span style="margin-left:auto;font-size:10px;color:var(--muted)">${withIg.length}/${posts.length} com dados</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px">
        <div style="text-align:center"><div style="font-size:16px;font-weight:800;color:var(--heading)">${fmtN(sumViews)}</div><div style="font-size:9px;color:var(--muted)">Views</div></div>
        <div style="text-align:center"><div style="font-size:16px;font-weight:800;color:var(--heading)">${fmtN(sumLikes)}</div><div style="font-size:9px;color:var(--muted)">Likes</div></div>
        <div style="text-align:center"><div style="font-size:16px;font-weight:800;color:${eng>=8?'#065F46':eng>=3?'#92400E':'var(--muted)'}">${fmtPct(eng)}</div><div style="font-size:9px;color:var(--muted)">Eng.</div></div>
      </div>
    </div>`;
  });
  html += '</div>';
  el.innerHTML = html;
}

function buildIgSedes() {
  const el = document.getElementById('igSedes');
  if (!el) return;
  let html = '<div style="display:flex;flex-direction:column;gap:12px">';
  ['bv','centro','ambas'].forEach(sk => {
    const sedeInfo = SEDE[sk];
    const posts = POSTS.filter(p => p.sede === sk);
    const withIg = posts.filter(p => IG_POSTS_DATA[p.id]?.views > 0);
    const sumViews = withIg.reduce((s,p) => s + (IG_POSTS_DATA[p.id]?.views||0), 0);
    const sumLikes = withIg.reduce((s,p) => s + (IG_POSTS_DATA[p.id]?.likes||0), 0);
    const sumReach = withIg.reduce((s,p) => s + (IG_POSTS_DATA[p.id]?.reach||0), 0);
    const sumSaves = withIg.reduce((s,p) => s + (IG_POSTS_DATA[p.id]?.saves||0), 0);
    const eng = sumReach > 0 ? (sumLikes+sumSaves)/sumReach*100 : 0;
    html += `<div style="padding:14px 16px;border-radius:var(--r);background:var(--surface2);border:1px solid ${sedeInfo.border}">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span class="ig-sede-badge" style="background:${sedeInfo.bg};color:${sedeInfo.color};border:1px solid ${sedeInfo.border}">${sedeInfo.short}</span>
        <span style="font-size:13px;font-weight:700;color:var(--heading)">${sedeInfo.label}</span>
        <span style="margin-left:auto;font-size:10px;color:var(--muted)">${withIg.length}/${posts.length} com dados</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px">
        <div style="text-align:center"><div style="font-size:16px;font-weight:800;color:var(--heading)">${fmtN(sumViews)}</div><div style="font-size:9px;color:var(--muted)">Views</div></div>
        <div style="text-align:center"><div style="font-size:16px;font-weight:800;color:var(--heading)">${fmtN(sumLikes)}</div><div style="font-size:9px;color:var(--muted)">Likes</div></div>
        <div style="text-align:center"><div style="font-size:16px;font-weight:800;color:${eng>=8?'#065F46':eng>=3?'#92400E':'var(--muted)'}">${fmtPct(eng)}</div><div style="font-size:9px;color:var(--muted)">Eng.</div></div>
      </div>
    </div>`;
  });
  html += '</div>';
  el.innerHTML = html;
}

function buildProductionStatus() {
  const list = document.getElementById('resultadosPostList');
  if (!list) return;
  let html = '<div style="display:flex;flex-direction:column;gap:10px">';
  POSTS.forEach(p => {
    const st = STATE[p.id]?.status || 'pendente';
    const stars = STATE[p.id]?.stars || 0;
    const monthCode = p.month || p.id.replace(/\d+/,'');
    const monthLabel = MONTH_NUM[monthCode] || '06';
    const starsHtml = stars > 0 ? '&#9733;'.repeat(stars) + '<span style="opacity:.3">' + '&#9733;'.repeat(5 - stars) + '</span>' : '<span style="opacity:.3">&#9733;&#9733;&#9733;&#9733;&#9733;</span>';
    html += `<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:var(--r);background:var(--surface2);border:1px solid var(--border)">
      <span style="font-size:16px">${PILLAR[p.pillar]?.icon||'&#128249;'}</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:12px;font-weight:600;color:var(--heading);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.title}</div>
        <div style="font-size:10px;color:var(--muted);margin-top:2px">${String(p.day).padStart(2,'0')}/${monthLabel} · ${PILLAR[p.pillar]?.label||''}</div>
      </div>
      <div style="font-size:12px;color:#FBBF24">${starsHtml}</div>
      <span style="font-size:9px;font-weight:700;padding:3px 10px;border-radius:10px;background:${STATUS_COLOR[st]}20;color:${STATUS_COLOR[st]};white-space:nowrap">${STATUS_LBL[st]}</span>
    </div>`;
  });
  html += '</div>';
  list.innerHTML = html;
}

function filterIgMonth(month, btn) {
  igMonthFilter = month;
  document.querySelectorAll('#igMonthPills .pill').forEach(p => p.classList.remove('on'));
  if (btn) btn.classList.add('on');
  buildIgPostsTable();
  if (typeof lucide !== 'undefined') { try { lucide.createIcons({nameAttr:'data-lucide'}); } catch {} }
}

/* ─── PDF EXPORT ─── */
// html2pdf (~200KB) é carregado só no 1º export, fora do boot.
let _html2pdfPromise = null;
function loadHtml2Pdf() {
  if (typeof html2pdf !== 'undefined') return Promise.resolve(true);
  if (_html2pdfPromise) return _html2pdfPromise;
  _html2pdfPromise = new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
  return _html2pdfPromise;
}

async function exportPDF() {
  showToast('Preparando exportação...');
  const ok = await loadHtml2Pdf();
  if (!ok || typeof html2pdf === 'undefined') {
    // Fallback para impressão se o html2pdf não carregar
    document.body.classList.add('pdf-export');
    window.print();
    setTimeout(() => document.body.classList.remove('pdf-export'), 1000);
    return;
  }
  const panel = document.querySelector('.tab-panel.active');
  if (!panel) return;
  const tabName = panel.id.replace('panel-', '');
  const labels = { dashboard:'Dashboard', calendario:'Calendário', pilares:'3 Pilares', fases:'Próximas Fases', resultados:'Resultados', galeria:'Galeria', contrato:'Contrato' };
  const fileName = `ITS_Power_${labels[tabName] || tabName}_${new Date().toISOString().slice(0,10)}.pdf`;

  // Temporarily expand collapsed cards for export
  const collapsed = panel.querySelectorAll('.card.collapsed');
  collapsed.forEach(c => c.classList.remove('collapsed'));

  showToast('Gerando PDF...');
  const opt = {
    margin: [10, 10, 10, 10],
    filename: fileName,
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };
  html2pdf().set(opt).from(panel).save().then(() => {
    // Restore collapsed state
    collapsed.forEach(c => c.classList.add('collapsed'));
    showToast('PDF exportado com sucesso!');
  }).catch(() => {
    collapsed.forEach(c => c.classList.add('collapsed'));
    showToast('Erro ao gerar PDF. Tentando impressão...');
    document.body.classList.add('pdf-export');
    window.print();
    setTimeout(() => document.body.classList.remove('pdf-export'), 1000);
  });
}

/* ─── INIT ─── */
async function initApp() {
  try { if (localStorage.getItem('ip3_dark')==='true') document.documentElement.dataset.theme = 'dark'; } catch {}
  TIMELINE = JSON.parse(JSON.stringify(DEFAULT_TIMELINE));

  // Show skeleton loading while data loads
  document.querySelectorAll('.card-body').forEach(el => {
    if (!el.children.length) el.innerHTML = '<div class="skeleton skeleton-card"></div>';
  });

  // Setup modal close on backdrop click and Escape key
  document.querySelectorAll('.modal-bg').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const open = document.querySelector('.modal-bg.open');
      if (open) { open.classList.remove('open'); e.preventDefault(); }
    }
  });

  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') { try { lucide.createIcons(); } catch {} }

  restoreCardStates();
  Router.init();
  setupIframeSyncListener();

  // Load data FIRST, then render once (fixes double render)
  await loadData();
  await loadIgData();
  buildCalendar(); buildPosts(); buildFeedbackBoard(); updateStats(); buildCronogramaInline();
  buildGallery(); buildResultados(); buildTimeline();

  // Push portal state to roteiro iframes once they load
  ['iframeAgo','iframeJul','iframeJun'].forEach(id => {
    const iframe = document.getElementById(id);
    if (iframe) iframe.addEventListener('load', () => syncAllStatusesToIframes());
  });
  if (MONTH_NOTE) { const el = document.getElementById('monthNote'); if (el) el.value = MONTH_NOTE; }
  renderApprovalState();
  // Re-render Lucide icons for dynamically generated content
  if (typeof lucide !== 'undefined') { try { lucide.createIcons(); } catch {} }
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
      `${Auth.user?.name || 'Usuário'} acessou o portal.`,
      Auth.user?.name || 'Usuário'
    );
  } catch {}
}

/* ─── BOOT ─── */
(function boot() {
  try {
    const saved = localStorage.getItem('ip3_dark');
    if (saved === 'true') {
      document.documentElement.dataset.theme = 'dark';
    } else if (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.dataset.theme = 'dark';
    }
    document.documentElement.setAttribute('data-theme-set', '');
  } catch {}
  // Initialize Lucide icons on page load (landing + auth)
  if (typeof lucide !== 'undefined') { try { lucide.createIcons(); } catch {} }
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
