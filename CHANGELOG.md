# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/);
versões seguem [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.1.0] — 2026-11

Versão da **Parte 2** do projeto de Qualidade de Software (plano: issue #5).

### Segurança
- Cadastro e login na API (`/api/auth`), com senha gravada só como hash bcrypt; o navegador
  guarda apenas o token JWT e apaga a lista antiga de usuários com senha (#9).
- Todas as rotas de dados exigem token JWT; sem token → 401 (#8).
- Tratador central de erros: respostas sempre em JSON, sem stack trace (#11).
- Dependências atualizadas (Express 4.22, Vite 7, React Router 7, PostCSS 8.5, Vitest 5):
  `npm audit` sem vulnerabilidades altas no frontend e no backend (#14).

### Corrigido
- Dados iniciais: status dos pets coerente com as adoções (#6).
- Exclusão de pet com adoção vinculada é recusada com 409 (#7).
- API valida idade (inteiro de 0 a 30) e formato de e-mail (#10).

### Alterado
- Validadores de pets, adoções e voluntários refatorados em regras pequenas
  (`src/validation/rules.js`); complexidade máxima 15 → 4 (#13).
- O botão "Entrar com Google" deixa de criar uma sessão falsa.
- `.nvmrc` passa a exigir Node.js 22 LTS.

### Adicionado
- Testes automatizados com Vitest + Supertest e cobertura v8 (`npm test` no backend) (#12).
- Pipeline de CI no GitHub Actions (`.github/workflows/ci.yml`) (#12).

## [1.0.0-baseline-p1] — 2026-09-22

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
