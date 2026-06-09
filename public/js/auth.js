/* ─── AUTH (server-side via Supabase RPC) ─── */
const Auth = {
  user: null,
  _attempts: 0,
  _lockUntil: 0,
  MAX_ATTEMPTS: 5,
  LOCKOUT_MS: 30000,

  checkSession() {
    try {
      const saved = sessionStorage.getItem('ip_session');
      if (saved) {
        const data = JSON.parse(saved);
        if (data && data.user) { Auth.user = data; return true; }
      }
    } catch {}
    return false;
  },

  isLocked() {
    if (Date.now() < Auth._lockUntil) return true;
    if (Auth._lockUntil > 0 && Date.now() >= Auth._lockUntil) {
      Auth._attempts = 0;
      Auth._lockUntil = 0;
    }
    return false;
  },

  getRemainingLock() {
    if (!Auth.isLocked()) return 0;
    return Math.ceil((Auth._lockUntil - Date.now()) / 1000);
  },

  async login(user, pass) {
    if (Auth.isLocked()) {
      const secs = Auth.getRemainingLock();
      return { ok: false, error: `Muitas tentativas. Aguarde ${secs}s.`, locked: true };
    }

    try {
      const { data, error } = await getDb().rpc('verify_login', {
        p_username: (user || '').toLowerCase().trim(),
        p_password: pass || ''
      });

      if (error) throw error;

      if (!data || data.length === 0) {
        return Auth._handleFailedAttempt();
      }

      const match = data[0];
      Auth._attempts = 0;
      Auth._lockUntil = 0;
      Auth.user = {
        user: match.username,
        role: match.role,
        name: match.display_name,
        desc: match.description,
        avatar: match.avatar
      };
      try { sessionStorage.setItem('ip_session', JSON.stringify(Auth.user)); } catch {}
      return { ok: true };
    } catch (e) {
      console.error('Erro de autenticação:', e);
      return { ok: false, error: 'Erro de conexão com o servidor. Tente novamente.' };
    }
  },

  _handleFailedAttempt() {
    Auth._attempts++;
    if (Auth._attempts >= Auth.MAX_ATTEMPTS) {
      Auth._lockUntil = Date.now() + Auth.LOCKOUT_MS;
      return { ok: false, error: `Bloqueado por ${Auth.LOCKOUT_MS / 1000}s. Muitas tentativas.`, locked: true };
    }
    const remaining = Auth.MAX_ATTEMPTS - Auth._attempts;
    return { ok: false, error: `Login ou senha incorretos. ${remaining} tentativa${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}.` };
  },

  logout() {
    Auth.user = null;
    try { sessionStorage.removeItem('ip_session'); } catch {}
    location.reload();
  },

  isAdmin() {
    return Auth.user?.role === 'admin';
  },

  applyRole() {
    const u = Auth.user;
    if (!u) return;
    const avatar = document.getElementById('sbContactAvatar');
    const name = document.getElementById('sbContactName');
    const roleEl = document.getElementById('sbContactRole');
    if (avatar) avatar.textContent = u.avatar;
    if (name) name.textContent = u.name;
    if (roleEl) roleEl.textContent = u.desc;
    if (u.role === 'admin') document.body.classList.add('admin-mode');
    else document.body.classList.remove('admin-mode');
  }
};
