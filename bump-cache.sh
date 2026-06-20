#!/usr/bin/env bash
# Bumpa a versão de cache do portal num passo só: CACHE_NAME + VER no sw.js e
# todos os ?v= do index.html (CSS, JS e iframes de roteiro) — mantendo-os em sincronia.
#
# Uso:
#   ./bump-cache.sh            -> versão automática = AAAAMMDD-<sha-curto>  (ex: 20260620-1aba3e7)
#   ./bump-cache.sh 20260701   -> versão explícita
#
# Não commita: só edita os arquivos. Revise com `git diff` e commite você mesmo.
set -euo pipefail
cd "$(dirname "$0")"

PUB="public"
SW="$PUB/sw.js"
[ -f "$SW" ] || { echo "Erro: $SW não encontrado (rode na raiz do repo its-power-hub)."; exit 1; }

# Versão atual, lida do CACHE_NAME do sw.js (ex: its-power-v20260620 -> 20260620)
OLD=$(grep -oE "its-power-v[A-Za-z0-9._-]+" "$SW" | head -1 | sed 's/^its-power-v//')
[ -n "$OLD" ] || { echo "Erro: não achei a versão atual no $SW."; exit 1; }

# Nova versão
if [ "${1:-}" ]; then
  NEW="$1"
else
  SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "local")
  NEW="$(date +%Y%m%d)-${SHA}"
fi

if [ "$OLD" = "$NEW" ]; then
  echo "Versão já é '$NEW' — nada a fazer."
  exit 0
fi

echo "Bump de cache: $OLD -> $NEW"

# Substitui apenas nos contextos de versionamento (?v=… e its-power-v…),
# evitando trocar datas soltas que por acaso batam com a versão.
mapfile -t FILES < <(grep -rl -e "?v=${OLD}" -e "its-power-v${OLD}" "$PUB" 2>/dev/null || true)
[ ${#FILES[@]} -gt 0 ] || { echo "Nada para atualizar (versão '$OLD' não encontrada nos assets)."; exit 0; }

for f in "${FILES[@]}"; do
  sed -i -e "s|?v=${OLD}|?v=${NEW}|g" -e "s|its-power-v${OLD}|its-power-v${NEW}|g" "$f"
  echo "  ✓ $f"
done

echo ""
echo "Feito. Confira com:  git diff -- public/"
echo "Depois:              git add public/ && git commit -m \"chore: bump cache $OLD -> $NEW\" && git push"
