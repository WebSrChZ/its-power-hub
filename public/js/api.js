/* ─── SUPABASE CONFIG ─── */
const SUPABASE_URL = 'https://aqbwwiarinvmgqfaqvnr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxYnd3aWFyaW52bWdxZmFxdm5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2ODczODUsImV4cCI6MjA5NjI2MzM4NX0.BNDsWX5xquhndVKeG7O6aJZs5vWYSH8clKbfe6wNuPg';

let _sb = null;
function getDb() {
  if (!_sb) _sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  return _sb;
}

const API = {
  // Posts
  async getPosts() {
    const { data, error } = await getDb().from('post_data').select('*');
    if (error) throw error;
    return data || [];
  },
  async updatePost(id, d) {
    await getDb().from('post_data').upsert({
      post_id: id, status: d.status||'pendente', stars: d.stars||0,
      feedback: d.fb||'', note: d.note||'', roteiro_status: d.roteiroStatus||null,
      roteiro_notes: d.roteiroNotes||null, roteiro_checks: d.roteiroChecks||null,
      updated_at: new Date().toISOString()
    }, { onConflict: 'post_id' });
  },

  // Settings
  async getSettings() {
    const { data, error } = await getDb().from('project_settings').select('*');
    if (error) throw error;
    return data || [];
  },
  async updateSetting(key, value) {
    await getDb().from('project_settings').upsert({ key, value: value||'' }, { onConflict: 'key' });
  },

  // Requests
  async getRequests() {
    const { data, error } = await getDb().from('requests').select('*').order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },
  async createRequest(d) {
    if (!d.title) return;
    await getDb().from('requests').insert({
      title: d.title, description: d.description||'', due_date: d.due_date||'',
      status: d.source==='client'?'novo':'pendente', source: d.source||'admin', priority: d.priority||'normal'
    });
  },
  async updateRequest(id, d) {
    await getDb().from('requests').update({ status: d.status, updated_at: new Date().toISOString() }).eq('id', id);
  },
  // Apagar e operacao de admin: vai por RPC, que revalida o token no servidor.
  // `anon` nao tem mais permissao de DELETE na tabela (ver supabase_hardening_001.sql).
  async deleteRequest(id) {
    const { error } = await getDb().rpc('admin_delete_request', { p_token: Auth.token(), p_id: id });
    if (error) throw error;
  },

  // Activity
  async getActivity() {
    const { data, error } = await getDb().from('activity').select('*').order('created_at', { ascending: false }).limit(20);
    if (error) throw error;
    return data || [];
  },
  async addActivity(message, bold_part) {
    await getDb().from('activity').insert({ message, bold_part: bold_part||'' });
  },
  async deleteActivity(id) {
    const { error } = await getDb().rpc('admin_delete_activity', { p_token: Auth.token(), p_id: id });
    if (error) throw error;
  },

  // LGPD — a tabela guarda dado pessoal e nao e mais acessivel direto pelo
  // front-end. Vai por RPC: cada chamada toca apenas a linha do proprio usuario
  // e a leitura devolve so o booleano (nao expoe ip/user_agent de ninguem).
  async lgpdStatus(userId) {
    const { data, error } = await getDb().rpc('lgpd_status', { p_user_id: userId });
    if (error) throw error;
    return { accepted: !!data };
  },
  async lgpdAccept(userId) {
    const { error } = await getDb().rpc('lgpd_accept', {
      p_user_id: userId,
      p_user_agent: navigator.userAgent
    });
    if (error) throw error;
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
    await getDb().from('notifications').update({ read: true }).eq('id', id);
  },
  async markAllRead(role) {
    await getDb().from('notifications').update({ read: true }).eq('target_role', role).eq('read', false);
  },
  async notify(targetRole, type, title, message) {
    await getDb().from('notifications').insert({ target_role: targetRole, type, title, message: message||'' });
  },

  // Realtime subscription
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

  // Instagram Metrics
  async getIgAccount() {
    const { data } = await getDb().from('instagram_account').select('*').order('date', { ascending: false }).limit(2);
    return data || [];
  },
  async upsertIgAccount(row) {
    await getDb().from('instagram_account').upsert(row, { onConflict: 'date' });
  },
  async getIgPosts() {
    const { data } = await getDb().from('instagram_posts').select('*');
    return data || [];
  },
  async upsertIgPost(row) {
    await getDb().from('instagram_posts').upsert(row, { onConflict: 'post_id' });
  }
};
