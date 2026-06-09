const Router = {
  history: [],
  current: 'dashboard',

  init() {
    window.addEventListener('popstate', (e) => {
      if (e.state?.tab) {
        Router.current = e.state.tab;
        Router._activate(e.state.tab, false);
      }
    });
    const hash = location.hash.replace('#', '');
    if (hash && document.getElementById('panel-' + hash)) {
      Router.navigate(hash, true);
    }
  },

  navigate(tab, replace = false) {
    if (tab === Router.current && !replace) return;
    const prev = Router.current;
    Router.current = tab;
    if (prev !== tab) Router.history.push(prev);
    Router._activate(tab, true);
    if (replace) {
      history.replaceState({ tab }, '', '#' + tab);
    } else {
      history.pushState({ tab }, '', '#' + tab);
    }
  },

  back() {
    if (Router.history.length > 0) {
      const prev = Router.history.pop();
      Router.current = prev;
      Router._activate(prev, true);
      history.pushState({ tab: prev }, '', '#' + prev);
    }
  },

  canGoBack() {
    return Router.history.length > 0;
  },

  _activate(tab, updateUI) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tb-tab, .nav-item').forEach(b => b.classList.remove('active'));
    const panel = document.getElementById('panel-' + tab);
    if (panel) panel.classList.add('active');
    document.querySelectorAll(`[data-tab="${tab}"]`).forEach(b => b.classList.add('active'));

    // Update breadcrumb
    const breadcrumb = document.getElementById('breadcrumb');
    const backBtn = document.getElementById('backBtn');
    if (breadcrumb) {
      const labels = {
        dashboard: 'Dashboard',
        calendario: 'Calendário',
        pilares: '3 Pilares',
        fases: 'Próximas Fases',
        resultados: 'Resultados',
        galeria: 'Galeria',
        contrato: 'Contrato & Docs'
      };
      breadcrumb.textContent = labels[tab] || tab;
    }
    if (backBtn) {
      backBtn.style.display = Router.canGoBack() ? 'inline-flex' : 'none';
    }
  }
};
