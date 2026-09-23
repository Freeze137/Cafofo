# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/);
versões seguem [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.0-baseline-p1] — 2026-09-25

Baseline da **Parte 1** do projeto de Qualidade de Software. O código-fonte é idêntico ao
commit `2ffe964` (18/06/2026), usado nas medições de 22/09/2026.

### Documentação
- README reescrito: execução com dois terminais, pré-requisitos, equipe, scripts,
  variáveis de ambiente, endpoints e limitações conhecidas.
- Adicionados `CHANGELOG.md`, `CONTRIBUTING.md`, templates de issue e de pull request.
- Adicionados `.nvmrc` e arquivos `.env.example`.
- Adicionada a configuração da análise de qualidade em `docs/qualidade/`.

### Configuração
- `frontend/package-lock.json` regenerado: removida a dependência `firebase`, que
  continuava declarada no lockfile após a remoção da integração (commit `834b9e1`).

## [1.0.0] — 2026-06-18

Versão entregue na disciplina anterior.

### Adicionado
- CRUD de pets, adoções e voluntários; relatório com cruzamento das três entidades.
- Landing page, autenticação local e rotas protegidas no frontend.
- API REST em Express com persistência em arquivo JSON (substituiu MySQL).
