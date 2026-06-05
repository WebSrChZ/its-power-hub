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
  created_at  timestamptz default now()
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

-- ── Seed: posts de junho (10 posts pré-criados) ──
insert into post_data (post_id) values
  ('jun01'),('jun02'),('jun03'),('jun04'),('jun05'),
  ('jun06'),('jun07'),('jun08'),('jun09'),('jun10')
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

-- ── Seed: atividade inicial ──
insert into activity (message, bold_part, created_at) values
  ('Hub integrado ao Supabase — dados agora em tempo real no servidor.','Hub integrado ao Supabase',now()),
  ('Plano Essencial (R$ 2.800/mês) disponível para aprovação.','Plano Essencial',now() - interval '5 minutes'),
  ('10 roteiros de junho planejados com 3 pilares estratégicos.','10 roteiros de junho',now() - interval '1 hour'),
  ('Início do projeto confirmado em 08 de junho de 2026.','Início do projeto',now() - interval '2 hours')
on conflict do nothing;

-- ============================================================
-- PRONTO! Agora copie a Project URL e a anon key em:
-- Supabase Dashboard → Settings → API
-- E cole no arquivo its_power_hub.html nas variáveis:
--   const SUPABASE_URL  = 'https://xxxx.supabase.co'
--   const SUPABASE_KEY  = 'eyJ...'
-- ============================================================
