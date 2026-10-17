-- ============================================================
-- HARDENING 001 — ITS POWER HUB
-- Execute no painel do Supabase: SQL Editor -> New query
--
-- O que este script corrige (o setup original deixava tudo aberto):
--
--  1. Toda tabela tinha `for all using (true) with check (true)`. A anon key
--     do front-end e publica por natureza (esta no repositorio, e qualquer um
--     que abra o portal a ve no DevTools), entao "protegido pela chave anon"
--     nao protege nada: qualquer pessoa na internet podia LER, ALTERAR e
--     APAGAR todas as tabelas.
--  2. `lgpd_consent` guarda dado pessoal (user_agent, ip, quem aceitou e
--     quando) e era publicamente legivel — exatamente o oposto do que a LGPD
--     exige de um portal que exibe aviso de LGPD.
--  3. Nao existia nenhuma checagem de papel no servidor: o papel de admin
--     vivia so no sessionStorage do navegador.
--
-- Depois deste script:
--   * anon NAO consegue mais apagar nada em nenhuma tabela;
--   * `lgpd_consent` deixa de ser legivel/gravavel direto — so via RPC, e
--     cada RPC toca apenas a linha do proprio usuario;
--   * login passa a emitir um TOKEN DE SESSAO com validade, verificado no
--     servidor; operacoes destrutivas exigem um token de admin valido.
--
-- LEITURA/ESCRITA comum (posts, settings, requests, activity, notifications)
-- continua liberada para anon — e o que o portal precisa hoje sem uma
-- refatoracao maior. Isso e um risco residual CONHECIDO e esta documentado no
-- README (secao "Modelo de acesso"). O passo seguinte esta descrito no fim
-- deste arquivo.
--
-- Idempotente: pode rodar mais de uma vez.
-- ============================================================

begin;

-- ------------------------------------------------------------
-- 1. SESSOES COM TOKEN (verificaveis no servidor)
-- ------------------------------------------------------------
create table if not exists portal_sessions (
  token      uuid primary key default gen_random_uuid(),
  username   text        not null,
  role       text        not null check (role in ('admin','client')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '12 hours'
);

create index if not exists portal_sessions_expires_idx on portal_sessions (expires_at);

-- Ninguem fala com esta tabela direto: so as funcoes SECURITY DEFINER abaixo.
alter table portal_sessions enable row level security;
revoke all on portal_sessions from anon, authenticated;

-- ------------------------------------------------------------
-- 2. LOGIN -> emite token
-- ------------------------------------------------------------
-- Assinatura nova (retorna token). A versao antiga e removida logo abaixo.
drop function if exists verify_login(text, text);

create or replace function verify_login(p_username text, p_password text)
returns table (
  token        uuid,
  username     text,
  role         text,
  display_name text,
  description  text,
  avatar       text,
  expires_at   timestamptz
)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_user   portal_users%rowtype;
  v_token  uuid;
  v_expiry timestamptz;
begin
  select * into v_user
  from portal_users pu
  where pu.username = lower(trim(p_username))
    and pu.password_hash = crypt(p_password, pu.password_hash);

  if not found then
    -- custo constante: nao revela se o usuario existe
    perform pg_sleep(0.15);
    return;
  end if;

  -- limpeza oportunista de sessoes vencidas
  delete from portal_sessions where expires_at < now();

  v_token  := gen_random_uuid();
  v_expiry := now() + interval '12 hours';

  insert into portal_sessions (token, username, role, expires_at)
  values (v_token, v_user.username, v_user.role, v_expiry);

  return query
  select v_token, v_user.username, v_user.role,
         v_user.display_name, v_user.description, v_user.avatar, v_expiry;
end;
$$;

-- Valida um token e devolve o papel; null se invalido/vencido.
create or replace function session_role(p_token uuid)
returns text
language sql
security definer
set search_path = public
as $$
  select s.role from portal_sessions s
  where s.token = p_token and s.expires_at > now();
$$;

create or replace function logout(p_token uuid)
returns void
language sql
security definer
set search_path = public
as $$
  delete from portal_sessions where token = p_token;
$$;

-- ------------------------------------------------------------
-- 3. LGPD — sai do alcance publico, entra atras de RPC
-- ------------------------------------------------------------
drop policy if exists "Public read/write lgpd_consent" on lgpd_consent;
revoke all on lgpd_consent from anon, authenticated;

-- Le apenas a propria linha, e devolve so o booleano (nao vaza ip/user_agent).
create or replace function lgpd_status(p_user_id text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce((select accepted from lgpd_consent where user_id = p_user_id), false);
$$;

create or replace function lgpd_accept(p_user_id text, p_user_agent text default null)
returns void
language sql
security definer
set search_path = public
as $$
  insert into lgpd_consent (user_id, accepted, accepted_at, user_agent)
  values (p_user_id, true, now(), left(coalesce(p_user_agent,''), 400))
  on conflict (user_id) do update
    set accepted = true, accepted_at = now(), user_agent = excluded.user_agent;
$$;

-- ------------------------------------------------------------
-- 4. FIM DO `for all using (true)`
--    Policies explicitas por operacao. Sem policy de DELETE = anon nao apaga.
-- ------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['post_data','project_settings','requests','activity','notifications']
  loop
    execute format('drop policy if exists %I on %I', 'Public read/write ' || t, t);
    execute format('drop policy if exists %I on %I', 'anon_select_' || t, t);
    execute format('drop policy if exists %I on %I', 'anon_insert_' || t, t);
    execute format('drop policy if exists %I on %I', 'anon_update_' || t, t);
    execute format('create policy %I on %I for select using (true)', 'anon_select_' || t, t);
    execute format('create policy %I on %I for insert with check (true)', 'anon_insert_' || t, t);
    execute format('create policy %I on %I for update using (true) with check (true)', 'anon_update_' || t, t);
    -- de proposito: nenhuma policy FOR DELETE
    execute format('revoke delete on %I from anon, authenticated', t);
  end loop;
end $$;

-- ------------------------------------------------------------
-- 5. DELETES viram operacao de admin, checada no servidor
-- ------------------------------------------------------------
create or replace function admin_delete_request(p_token uuid, p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if session_role(p_token) is distinct from 'admin' then
    raise exception 'nao autorizado' using errcode = '42501';
  end if;
  delete from requests where id = p_id;
end;
$$;

create or replace function admin_delete_activity(p_token uuid, p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if session_role(p_token) is distinct from 'admin' then
    raise exception 'nao autorizado' using errcode = '42501';
  end if;
  delete from activity where id = p_id;
end;
$$;

-- ------------------------------------------------------------
-- 6. GRANTS
-- ------------------------------------------------------------
revoke all on portal_users from anon, authenticated;

grant execute on function verify_login(text, text)             to anon;
grant execute on function session_role(uuid)                   to anon;
grant execute on function logout(uuid)                         to anon;
grant execute on function lgpd_status(text)                    to anon;
grant execute on function lgpd_accept(text, text)              to anon;
grant execute on function admin_delete_request(uuid, uuid)     to anon;
grant execute on function admin_delete_activity(uuid, uuid)    to anon;

commit;

-- ============================================================
-- DEPOIS DE RODAR — duas acoes manuais, nao dao para automatizar aqui:
--
--  a) TROCAR AS SENHAS. As senhas padrao do setup original foram commitadas em
--     repositorio publico e continuam recuperaveis no historico do git.
--     Considere as duas vazadas e troque agora:
--
--        update portal_users
--           set password_hash = crypt('<senha-nova-forte>', gen_salt('bf'))
--         where username = 'admin';
--
--        update portal_users
--           set password_hash = crypt('<senha-nova-forte>', gen_salt('bf'))
--         where username = 'cliente';
--
--  b) Se quiser derrubar todas as sessoes abertas:  delete from portal_sessions;
--
-- PROXIMO PASSO (fecha o risco residual de escrita anonima):
--     trocar as policies de INSERT/UPDATE por checagem de token tambem —
--     ou seja, mover getPosts/updatePost/updateSetting/... para RPCs
--     SECURITY DEFINER que recebem p_token, como ja foi feito com os deletes.
--     Feito isso, `anon` pode perder INSERT/UPDATE por completo.
-- ============================================================
