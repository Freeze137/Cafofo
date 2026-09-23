# Análise de qualidade — Parte 1

Ferramentas: ESLint 8 + eslint-plugin-sonarjs (regras SonarJS) + eslint-plugin-security,
jscpd (duplicação), cloc (tamanho) e npm audit (dependências).

Para reproduzir: `bash docs/qualidade/analise.sh` na raiz do repositório.
Resultados de referência (22/09/2026, commit 2ffe964): 31 ocorrências ESLint/SonarJS,
duplicação de 4,14%, complexidade ciclomática média 1,73 (máx. 15), 25 vulnerabilidades
em dependências (7 altas), cobertura de testes 0%.
