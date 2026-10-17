# Schema de produção — inspecionado em 2026-10-17

Este documento descreve o que o banco de produção **realmente tem**, lido dos
catálogos do Postgres (`pg_class`, `pg_policy`, `pg_proc`, `pg_publication`),
não do que os arquivos `.sql` deste repositório afirmam.

Ele existe por um motivo específico. A auditoria de segurança de 2026-08-01 foi
escrita lendo os arquivos `.sql` do repositório com o projeto Supabase pausado,
e concluiu que o banco estava inteiramente aberto. Isso estava **incompleto**:
havia uma camada de autorização de escrita em produção, aplicada pela migração
`phase1_rls_hardening_write_gateway` em 2026-06-30, que nenhum arquivo deste
repositório registrava. O repositório não descrevia a produção, e quem leu o
repositório leu errado.

> **Não é um dump.** Não recria o banco. Para um dump fiel use
> `supabase db dump --db-url <url>` ou o pg_dump do painel. Este arquivo é para
> leitura humana e para que a próxima auditoria não repita o mesmo erro.

## Tabelas (schema `public`)

| Tabela | PK | Colunas | Observações |
|---|---|---|---|
| `post_data` | `post_id` (text) | 9 | `roteiro_status`, `roteiro_notes`, `roteiro_checks` vieram de migrações posteriores ao setup |
| `project_settings` | `key` (text) | 2 | `approved_essencial` / `approved_growth` são aprovações do cliente; `month_note` é do admin |
| `requests` | `id` (uuid) | 9 | `source` (admin\|client) e `priority` vieram de `add_source_priority_to_requests` |
| `activity` | `id` (uuid) | 5 | **`author text not null default 'sistema'` existe só em produção** — não está em nenhum `.sql` do repo |
| `notifications` | `id` (uuid) | 7 | — |
| `lgpd_consent` | `id` (uuid), unique `user_id` | 7 | dado pessoal. `ip_address` existe e **nunca é escrita** por nenhuma função |
| `portal_users` | `id` (uuid), unique `username` | 8 | `role` com check `admin\|client` |
| `portal_sessions` | `token` (uuid) | 5 | criada pelo `hardening_001`; índice em `expires_at` |
| `instagram_account` | `id` (bigint), unique `date` | 8 | **não está em `supabase_setup.sql`** — veio de `create_instagram_tables`. Vazia |
| `instagram_posts` | `id` (bigint), unique `post_id` | 9 | mesma origem. Vazia |

Schema `private`: `portal_config` (uma linha, `write_token`). Marcada como
obsoleta pelo `hardening_002a`.

## Permissões para `anon` — depois do 001 e do 002a

| | SELECT | INSERT | UPDATE | DELETE |
|---|:--:|:--:|:--:|:--:|
| tabelas de conteúdo (5) | ✅ | ✅¹ | ✅¹ | ❌ |
| `instagram_*` | ✅ | ✅¹ | ✅¹ | ❌ |
| `lgpd_consent`, `portal_users`, `portal_sessions` | ❌ | ❌ | ❌ | ❌ |

¹ Fechado pelo `hardening_002b`, que só pode rodar **depois** do deploy do
front-end que usa as RPCs. Ver a ordem no README.

O SELECT fica aberto de propósito: é a permissão que o Realtime usa para
entregar `postgres_changes`.

## Funções

Todas `SECURITY DEFINER`, todas com `EXECUTE` para `anon` — é assim que uma RPC
é chamável pelo front-end. O que protege não é a permissão de executar, é o
portão dentro da função.

| Função | Portão |
|---|---|
| `verify_login(text, text)` | nenhum — é o login. Custo constante quando falha, não revela se o usuário existe |
| `session_role(uuid)`, `logout(uuid)` | o próprio token |
| `post_save`, `setting_set`, `req_create`, `req_set_status`, `activity_add` | `private.require_session` |
| `notif_create`, `notif_mark_read`, `notif_mark_all` | `private.require_session` |
| `lgpd_status`, `lgpd_accept` | `require_session` + o aceite só vale para o usuário da própria sessão |
| `admin_delete_request`, `admin_delete_activity` | `session_role = 'admin'` |
| `ig_account_upsert`, `ig_posts_upsert` | `private.require_admin` |

`private.require_session` / `require_admin` não têm `EXECUTE` para `anon`: só as
RPCs em `public` as chamam, rodando como owner.

## Realtime

Publicação `supabase_realtime`, com `notifications`, `requests`, `activity`,
`post_data` e `project_settings` — restauradas pelo `supabase_realtime_001.sql`.
**Estavam ausentes:** a publicação tinha zero tabelas e o front-end não recebia
evento nenhum.

`replica identity full` nessas cinco, necessário para o payload de UPDATE e
DELETE trazer os valores antigos.

## Migrações registradas no banco

```
20260606010843  add_source_priority_to_requests
20260609214643  add_auth_lgpd_tables
20260609214716  fix_verify_login_search_path
20260610153447  create_instagram_tables
20260618135404  add_roteiro_status_to_post_data
20260618141118  add_roteiro_notes_and_checks_to_post_data
20260620193027  create_srchz_leads          ← ver nota
20260629210742  revoke_public_execute_rls_auto_enable
20260630071244  phase1_rls_hardening_write_gateway
```

**Nota sobre `create_srchz_leads`:** `srchz_leads` é a tabela de leads do site
`srchz-technologies.com.br`, que vive em **outro** projeto Supabase. A migração
está registrada aqui e a tabela não existe neste banco. O mais provável é que
tenha sido aplicada no projeto errado e revertida depois. Registro o fato; não
tenho como confirmar a intenção.

Os arquivos rodados pelo SQL Editor (`hardening_001` e o bloco das tabelas de
Instagram, em 2026-10-17) **não** aparecem nessa lista: o editor não registra
migração. É uma limitação a ter em mente — a lista acima não é o histórico
completo das mudanças.

## Como regerar este documento

As consultas estão em `tools/inspect_schema.sql`. Rode no SQL Editor do painel
e compare com o que está escrito aqui. Vale fazer isso depois de qualquer
pausa/restauração do projeto, que foi justamente o que derrubou a publicação do
Realtime.
