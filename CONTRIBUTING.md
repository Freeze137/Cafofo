# Como contribuir

## Estratégia de branches (GitHub Flow)

- `main` é sempre estável e é a única branch de longa duração.
- Toda mudança nasce de uma **issue** e é feita numa branch curta:
  `tipo/numero-descricao-curta` — exemplos: `feat/12-autenticacao-api`,
  `fix/7-adocao-orfa`, `docs/1-readme-execucao`.
- Nada é enviado direto para a `main`: a integração acontece por **pull request**
  com aprovação de pelo menos **um outro integrante**.

## Mensagens de commit (Conventional Commits)

```
<tipo>(escopo opcional): descrição no imperativo, em minúsculas
```

Tipos: `feat`, `fix`, `docs`, `refactor`, `test`, `style`, `chore`.
Referencie a issue no corpo ou no PR (`Refs #12`, `Closes #12`).
Evite mensagens genéricas como "ajustes" ou "att".

## Fluxo de uma mudança

1. Abrir (ou escolher) a issue e atribuir a um responsável.
2. `git switch main && git pull`
3. `git switch -c tipo/NN-descricao`
4. Commits pequenos e coesos.
5. `git push -u origin tipo/NN-descricao` e abrir o PR usando o template.
6. Revisão por outro integrante (comentários ou aprovação).
7. Merge com **merge commit** (preserva a rastreabilidade) e exclusão da branch.
8. Ao fechar uma versão: atualizar `CHANGELOG.md` e criar tag anotada
   (`git tag -a vX.Y.Z -m "..."`) + release no GitHub.

## Antes de abrir o PR

- `cd frontend && npm run lint` sem avisos.
- Aplicação sobe seguindo o README.
- Não versionar `node_modules/`, `dist/`, `.env` nem `backend/src/data/db.json`.
