#!/usr/bin/env bash
# Reproduz a análise automatizada da Parte 1 (executar na raiz do repositório).
set -e
mkdir -p /tmp/cafofo-analise && cd /tmp/cafofo-analise
[ -f package.json ] || npm init -y >/dev/null
npm i --silent eslint@8.57.0 eslint-plugin-sonarjs@0.25.1 eslint-plugin-react@7.34.2 \
  eslint-plugin-react-hooks@4.6.2 eslint-plugin-security@1.7.1 jscpd@4
cd - >/dev/null
ESL=/tmp/cafofo-analise/node_modules/.bin
$ESL/eslint --no-eslintrc -c docs/qualidade/sonar.eslintrc.cjs --resolve-plugins-relative-to /tmp/cafofo-analise \
  --ext .js,.jsx frontend/src backend/src --ignore-pattern '**/seed.js' -f html -o relatorio-eslint.html || true
$ESL/jscpd frontend/src backend/src --ignore "**/seed.js" --min-tokens 50 --reporters console,html --output relatorio-jscpd
npx --yes cloc@2 --exclude-dir=node_modules,dist,public,data frontend/src backend/src
(cd frontend && npm audit || true); (cd backend && npm audit || true)
