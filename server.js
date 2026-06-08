require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

const db = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const USERS = [
  {
    user: 'admin',
    hash: bcrypt.hashSync('srchz2026', 10),
    role: 'admin',
    name: 'Rafael Cordeiro',
    desc: 'SrChZ Technologies',
    avatar: 'R'
  },
  {
    user: 'cliente',
    hash: bcrypt.hashSync('ITS2026!', 10),
    role: 'client',
    name: 'ITS Power',
    desc: 'Cliente - Academia ITS Power',
    avatar: 'I'
  }
];

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function authMiddleware(req, res, next) {
  const token = req.cookies.ip_token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Nao autenticado' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Token invalido' });
  }
}

function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso negado' });
  next();
}

// ─── AUTH ───

app.post('/api/auth/login', (req, res) => {
  const { user, pass } = req.body;
  const match = USERS.find(u => u.user === user?.toLowerCase?.());
  if (!match || !bcrypt.compareSync(pass || '', match.hash)) {
    return res.status(401).json({ error: 'Login ou senha incorretos' });
  }
  const payload = { user: match.user, role: match.role, name: match.name, desc: match.desc, avatar: match.avatar };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  res.cookie('ip_token', token, { httpOnly: true, sameSite: 'lax', maxAge: 86400000 });
  res.json({ ok: true, ...payload });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('ip_token');
  res.json({ ok: true });
});

app.get('/api/auth/session', authMiddleware, (req, res) => {
  res.json(req.user);
});

// ─── LGPD CONSENT ───

app.post('/api/lgpd/accept', authMiddleware, async (req, res) => {
  const { error } = await db.from('lgpd_consent').upsert({
    user_id: req.user.user,
    accepted: true,
    accepted_at: new Date().toISOString(),
    ip_address: req.ip,
    user_agent: req.headers['user-agent'] || ''
  }, { onConflict: 'user_id' });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

app.get('/api/lgpd/status', authMiddleware, async (req, res) => {
  const { data } = await db.from('lgpd_consent').select('accepted').eq('user_id', req.user.user).single();
  res.json({ accepted: !!data?.accepted });
});

// ─── POSTS ───

app.get('/api/posts', authMiddleware, async (req, res) => {
  const { data, error } = await db.from('post_data').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

app.put('/api/posts/:id', authMiddleware, async (req, res) => {
  const { status, stars, feedback, note } = req.body;
  const { error } = await db.from('post_data').upsert({
    post_id: req.params.id,
    status: status || 'pendente',
    stars: stars || 0,
    feedback: feedback || '',
    note: note || '',
    updated_at: new Date().toISOString()
  }, { onConflict: 'post_id' });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ─── SETTINGS ───

app.get('/api/settings', authMiddleware, async (req, res) => {
  const { data, error } = await db.from('project_settings').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

app.put('/api/settings/:key', authMiddleware, async (req, res) => {
  const { value } = req.body;
  const { error } = await db.from('project_settings').upsert(
    { key: req.params.key, value: value || '' },
    { onConflict: 'key' }
  );
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ─── REQUESTS ───

app.get('/api/requests', authMiddleware, async (req, res) => {
  const { data, error } = await db.from('requests').select('*').order('created_at', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

app.post('/api/requests', authMiddleware, async (req, res) => {
  const { title, description, due_date, priority, source } = req.body;
  if (!title) return res.status(400).json({ error: 'Titulo obrigatorio' });
  const finalSource = req.user.role === 'admin' ? (source || 'admin') : 'client';
  const { error } = await db.from('requests').insert({
    title,
    description: description || '',
    due_date: due_date || 'Quando possivel',
    status: finalSource === 'client' ? 'novo' : 'pendente',
    source: finalSource,
    priority: priority || 'normal'
  });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

app.put('/api/requests/:id', authMiddleware, adminOnly, async (req, res) => {
  const { status } = req.body;
  const { error } = await db.from('requests').update({
    status,
    updated_at: new Date().toISOString()
  }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

app.delete('/api/requests/:id', authMiddleware, adminOnly, async (req, res) => {
  const { error } = await db.from('requests').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ─── ACTIVITY ───

app.get('/api/activity', authMiddleware, async (req, res) => {
  const { data, error } = await db.from('activity').select('*').order('created_at', { ascending: false }).limit(10);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

app.post('/api/activity', authMiddleware, async (req, res) => {
  const { message, bold_part } = req.body;
  if (!message) return res.status(400).json({ error: 'Mensagem obrigatoria' });
  const { error } = await db.from('activity').insert({
    message,
    bold_part: bold_part || ''
  });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ─── SPA FALLBACK ───

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`ITS Power Hub rodando em http://localhost:${PORT}`);
});
