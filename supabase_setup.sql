-- ============================================================
-- SETUP DO BANCO DE DADOS — ITS POWER HUB × SRCHZ TECHNOLOGIES
-- Execute este SQL no painel do Supabase: SQL Editor → New query
-- ============================================================

-- 1. Tabela principal: dados de cada post
create table if not exists post_data (
  post_id   text primary key,
  status    text    not null default 'pendente',
  stars     integer not null default 0,
  feedback  text    not null default '',
  note      text    not null default '',
  updated_at timestamptz default now()
);

-- 2. Configurações gerais do projeto (nota mensal, aprovações, etc.)
create table if not exists project_settings (
  key   text primary key,
  value text not null default ''
);

-- 3. Pedidos / action items (editáveis pelo contratado)
create table if not exists requests (
  id          uuid default gen_random_uuid() primary key,
  title       text not null,
  description text not null default '',
  due_date    text not null default '',
  status      text not null default 'pendente', -- pendente | done | novo
  source      text not null default 'admin',    -- admin | client
  priority    text not null default 'normal',   -- normal | urgente | critico
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- 4. Feed de atividade
create table if not exists activity (
  id         uuid default gen_random_uuid() primary key,
  message    text not null,
  bold_part  text not null default '',
  created_at timestamptz default now()
);

-- ── Habilitar real-time em todas as tabelas ──
alter table post_data replica identity full;
alter table project_settings replica identity full;
alter table requests replica identity full;
alter table activity replica identity full;

-- ── Row Level Security (acesso público por enquanto — protegido pela chave anon) ──
alter table post_data       enable row level security;
alter table project_settings enable row level security;
alter table requests        enable row level security;
alter table activity        enable row level security;

create policy "Public read/write post_data"        on post_data        for all using (true) with check (true);
create policy "Public read/write project_settings" on project_settings for all using (true) with check (true);
create policy "Public read/write requests"         on requests         for all using (true) with check (true);
create policy "Public read/write activity"         on activity         for all using (true) with check (true);

-- ── Seed: posts de junho (12 posts) ──
insert into post_data (post_id) values
  ('jun01'),('jun02'),('jun03'),('jun04'),('jun05'),('jun06'),
  ('jun07'),('jun08'),('jun09'),('jun10'),('jun11'),('jun12')
on conflict (post_id) do nothing;

-- ── Seed: posts de julho (12 posts) ──
insert into post_data (post_id) values
  ('jul01'),('jul02'),('jul03'),('jul04'),('jul05'),('jul06'),
  ('jul07'),('jul08'),('jul09'),('jul10'),('jul11'),('jul12')
on conflict (post_id) do nothing;

-- ── Seed: configurações iniciais ──
insert into project_settings (key, value) values
  ('month_note', ''),
  ('approved_essencial', 'false'),
  ('approved_growth', 'false')
on conflict (key) do nothing;

-- ── Seed: pedidos iniciais ──
insert into requests (title, description, due_date, status) values
  ('Autorizar uso de imagem dos alunos','Para posts de depoimento e aluno em destaque, precisamos de autorização formal dos alunos filmados.','Antes de 10 de junho','pendente'),
  ('Acesso ao Instagram da academia','Necessário para publicação e monitoramento de métricas.','Aguardando','pendente'),
  ('Confirmar dias de captação de junho','Agendar os dias da semana para presença na academia e gravação de conteúdo.','Prioridade alta','pendente'),
  ('Avaliar os conteúdos planejados','Use a seção de feedback para comentar sobre cada post antes da produção.','A qualquer momento','novo')
on conflict do nothing;

-- 5. Notificações bidirecionais admin ↔ cliente
create table if not exists notifications (
  id          uuid default gen_random_uuid() primary key,
  target_role text not null default 'admin',       -- admin | client
  type        text not null default 'activity',    -- request | feedback | status_change | activity | approval | note
  title       text not null,
  message     text not null default '',
  read        boolean not null default false,
  created_at  timestamptz default now()
);

alter table notifications replica identity full;
alter table notifications enable row level security;
create policy "Public read/write notifications" on notifications for all using (true) with check (true);

-- 6. Consentimento LGPD
create table if not exists lgpd_consent (
  id          uuid default gen_random_uuid() primary key,
  user_id     text unique not null,
  accepted    boolean not null default false,
  accepted_at timestamptz,
  ip_address  text,
  user_agent  text,
  created_at  timestamptz default now()
);

alter table lgpd_consent replica identity full;
alter table lgpd_consent enable row level security;
create policy "Public read/write lgpd_consent" on lgpd_consent for all using (true) with check (true);

-- ── Seed: atividade inicial ──
insert into activity (message, bold_part, created_at) values
  ('Hub integrado ao Supabase — dados agora em tempo real no servidor.','Hub integrado ao Supabase',now()),
  ('Plano Essencial (R$ 2.800/mês) disponível para aprovação.','Plano Essencial',now() - interval '5 minutes'),
  ('10 roteiros de junho planejados com 3 pilares estratégicos.','10 roteiros de junho',now() - interval '1 hour'),
  ('Início do projeto confirmado em 08 de junho de 2026.','Início do projeto',now() - interval '2 hours')
on conflict do nothing;

-- ============================================================
-- 7. AUTENTICAÇÃO SEGURA — Tabela de usuários + RPC de login
-- ============================================================

-- Habilitar pgcrypto para bcrypt
create extension if not exists pgcrypto;

-- Tabela de usuários do portal (credenciais NUNCA expostas ao client)
create table if not exists portal_users (
  id            uuid default gen_random_uuid() primary key,
  username      text unique not null,
  password_hash text not null,
  role          text not null check (role in ('admin', 'client')),
  display_name  text not null,
  description   text not null default '',
  avatar        text not null default '',
  created_at    timestamptz default now()
);

-- RLS: nenhuma policy = acesso direto bloqueado para anon/authenticated
alter table portal_users enable row level security;

-- Inserir usuários padrão (ALTERE AS SENHAS antes de rodar em produção!)
insert into portal_users (username, password_hash, role, display_name, description, avatar) values
  ('admin',   crypt('Admin@ITP2026', gen_salt('bf')), 'admin',  'Rafael Cordeiro', 'SrChZ Technologies', 'R'),
  ('cliente', crypt('Cliente@ITP2026', gen_salt('bf')), 'client', 'ITS Power', 'Cliente — Academia ITS Power', 'I')
on conflict (username) do nothing;

-- Função RPC para verificação de login (SECURITY DEFINER = roda com permissão do owner)
create or replace function verify_login(p_username text, p_password text)
returns table(username text, role text, display_name text, description text, avatar text)
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  return query
  select pu.username, pu.role, pu.display_name, pu.description, pu.avatar
  from portal_users pu
  where pu.username = lower(p_username)
    and pu.password_hash = crypt(p_password, pu.password_hash);
end;
$$;

-- Revogar acesso direto à tabela para o role anon
revoke all on portal_users from anon;
-- Permitir apenas execução da RPC
grant execute on function verify_login(text, text) to anon;

-- ============================================================
-- PRONTO! Configure as variáveis de ambiente no arquivo .env:
--   SUPABASE_URL=https://xxxx.supabase.co
--   SUPABASE_ANON_KEY=eyJ...
--   SUPABASE_SERVICE_KEY=eyJ...
--   JWT_SECRET=sua_chave_secreta
-- E inicie o servidor: npm run dev
-- ============================================================
