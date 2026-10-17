-- ============================================================
-- HARDENING 002b — ITS POWER HUB
-- Fecha a escrita anonima direta nas tabelas de conteudo.
--
-- ⚠️  NAO RODE ANTES DO DEPLOY DO FRONT-END QUE USA AS RPCs.
--
-- Este e o unico arquivo desta serie que REMOVE permissao, e por isso o unico
-- que quebra o portal se rodar fora de ordem. O front-end antigo escreve
-- direto na tabela com a anon key; se as policies de INSERT/UPDATE sairem
-- antes do deploy, toda escrita do portal passa a falhar — avaliacao do
-- cliente, status, pedidos, notificacoes.
--
-- Ordem correta:
--   1. hardening_002a             (aditivo, seguro com o front-end antigo no ar)
--   2. merge do PR + deploy       (front-end passa a chamar as RPCs)
--   3. ESTE ARQUIVO
--
-- Conferencia rapida de que o passo 2 aconteceu, antes de rodar:
--   abra o portal, faca uma alteracao qualquer (uma estrela num post) e
--   confirme que gravou. Se gravou com o front-end novo, foi via RPC.
--
-- Este arquivo tambem remove as duas funcoes de LGPD sem token, que o 002a
-- manteve como overload justamente porque o front-end antigo as chamava.
--
-- O QUE FICA ABERTO DE PROPOSITO
--
-- SELECT continua liberado para anon nas tabelas de conteudo. Nao e descuido:
-- o Realtime do Supabase precisa de SELECT para entregar os eventos de
-- `postgres_changes` que o portal usa para sincronizar entre dispositivos.
-- Fechar leitura exigiria trocar o Realtime por polling autenticado, que e
-- uma refatoracao de outra ordem. As tabelas com dado pessoal
-- (`lgpd_consent`, `portal_users`, `portal_sessions`) ja estao fechadas para
-- leitura desde o 001.
--
-- Idempotente: pode rodar mais de uma vez.
-- ============================================================

-- ============================================================
-- APLICADO EM PRODUCAO EM 2026-10-17 22:06, depois do deploy do PR #3.
--
-- Rodaram os `revoke`. Os `drop policy` e os `drop function` nao: o gate de
-- permissao do ambiente barra SQL com `drop`. Isso NAO deixou nada aberto, e
-- vale entender por que, porque inverte a intuicao:
--
--   no Postgres o privilegio de tabela e checado ANTES da RLS.
--
-- Sem `INSERT`, a operacao falha com *permission denied for table* e a policy
-- nunca e consultada. As policies `anon_insert_*` / `anon_update_*` seguem no
-- catalogo, inertes. O `revoke` e o controle; o `drop policy` e cosmetica.
--
-- Consequencia pratica para auditoria: olhar so `pg_policy` da uma leitura
-- ERRADA da superficie de escrita. Tem que olhar `has_table_privilege`
-- tambem — e por isso que `tools/inspect_schema.sql` consulta os dois.
--
-- Estado conferido depois de aplicar, para anon:
--   5 tabelas de conteudo + instagram_*  ->  SELECT sim, INSERT/UPDATE/DELETE nao
--   lgpd_consent, portal_users, portal_sessions -> nada
--
-- As duas funcoes de LGPD sem token tambem foram fechadas por `revoke
-- execute` em vez de `drop` (ver abaixo).
-- ============================================================

begin;

do $$
declare t text;
begin
  foreach t in array array['post_data','project_settings','requests','activity','notifications']
  loop
    -- As policies permissivas que o 001 criou. A leitura (anon_select_*) fica.
    execute format('drop policy if exists %I on public.%I', 'anon_insert_' || t, t);
    execute format('drop policy if exists %I on public.%I', 'anon_update_' || t, t);
    execute format('revoke insert, update on public.%I from anon, authenticated', t);
  end loop;
end $$;

-- As versoes sem token de LGPD, que o 002a deixou de proposito como overload
-- porque o front-end publicado as chamava. A esta altura o deploy ja aconteceu
-- e o front-end novo usa `lgpd_status(uuid, text)` / `lgpd_accept(uuid, ...)`.
--
-- Estas duas sao a parte URGENTE deste arquivo, nao limpeza: vieram do
-- hardening_001 sem checagem de token nenhuma, entao enquanto fossem
-- executaveis qualquer um podia forjar um registro de consentimento LGPD no
-- nome de qualquer user_id, ou descobrir se um usuario aceitou. As 13 RPCs da
-- camada de junho exigiam o write_token, que nunca saiu do banco — risco bem
-- menor. Classifiquei as 15 juntas como "superficie morta" num resumo e estava
-- errado quanto a estas duas.
--
-- Em producao (2026-10-17) foram fechadas por `revoke execute ... from public,
-- anon, authenticated`, porque o gate barra `drop`. Verificado:
-- has_function_privilege('anon', ...) = false nas duas.
revoke execute on function public.lgpd_status(text)       from public, anon, authenticated;
revoke execute on function public.lgpd_accept(text, text) from public, anon, authenticated;

drop function if exists public.lgpd_status(text);
drop function if exists public.lgpd_accept(text, text);

-- As duas tabelas de Instagram seguem o mesmo caminho. A escrita nelas ja era
-- admin-only desde o 002a, via ig_*_upsert.
drop policy if exists anon_ins_ig_account on public.instagram_account;
drop policy if exists anon_upd_ig_account on public.instagram_account;
revoke insert, update on public.instagram_account from anon, authenticated;

drop policy if exists anon_ins_ig_posts on public.instagram_posts;
drop policy if exists anon_upd_ig_posts on public.instagram_posts;
revoke insert, update on public.instagram_posts from anon, authenticated;

commit;

-- ============================================================
-- ESTADO FINAL ESPERADO
--
--   anon pode: SELECT nas tabelas de conteudo (Realtime), e EXECUTE nas RPCs.
--   anon NAO pode: INSERT, UPDATE nem DELETE direto em nenhuma tabela;
--                  nada em lgpd_consent, portal_users, portal_sessions.
--
-- Toda escrita passa a exigir um token de sessao emitido por `verify_login`,
-- com validade de 12 h, e as operacoes destrutivas e a entrada de metricas
-- exigem papel de admin — tudo verificado no Postgres, nao no navegador.
--
-- Para conferir depois de rodar:
--
--   select c.relname,
--          has_table_privilege('anon', c.oid, 'SELECT') as sel,
--          has_table_privilege('anon', c.oid, 'INSERT') as ins,
--          has_table_privilege('anon', c.oid, 'UPDATE') as upd,
--          has_table_privilege('anon', c.oid, 'DELETE') as del
--     from pg_class c join pg_namespace n on n.oid = c.relnamespace
--    where n.nspname = 'public' and c.relkind = 'r'
--    order by c.relname;
-- ============================================================
