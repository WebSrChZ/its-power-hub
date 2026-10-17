-- ============================================================
-- HARDENING 002a — ITS POWER HUB
-- Consolida as escritas no token de sessao. ADITIVO: nao remove
-- nenhuma permissao, entao pode rodar com o front-end atual no ar.
--
-- CONTEXTO
--
-- O banco tinha DUAS camadas de autorizacao de escrita, construidas em
-- momentos diferentes e sem saber uma da outra:
--
--   A) `phase1_rls_hardening_write_gateway` (migracao de 2026-06-30): 13 RPCs
--      com `p_token text`, validadas por `private.check_write_token`, que
--      compara o token contra uma linha em `private.portal_config`. Token
--      unico, compartilhado, sem expiracao.
--
--   B) `hardening_001` (2026-10-17): `verify_login` passou a emitir um token
--      uuid por login em `portal_sessions`, com validade de 12 h, e os deletes
--      passaram a exigir papel de admin verificado no servidor.
--
-- O front-end publicado usa (B) e ignora (A) por completo: nao ha uma unica
-- referencia a `write_token` nem as 13 RPCs em `public/js/`. Ou seja, (A) era
-- superficie exposta sem nenhum consumidor.
--
-- POR QUE (B) GANHA
--
-- O token de (A) teria que estar no JavaScript publico para o front-end
-- usa-lo — e um segredo que qualquer visitante le no DevTools, igual a anon
-- key. O token de (B) e por login, expira em 12 h e carrega papel, entao da
-- para distinguir admin de cliente. Nao e uma escolha de gosto: um e
-- verificavel, o outro e ofuscacao.
--
-- O QUE ESTE ARQUIVO FAZ
--
--   * cria `private.require_session` / `private.require_admin`;
--   * recria as 13 RPCs com `p_token uuid`, mesmo corpo, novo portao;
--   * remove as versoes `text` e as tres duplicatas que (B) ja cobria
--     (`req_delete`, `activity_delete`, `lgpd_set`);
--   * cria versoes com token de `lgpd_status` / `lgpd_accept`, que o 001 deixou
--     sem — era possivel gravar consentimento no nome de qualquer user_id. As
--     versoes antigas ficam como overload ate o deploy (ver secao 5);
--   * aposenta `private.check_write_token`.
--
-- Nao fecha a escrita anonima direta na tabela: isso e o 002b, que SO pode
-- rodar depois do deploy do front-end novo. Ordem no README.
--
-- ATENCAO: se existir algum script externo seu chamando as RPCs antigas com o
-- write_token (o candidato provavel e entrada de metricas de Instagram), ele
-- para de funcionar aqui. As tabelas `instagram_*` estao vazias hoje, entao
-- nenhum dado se perde — mas o script precisaria passar a logar.
--
-- Idempotente: pode rodar mais de uma vez.
-- ============================================================

begin;

-- ------------------------------------------------------------
-- 1. PORTOES
-- ------------------------------------------------------------
-- Qualquer sessao valida. Devolve o papel, para quem precisar ramificar.
create or replace function private.require_session(p_token uuid)
returns text
language plpgsql
security definer
set search_path to 'pg_catalog', 'pg_temp'
as $$
declare v_role text;
begin
  v_role := public.session_role(p_token);
  if v_role is null then
    raise exception 'sessao invalida ou expirada' using errcode = '42501';
  end if;
  return v_role;
end; $$;

create or replace function private.require_admin(p_token uuid)
returns void
language plpgsql
security definer
set search_path to 'pg_catalog', 'pg_temp'
as $$
begin
  if public.session_role(p_token) is distinct from 'admin' then
    raise exception 'nao autorizado' using errcode = '42501';
  end if;
end; $$;

-- ------------------------------------------------------------
-- 2. CONTEUDO — exigem sessao valida (admin ou cliente)
-- ------------------------------------------------------------
-- O cliente avalia (stars/feedback) e o admin muda status/nota: os dois
-- escrevem no mesmo post, entao o portao aqui e sessao, nao papel.
create or replace function public.post_save(
  p_token uuid, p_post_id text, p_status text, p_stars integer,
  p_feedback text, p_note text, p_roteiro_status text,
  p_roteiro_notes text, p_roteiro_checks text)
returns void
language plpgsql
security definer
set search_path to 'pg_catalog', 'pg_temp'
as $$
begin
  perform private.require_session(p_token);
  insert into public.post_data (post_id, status, stars, feedback, note, roteiro_status, roteiro_notes, roteiro_checks, updated_at)
  values (p_post_id, coalesce(p_status,'pendente'), coalesce(p_stars,0), coalesce(p_feedback,''), coalesce(p_note,''),
          p_roteiro_status, p_roteiro_notes, p_roteiro_checks, now())
  on conflict (post_id) do update set
    status = excluded.status, stars = excluded.stars, feedback = excluded.feedback, note = excluded.note,
    roteiro_status = excluded.roteiro_status, roteiro_notes = excluded.roteiro_notes,
    roteiro_checks = excluded.roteiro_checks, updated_at = now();
end; $$;

-- `approved_essencial` e `approved_growth` sao aprovacoes DO CLIENTE, e
-- `month_note` e do admin. Mesma tabela, dois papeis: sessao.
create or replace function public.setting_set(p_token uuid, p_key text, p_value text)
returns void
language plpgsql
security definer
set search_path to 'pg_catalog', 'pg_temp'
as $$
begin
  perform private.require_session(p_token);
  insert into public.project_settings(key, value) values (p_key, coalesce(p_value,''))
  on conflict (key) do update set value = excluded.value;
end; $$;

create or replace function public.req_create(
  p_token uuid, p_title text, p_description text, p_due_date text,
  p_status text, p_source text, p_priority text)
returns void
language plpgsql
security definer
set search_path to 'pg_catalog', 'pg_temp'
as $$
begin
  perform private.require_session(p_token);
  insert into public.requests(title, description, due_date, status, source, priority)
  values (p_title, coalesce(p_description,''), coalesce(p_due_date,''),
          coalesce(p_status, case when p_source = 'client' then 'novo' else 'pendente' end),
          coalesce(p_source,'admin'), coalesce(p_priority,'normal'));
end; $$;

create or replace function public.req_set_status(p_token uuid, p_id uuid, p_status text)
returns void
language plpgsql
security definer
set search_path to 'pg_catalog', 'pg_temp'
as $$
begin
  perform private.require_session(p_token);
  update public.requests set status = p_status, updated_at = now() where id = p_id;
end; $$;

create or replace function public.activity_add(p_token uuid, p_message text, p_bold_part text)
returns void
language plpgsql
security definer
set search_path to 'pg_catalog', 'pg_temp'
as $$
begin
  perform private.require_session(p_token);
  insert into public.activity(message, bold_part) values (p_message, coalesce(p_bold_part,''));
end; $$;

-- ------------------------------------------------------------
-- 3. NOTIFICACOES — os dois lados notificam um ao outro
-- ------------------------------------------------------------
create or replace function public.notif_create(
  p_token uuid, p_target_role text, p_type text, p_title text, p_message text)
returns void
language plpgsql
security definer
set search_path to 'pg_catalog', 'pg_temp'
as $$
begin
  perform private.require_session(p_token);
  insert into public.notifications(target_role, type, title, message)
  values (p_target_role, coalesce(p_type,'activity'), p_title, coalesce(p_message,''));
end; $$;

create or replace function public.notif_mark_read(p_token uuid, p_id uuid)
returns void
language plpgsql
security definer
set search_path to 'pg_catalog', 'pg_temp'
as $$
begin
  perform private.require_session(p_token);
  update public.notifications set read = true where id = p_id;
end; $$;

create or replace function public.notif_mark_all(p_token uuid, p_target_role text)
returns void
language plpgsql
security definer
set search_path to 'pg_catalog', 'pg_temp'
as $$
begin
  perform private.require_session(p_token);
  update public.notifications set read = true where target_role = p_target_role and read = false;
end; $$;

-- ------------------------------------------------------------
-- 4. METRICAS DE INSTAGRAM — entrada de dado da agencia: admin
-- ------------------------------------------------------------
create or replace function public.ig_account_upsert(
  p_token uuid, p_date date, p_followers integer, p_reach integer,
  p_impressions integer, p_profile_visits integer, p_link_clicks integer,
  p_engagement_rate numeric)
returns void
language plpgsql
security definer
set search_path to 'pg_catalog', 'pg_temp'
as $$
begin
  perform private.require_admin(p_token);
  insert into public.instagram_account(date, followers, reach, impressions, profile_visits, link_clicks, engagement_rate, updated_at)
  values (p_date, coalesce(p_followers,0), coalesce(p_reach,0), coalesce(p_impressions,0), coalesce(p_profile_visits,0), coalesce(p_link_clicks,0), coalesce(p_engagement_rate,0), now())
  on conflict (date) do update set followers=excluded.followers, reach=excluded.reach, impressions=excluded.impressions,
    profile_visits=excluded.profile_visits, link_clicks=excluded.link_clicks, engagement_rate=excluded.engagement_rate, updated_at=now();
end; $$;

create or replace function public.ig_posts_upsert(
  p_token uuid, p_post_id text, p_ig_url text, p_views integer,
  p_likes integer, p_comments integer, p_shares integer, p_saves integer,
  p_reach integer)
returns void
language plpgsql
security definer
set search_path to 'pg_catalog', 'pg_temp'
as $$
begin
  perform private.require_admin(p_token);
  insert into public.instagram_posts(post_id, ig_url, views, likes, comments, shares, saves, reach, updated_at)
  values (p_post_id, coalesce(p_ig_url,''), coalesce(p_views,0), coalesce(p_likes,0), coalesce(p_comments,0), coalesce(p_shares,0), coalesce(p_saves,0), coalesce(p_reach,0), now())
  on conflict (post_id) do update set ig_url=excluded.ig_url, views=excluded.views, likes=excluded.likes,
    comments=excluded.comments, shares=excluded.shares, saves=excluded.saves, reach=excluded.reach, updated_at=now();
end; $$;

-- ------------------------------------------------------------
-- 5. LGPD — o 001 deixou estas duas SEM token
-- ------------------------------------------------------------
-- Como estavam, qualquer um podia gravar aceite no nome de qualquer user_id,
-- ou descobrir se um usuario aceitou. As versoes novas exigem sessao, e o
-- aceite so pode ser gravado para o usuario da propria sessao.
--
-- As versoes ANTIGAS (`lgpd_status(text)` e `lgpd_accept(text, text)`) nao sao
-- removidas aqui, de proposito: sao exatamente as assinaturas que o front-end
-- PUBLICADO chama hoje. Dropa-las antes do deploy quebraria o caminho de LGPD
-- em producao — `checkLGPD` cairia no catch e passaria por cima da checagem, e
-- um usuario que ainda nao aceitou ficaria preso na modal sem conseguir
-- registrar. Postgres aceita as duas aritmidades convivendo, entao ficam como
-- overload e saem no 002b, junto com o resto do que depende do deploy.
create or replace function public.lgpd_status(p_token uuid, p_user_id text)
returns boolean
language plpgsql
security definer
set search_path to 'pg_catalog', 'pg_temp'
as $$
begin
  perform private.require_session(p_token);
  return coalesce((select accepted from public.lgpd_consent where user_id = p_user_id), false);
end; $$;

create or replace function public.lgpd_accept(p_token uuid, p_user_id text, p_user_agent text default null)
returns void
language plpgsql
security definer
set search_path to 'pg_catalog', 'pg_temp'
as $$
declare v_username text;
begin
  perform private.require_session(p_token);
  -- O aceite e um registro pessoal: so vale para o dono da sessao.
  select s.username into v_username from public.portal_sessions s where s.token = p_token;
  if v_username is distinct from p_user_id then
    raise exception 'nao autorizado' using errcode = '42501';
  end if;
  insert into public.lgpd_consent(user_id, accepted, accepted_at, user_agent)
  values (p_user_id, true, now(), left(coalesce(p_user_agent,''), 400))
  on conflict (user_id) do update
    set accepted = true, accepted_at = now(), user_agent = excluded.user_agent;
end; $$;

-- ------------------------------------------------------------
-- 6. REMOVE A CAMADA DE TOKEN COMPARTILHADO
-- ------------------------------------------------------------
drop function if exists public.post_save(text, text, text, integer, text, text, text, text, text);
drop function if exists public.setting_set(text, text, text);
drop function if exists public.req_create(text, text, text, text, text, text, text);
drop function if exists public.req_set_status(text, uuid, text);
drop function if exists public.activity_add(text, text, text);
drop function if exists public.notif_create(text, text, text, text, text);
drop function if exists public.notif_mark_read(text, uuid);
drop function if exists public.notif_mark_all(text, text);
drop function if exists public.ig_account_upsert(text, date, integer, integer, integer, integer, integer, numeric);
drop function if exists public.ig_posts_upsert(text, text, text, integer, integer, integer, integer, integer, integer);

-- Duplicatas: o 001 ja cobre estas duas com checagem de ADMIN, que e mais
-- restrita do que estas eram. Ficam as do 001.
drop function if exists public.req_delete(text, uuid);
drop function if exists public.activity_delete(text, uuid);
drop function if exists public.lgpd_set(text, text, text);

-- Sem nenhuma RPC apontando para ela, a checagem do token compartilhado morre.
drop function if exists private.check_write_token(text);

-- `private.portal_config` fica, so com a linha `write_token` que ninguem mais
-- le. Nao apago porque e o unico lugar onde esse valor existe: se houver algum
-- script seu usando, apagar aqui perde o segredo sem aviso. Esta no schema
-- `private`, sem acesso para anon, entao guardar nao custa nada.
comment on table private.portal_config is
  'OBSOLETO desde o hardening_002a: a chave write_token nao e mais lida por nenhuma funcao. Seguro apagar quando confirmado que nenhum script externo a usa.';

-- ------------------------------------------------------------
-- 7. GRANTS
-- ------------------------------------------------------------
-- As funcoes em `private` nao sao expostas. O que de fato barra `anon` e a
-- falta de USAGE no schema `private` (e o PostgREST so expor `public`), nao o
-- EXECUTE: Postgres concede EXECUTE a PUBLIC por padrao em toda funcao nova, e
-- `revoke ... from anon` NAO remove isso — anon herda via PUBLIC. Por isso o
-- revoke aqui e de PUBLIC.
--
-- Nao quebra as RPCs: sao SECURITY DEFINER com owner `postgres`, entao a
-- chamada a estes helpers roda como postgres, que mantem o EXECUTE.
revoke execute on function private.require_session(uuid) from public;
revoke execute on function private.require_admin(uuid)   from public;

grant execute on function public.post_save(uuid, text, text, integer, text, text, text, text, text) to anon;
grant execute on function public.setting_set(uuid, text, text)                                      to anon;
grant execute on function public.req_create(uuid, text, text, text, text, text, text)               to anon;
grant execute on function public.req_set_status(uuid, uuid, text)                                   to anon;
grant execute on function public.activity_add(uuid, text, text)                                     to anon;
grant execute on function public.notif_create(uuid, text, text, text, text)                         to anon;
grant execute on function public.notif_mark_read(uuid, uuid)                                        to anon;
grant execute on function public.notif_mark_all(uuid, text)                                         to anon;
grant execute on function public.ig_account_upsert(uuid, date, integer, integer, integer, integer, integer, numeric) to anon;
grant execute on function public.ig_posts_upsert(uuid, text, text, integer, integer, integer, integer, integer, integer) to anon;
grant execute on function public.lgpd_status(uuid, text)                                            to anon;
grant execute on function public.lgpd_accept(uuid, text, text)                                      to anon;

commit;

-- ============================================================
-- DEPOIS DESTE ARQUIVO
--
-- O banco aceita as duas formas de escrita: pelas RPCs (com sessao) e direto
-- na tabela (anonima, pelas policies que o 001 deixou). O front-end novo passa
-- a usar as RPCs. Quando ele estiver no ar, rode o 002b para tirar a escrita
-- anonima direta — e so entao o risco residual fecha.
-- ============================================================
