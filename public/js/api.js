/* ─── SUPABASE CONFIG ─── */
const SUPABASE_URL = 'https://aqbwwiarinvmgqfaqvnr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxYnd3aWFyaW52bWdxZmFxdm5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2ODczODUsImV4cCI6MjA5NjI2MzM4NX0.BNDsWX5xquhndVKeG7O6aJZs5vWYSH8clKbfe6wNuPg';

let _sb = null;
function getDb() {
  if (!_sb) _sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  return _sb;
}

/* ─── ESCRITA ───
   Toda escrita vai por RPC com o token de sessao. A anon key acima e publica
   (esta no repositorio e no DevTools de quem abre o portal), entao ela nao
   autoriza nada: quem autoriza e o token que `verify_login` emite, revalidado
   no Postgres a cada chamada.

   `wr()` concentra o tratamento de erro porque a falha agora tem um caso novo
   e esperado: sessao de 12 h vencida no meio do uso. Antes, essas escritas
   engoliam o erro em silencio e a edicao do usuario desaparecia sem aviso. */
async function wr(fn, args) {
  const token = (typeof Auth !== 'undefined' && Auth.token) ? Auth.token() : null;
  if (!token) {
    const e = new Error('Sessão expirada. Entre novamente.');
    if (typeof showToast === 'function') showToast(e.message);
    throw e;
  }
  const { data, error } = await getDb().rpc(fn, { p_token: token, ...args });
  if (error) {
    // 42501 = o portao do banco recusou: token vencido, invalido, ou falta de
    // papel de admin. Qualquer outra coisa e erro de rede ou bug.
    const expirou = error.code === '42501' || /sessao invalida|expirada/i.test(error.message || '');
    const msg = expirou
      ? 'Sessão expirada ou sem permissão. Entre novamente.'
      : 'Não consegui salvar agora. Tente de novo.';
    if (typeof showToast === 'function') showToast(msg);
    console.error('[api] ' + fn, error);
    throw error;
  }
  return data;
}

/* Escrita secundaria: feed de atividade, notificacoes e marcar-como-lida.
   Essas acontecem como efeito colateral de outra operacao que o usuario de
   fato pediu. Se lancassem, abortariam o fluxo principal — `approvePhase`
   pararia antes de notificar, `markNotifRead` nao atualizaria o badge, e o
   `API.notify` solto em `saveNote` viraria unhandled rejection. Reportam e
   seguem: a operacao principal da mesma acao ja avisa o usuario se a sessao
   caiu. */
async function wrSoft(fn, args) {
  try {
    return await wr(fn, args);
  } catch (e) {
    console.warn('[api] ' + fn + ' falhou (efeito colateral, fluxo segue)', e);
    return null;
  }
}

const API = {
  // Posts
  async getPosts() {
    const { data, error } = await getDb().from('post_data').select('*');
    if (error) throw error;
    return data || [];
  },
  async updatePost(id, d) {
    return wr('post_save', {
      p_post_id: id,
      p_status: d.status || 'pendente',
      p_stars: d.stars || 0,
      p_feedback: d.fb || '',
      p_note: d.note || '',
      p_roteiro_status: d.roteiroStatus || null,
      p_roteiro_notes: d.roteiroNotes || null,
      p_roteiro_checks: d.roteiroChecks || null
    });
  },

  // Settings
  async getSettings() {
    const { data, error } = await getDb().from('project_settings').select('*');
    if (error) throw error;
    return data || [];
  },
  async updateSetting(key, value) {
    return wr('setting_set', { p_key: key, p_value: value || '' });
  },

  // Requests
  async getRequests() {
    const { data, error } = await getDb().from('requests').select('*').order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },
  async createRequest(d) {
    if (!d.title) return;
    return wr('req_create', {
      p_title: d.title,
      p_description: d.description || '',
      p_due_date: d.due_date || '',
      p_status: d.source === 'client' ? 'novo' : 'pendente',
      p_source: d.source || 'admin',
      p_priority: d.priority || 'normal'
    });
  },
  async updateRequest(id, d) {
    return wr('req_set_status', { p_id: id, p_status: d.status });
  },
  // Apagar e operacao de admin: a RPC checa o papel no servidor, nao basta
  // ter sessao valida.
  async deleteRequest(id) {
    return wr('admin_delete_request', { p_id: id });
  },

  // Activity
  async getActivity() {
    const { data, error } = await getDb().from('activity').select('*').order('created_at', { ascending: false }).limit(20);
    if (error) throw error;
    return data || [];
  },
  async addActivity(message, bold_part) {
    return wrSoft('activity_add', { p_message: message, p_bold_part: bold_part || '' });
  },
  async deleteActivity(id) {
    return wr('admin_delete_activity', { p_id: id });
  },

  // LGPD — a tabela guarda dado pessoal e nao e acessivel direto pelo
  // front-end. O aceite so pode ser gravado para o usuario da propria sessao,
  // checado no banco.
  async lgpdStatus(userId) {
    const data = await wr('lgpd_status', { p_user_id: userId });
    return { accepted: !!data };
  },
  async lgpdAccept(userId) {
    return wr('lgpd_accept', { p_user_id: userId, p_user_agent: navigator.userAgent });
  },

  // Notifications
  async getNotifications(role) {
    const { data } = await getDb().from('notifications').select('*')
      .eq('target_role', role).order('created_at', { ascending: false }).limit(30);
    return data || [];
  },
  async getUnreadCount(role) {
    const { count } = await getDb().from('notifications').select('*', { count: 'exact', head: true })
      .eq('target_role', role).eq('read', false);
    return count || 0;
  },
  async markRead(id) {
    return wrSoft('notif_mark_read', { p_id: id });
  },
  async markAllRead(role) {
    return wrSoft('notif_mark_all', { p_target_role: role });
  },
  async notify(targetRole, type, title, message) {
    return wrSoft('notif_create', {
      p_target_role: targetRole,
      p_type: type,
      p_title: title,
      p_message: message || ''
    });
  },

  // Realtime subscription
  // O Realtime entrega `postgres_changes` usando a permissao de SELECT, que
  // segue liberada de proposito — e o que sincroniza os dispositivos.
  subscribeNotifications(role, callback) {
    return getDb().channel('notif-' + role)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: 'target_role=eq.' + role }, payload => {
        callback(payload.new);
      }).subscribe();
  },

  subscribeChanges(table, callback) {
    return getDb().channel('changes-' + table)
      .on('postgres_changes', { event: '*', schema: 'public', table }, payload => {
        callback(payload);
      }).subscribe();
  },

  // Instagram Metrics — entrada de dado da agencia: as RPCs exigem admin.
  async getIgAccount() {
    const { data } = await getDb().from('instagram_account').select('*').order('date', { ascending: false }).limit(2);
    return data || [];
  },
  async upsertIgAccount(row) {
    return wr('ig_account_upsert', {
      p_date: row.date,
      p_followers: row.followers ?? 0,
      p_reach: row.reach ?? 0,
      p_impressions: row.impressions ?? 0,
      p_profile_visits: row.profile_visits ?? 0,
      p_link_clicks: row.link_clicks ?? 0,
      p_engagement_rate: row.engagement_rate ?? 0
    });
  },
  async getIgPosts() {
    const { data } = await getDb().from('instagram_posts').select('*');
    return data || [];
  },
  async upsertIgPost(row) {
    return wr('ig_posts_upsert', {
      p_post_id: row.post_id,
      p_ig_url: row.ig_url || '',
      p_views: row.views ?? 0,
      p_likes: row.likes ?? 0,
      p_comments: row.comments ?? 0,
      p_shares: row.shares ?? 0,
      p_saves: row.saves ?? 0,
      p_reach: row.reach ?? 0
    });
  }
};
