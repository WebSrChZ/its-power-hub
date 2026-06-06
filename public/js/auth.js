const Auth = {
  user: null,

  USERS: [
    { user:'admin', hash:'2c95e980cd79b37090bb090659c0ad3c2d86ffadc0b199721f04301247cbf9c6',
      role:'admin', name:'Rafael Cordeiro', desc:'SrChZ Technologies', avatar:'R' },
    { user:'cliente', hash:'73c39c68917057647700d16410570ba4a467c885f6e97718685294274f5284df',
      role:'client', name:'ITS Power', desc:'Cliente - Academia ITS Power', avatar:'I' }
  ],

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

  async login(user, pass) {
    const h = await Auth._sha256(pass);
    const match = Auth.USERS.find(u => u.user === user?.toLowerCase?.() && u.hash === h);
    if (!match) return { ok: false, error: 'Login ou senha incorretos' };
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
