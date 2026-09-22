#!/usr/bin/env bash
# Gera o site estático e publica na branch "deploy" do repositório que a
# Hostinger implanta (Printerest-Muriqui). A Hostinger republica sozinha.
#
# Uso:  bash scripts/deploy-hostinger.sh
set -euo pipefail

REPO_DEPLOY="https://github.com/muriquidecor/Printerest-Muriqui.git"
RAIZ="$(cd "$(dirname "$0")/.." && pwd)"
cd "$RAIZ"

echo "→ Gerando o site estático (npm run build)…"
npm run build

PUB=".output/public"
[ -d "$PUB" ] || { echo "ERRO: $PUB não foi gerado."; exit 1; }

# A Hostinger procura index.html; o build gera _shell.html.
cp "$PUB/_shell.html" "$PUB/index.html"
# Garante o .htaccess (roteamento SPA) no site publicado.
[ -f "$PUB/.htaccess" ] || cp public/.htaccess "$PUB/.htaccess"

echo "→ Publicando na branch 'deploy' de Printerest-Muriqui…"
(
  cd "$PUB"
  rm -rf .git
  git init -q
  git config user.email "deploy@muriqui.app"
  git config user.name "Muriqui Deploy"
  git add -A
  git commit -qm "deploy: build estático $(date +%Y-%m-%d_%H-%M)"
  git branch -M deploy
  git push -f "$REPO_DEPLOY" deploy:deploy
)

echo "✓ Enviado. A Hostinger vai republicar app.muriquidecor.com.br automaticamente."
