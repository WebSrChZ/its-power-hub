-- ============================================================
-- REALTIME 001 — ITS POWER HUB
-- Recoloca as tabelas do portal na publicacao do Realtime.
--
-- O PROBLEMA
--
-- A publicacao `supabase_realtime` estava com ZERO tabelas e
-- `puballtables = false`:
--
--   select pubname, puballtables,
--          (select count(*) from pg_publication_rel r where r.prpubid = p.oid)
--     from pg_publication p where pubname = 'supabase_realtime';
--   -- supabase_realtime | false | 0
--
-- Uma publicacao sem membros nao publica nada. O front-end se inscreve em
-- `postgres_changes` para `notifications`, `requests`, `activity` e
-- `post_data` (app.js, linhas 1161-1176) e nao recebia evento nenhum. As duas
-- features que o README anuncia — notificacoes em tempo real e sincronizacao
-- multi-device — estavam mortas em silencio: o portal so mostrava novidade
-- depois de um F5.
--
-- Silencio e o pior modo de falha possivel aqui, porque e indistinguivel de
-- "nao aconteceu nada".
--
-- CAUSA PROVAVEL (e o que nao da para afirmar)
--
-- O `replica identity full` continua aplicado exatamente nas 6 tabelas do
-- portal, e quem faz isso e o `supabase_setup.sql` justamente para o Realtime
-- funcionar. Ou seja: o Realtime FOI configurado algum dia. O que se perdeu
-- foi a lista de membros da publicacao, que vive em outro catalogo.
--
-- A hipotese mais provavel e a pausa/restauracao do projeto, que aconteceu
-- hoje (2026-10-17) e nao necessariamente recria a publicacao com os membros.
-- Nao da para provar isso daqui: nao ha historico do catalogo antes da pausa.
-- Se o Realtime ja estava morto antes, este arquivo conserta do mesmo jeito.
--
-- Nota operacional: se o projeto for pausado de novo, CONFIRA ISTO ao voltar.
-- A query no topo deste arquivo responde em um segundo.
--
-- Idempotente: so adiciona a tabela que ainda nao esta na publicacao.
-- ============================================================

begin;

do $$
declare t text;
begin
  -- Exatamente as tabelas em que o front-end se inscreve. `lgpd_consent` fica
  -- FORA de proposito: guarda dado pessoal e nada no portal escuta por ela.
  foreach t in array array['notifications','requests','activity','post_data','project_settings']
  loop
    if not exists (
      select 1 from pg_publication p
        join pg_publication_rel r on r.prpubid = p.oid
        join pg_class c on c.oid = r.prrelid
        join pg_namespace n on n.oid = c.relnamespace
       where p.pubname = 'supabase_realtime'
         and n.nspname = 'public'
         and c.relname = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
      raise notice 'adicionada a publicacao: %', t;
    end if;
  end loop;
end $$;

-- O payload de UPDATE/DELETE so traz os valores antigos com replica identity
-- full. Ja estava assim nas 5, mas deixo explicito e idempotente para quem
-- recriar o banco a partir destes arquivos.
alter table public.notifications    replica identity full;
alter table public.requests         replica identity full;
alter table public.activity         replica identity full;
alter table public.post_data        replica identity full;
alter table public.project_settings replica identity full;

commit;

-- ============================================================
-- CONFERIR DEPOIS DE RODAR — esperado: 5 linhas
--
--   select c.relname
--     from pg_publication p
--     join pg_publication_rel r on r.prpubid = p.oid
--     join pg_class c on c.oid = r.prrelid
--    where p.pubname = 'supabase_realtime'
--    order by c.relname;
--
-- Teste de ponta a ponta: abra o portal em dois navegadores, logado nos dois,
-- mude a estrela de um post em um e confirme que o outro atualiza sem F5.
--
-- O Realtime entrega eventos usando a permissao de SELECT do `anon`, que
-- segue liberada nas tabelas de conteudo. E por isso que o `hardening_002b`
-- fecha INSERT/UPDATE/DELETE mas nao fecha a leitura.
-- ============================================================
