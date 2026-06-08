const Auth = {
  user: null,
  _attempts: 0,
  _lockUntil: 0,

  USERS: [
    { user:'admin', hash:'2c95e980cd79b37090bb090659c0ad3c2d86ffadc0b199721f04301247cbf9c6',
      role:'admin', name:'Rafael Cordeiro', desc:'SrChZ Technologies', avatar:'R' },
    { user:'cliente', hash:'73c39c68917057647700d16410570ba4a467c885f6e97718685294274f5284df',
      role:'client', name:'ITS Power', desc:'Cliente - Academia ITS Power', avatar:'I' }
  ],

  MAX_ATTEMPTS: 5,
  LOCKOUT_MS: 30000,

  async _sha256(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
  },

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

    const h = await Auth._sha256(pass);
    const match = Auth.USERS.find(u => u.user === user?.toLowerCase?.() && u.hash === h);

    if (!match) {
      Auth._attempts++;
      if (Auth._attempts >= Auth.MAX_ATTEMPTS) {
        Auth._lockUntil = Date.now() + Auth.LOCKOUT_MS;
        return { ok: false, error: `Bloqueado por ${Auth.LOCKOUT_MS/1000}s. Muitas tentativas.`, locked: true };
      }
      const remaining = Auth.MAX_ATTEMPTS - Auth._attempts;
      return { ok: false, error: `Login ou senha incorretos. ${remaining} tentativa${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}.` };
    }

    Auth._attempts = 0;
    Auth._lockUntil = 0;
    Auth.user = { user: match.user, role: match.role, name: match.name, desc: match.desc, avatar: match.avatar };
    try { sessionStorage.setItem('ip_session', JSON.stringify(Auth.user)); } catch {}
    return { ok: true };
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
