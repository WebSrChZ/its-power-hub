-- ============================================================
-- Consultas que geram o SCHEMA.md. Rode no SQL Editor do painel.
--
-- Use isto em vez de confiar nos arquivos .sql deste repositorio: foi
-- exatamente a divergencia entre repositorio e producao que fez a auditoria de
-- 2026-08-01 concluir errado sobre o estado do banco.
--
-- Rode depois de QUALQUER pausa/restauracao do projeto. A pausa de 2026-10-17
-- derrubou a lista de tabelas da publicacao do Realtime sem nenhum aviso, e o
-- unico sintoma era o portal parar de atualizar sozinho.
-- ============================================================

-- 1. Tabelas e colunas
select c.relname as tabela, a.attname as coluna,
       format_type(a.atttypid, a.atttypmod) as tipo,
       not a.attnotnull as aceita_null,
       pg_get_expr(d.adbin, d.adrelid) as padrao
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  join pg_attribute a on a.attrelid = c.oid
  left join pg_attrdef d on d.adrelid = c.oid and d.adnum = a.attnum
 where n.nspname = 'public' and c.relkind = 'r'
   and a.attnum > 0 and not a.attisdropped
 order by c.relname, a.attnum;

-- 2. Policies e permissoes efetivas de `anon`
--    As duas coisas importam, e por razoes diferentes: sem policy, a operacao
--    nao passa mesmo com GRANT; sem GRANT, nao passa mesmo com policy. Deixar
--    o GRANT aberto confiando so na ausencia de policy e fragil — basta
--    alguem criar uma policy permissiva por engano.
select c.relname as tabela,
       c.relrowsecurity as rls_on,
       has_table_privilege('anon', c.oid, 'SELECT') as anon_select,
       has_table_privilege('anon', c.oid, 'INSERT') as anon_insert,
       has_table_privilege('anon', c.oid, 'UPDATE') as anon_update,
       has_table_privilege('anon', c.oid, 'DELETE') as anon_delete,
       coalesce((select string_agg(p.polname || ':' || p.polcmd::text, ', ' order by p.polname)
                   from pg_policy p where p.polrelid = c.oid), '(sem policy)') as policies
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
 where n.nspname = 'public' and c.relkind = 'r'
 order by c.relname;

-- 3. Funcoes: assinatura, security definer e quem pode executar
select n.nspname as schema, p.proname as funcao,
       pg_get_function_identity_arguments(p.oid) as args,
       p.prosecdef as security_definer,
       has_function_privilege('anon', p.oid, 'EXECUTE') as anon_executa
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
 where n.nspname in ('public', 'private')
 order by n.nspname, p.proname;

-- 4. Corpo de uma funcao especifica (troque o nome)
-- select pg_get_functiondef(p.oid)
--   from pg_proc p join pg_namespace n on n.oid = p.pronamespace
--  where n.nspname = 'public' and p.proname = 'post_save';

-- 5. Realtime: a publicacao publica alguma coisa?
--    `puballtables = false` com zero membros = nao publica NADA, e o
--    front-end se inscreve sem receber evento. Falha silenciosa.
select p.pubname, p.puballtables,
       (select count(*) from pg_publication_rel r where r.prpubid = p.oid) as tabelas_listadas,
       coalesce((select string_agg(c.relname, ', ' order by c.relname)
                   from pg_publication_rel r
                   join pg_class c on c.oid = r.prrelid
                  where r.prpubid = p.oid), '(nenhuma)') as quais
  from pg_publication p
 order by p.pubname;

-- 6. Replica identity (o payload de UPDATE/DELETE precisa de `full`)
select c.relname as tabela,
       case c.relreplident
         when 'd' then 'default (so a PK)'
         when 'f' then 'full'
         when 'n' then 'nothing'
         when 'i' then 'index'
       end as replica_identity
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
 where n.nspname = 'public' and c.relkind = 'r'
 order by c.relname;

-- 7. Constraints e indices
select c.relname as objeto, con.conname as nome, pg_get_constraintdef(con.oid) as definicao
  from pg_constraint con
  join pg_class c on c.oid = con.conrelid
  join pg_namespace n on n.oid = c.relnamespace
 where n.nspname = 'public'
 order by c.relname, con.conname;

-- 8. Contagem de linhas por tabela (confere integridade depois de um restore)
select table_name,
       (xpath('/row/c/text()', query_to_xml(format('select count(*) as c from public.%I', table_name), false, true, '')))[1]::text::int as linhas
  from information_schema.tables
 where table_schema = 'public' and table_type = 'BASE TABLE'
 order by table_name;
