# Pocki — Arquitetura e compatibilidade

**Status:** especificação técnica proposta, sem alterações no repositório.

## Base existente verificada
- `index.html`, `styles.css`, módulos ES em `src/`.
- `src/main.js`: estado de UI, botões A/B/C, renderização, eventos de visibilidade e salvamento.
- `src/game.js`: `createGame`, `advanceGame`, `applyAction`, `getViewModel`, `validateGame`.
- `src/config.js`: temporização, `SCHEMA_VERSION = 1`, `STORAGE_KEY = 'pocki-save'`.
- `src/storage.js`: leitura/gravação no `localStorage`, validação e limpeza explícita.
- `npm test` executa testes de lógica segundo README.

## Estrutura sugerida (sem obrigação de criar todos os módulos)
- `src/game.js`: orquestração de regras de estado, evolução e ações.
- `src/species.js`: catálogo original e critérios de evolução (quando a complexidade justificar separação).
- `src/behavior.js`: seleção de comportamentos e personalidade (se necessário).
- `src/minigames.js`: regras puras dos minijogos (se necessário).
- `src/storage.js`: migração e persistência.
- `src/main.js`: eventos de interface e renderização, sem lógica de balanceamento.
- CSS e assets separados somente se houver benefício concreto. Sem framework, bundler, backend ou banco de dados.

## Modelo de estado proposto (ilustrativo)
```js
{
  schemaVersion: 2,
  // manter campos legados necessários à continuidade da partida
  stage: 'child',
  speciesId: null, // espécie ainda não revelada
  personality: { sociability: 0, energy: 0, curiosity: 0 },
  bond: 0,
  careHistory: { /* contadores agregados, sem log infinito */ },
  scene: 'room',
  minigame: { /* somente estado que precise persistir */ },
  // createdAt, hatchedAt, lastProcessedAt e agendamentos existentes
}
```
Os nomes, faixas e defaults são sugestões. Definir invariantes antes de codificar. Evitar duplicar dados derivados.

## Migração v1 -> v2: requisito obrigatório
1. Ler `pocki-save` sem sobrescrever o conteúdo original antes de validar/migrar.
2. Migrar v1 válida preservando timestamps, estágio, necessidades, saúde, erros de cuidado e demais campos relevantes.
3. Atribuir defaults neutros aos novos campos; não inventar histórico de vínculo ou de personalidade anterior.
4. Para adultos v1 com `adultForm` `sun`/`moon`, definir política explícita: manter aparência legada até nova partida **ou** mapear com consentimento/documentação. Não trocar criatura adulta silenciosamente.
5. Garantir que migração repetida seja idempotente e não altere o estado após primeira execução.
6. Se save estiver inválido ou em versão futura, apresentar recuperação sem apagar automaticamente.
7. Adicionar testes de v1 ovo/bebê/criança/adolescente/adulto/morto, além de dados corrompidos.
8. Testar fechamento de aba, fechamento de navegador e reabertura na **mesma origem**; `file://`, `localhost` e domínio de produção têm armazenamentos distintos.
9. Considerar cópia de segurança temporária (`pocki-save-v1-backup`) na primeira migração, com política clara para limpeza futura; não sobrescrever backup existente.

## Simulação temporal
- `advanceGame(state, now)` deve ser determinística e independente do DOM.
- Não executar laços por segundo de tempo offline; processar eventos relevantes em ordem cronológica.
- Evitar loops excessivos após longas ausências e preservar estado terminal de morte.
- Separar seleção de animações efêmeras de mutações persistentes.
- A longevidade atual é fixa em 21 dias (`oldAgeDeathAt`); substituir por política baseada em cuidado somente após aprovação de números.

## Compatibilidade e qualidade
- HTML/CSS/JS nativos; desktop/mobile; teclado, mouse e toque.
- Não depender de recursos externos para jogar.
- Preservar URLs e publicação estática atual em `https://jalves.dev.br/pocki/`.
- Testes unitários para regras puras e regressões para save, evolução, morte, limites de status e time travel.
- Verificar acessibilidade básica, performance em celular e ausência de erros de console.
- Sem deploy ou commit automático sem pedido explícito.
