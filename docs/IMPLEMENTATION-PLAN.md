# Pocki — Plano incremental para Codex

**Instrução central:** este documento autoriza **planejar e revisar**, não implementar. Cada fase requer autorização separada do usuário.

## Fase 0 — Auditoria e baseline
- Inspecionar repositório completo e executar testes atuais.
- Documentar comportamento real, cobertura e possíveis diferenças em relação aos documentos.
- Confirmar que o build estático e a partida atual funcionam.
- Registrar riscos de migração e de regressão do LCD/três botões.
**Entrega:** relatório curto + plano de testes; nenhum arquivo de jogo alterado.

## Fase 1 — Persistência e modelo extensível
- Após aprovação, implementar migração v1 -> v2 e testes, sem alterar jogabilidade.
- Introduzir somente campos necessários à primeira funcionalidade aprovada.
**Aceite:** saves antigos preservados; novos saves estáveis; regressões verdes.

## Fase 2 — Espécies e evolução
- Catálogo pequeno de criaturas originais, arte original e regras determinísticas.
- Escolher ponto de revelação e matriz de evolução antes de codificar.
**Aceite:** cenários de cuidado produzem espécies esperadas e não alteram adultos legados sem política aprovada.

## Fase 3 — Personalidade e vínculo
- Implementar traços limitados e vínculo progressivo, com efeitos observáveis.
- Evitar ganhos ilimitados por ações repetidas.
**Aceite:** diferenças entre indivíduos verificáveis; ausência moderada não causa punição desproporcional.

## Fase 4 — Minijogos
- Preservar minijogo existente e adicionar dois novos, inicialmente.
- A/B/C em teclado e toque; feedback e recompensas consistentes.
**Aceite:** todos jogáveis por todas as espécies; testes de vitória/derrota/cancelamento.

## Fase 5 — Ambientes e autonomia
- Quarto, jardim, brincadeiras dentro do LCD; navegação simples.
- Adicionar comportamentos visuais contextuais, sem simulação de frames offline.
**Aceite:** necessidades continuam acessíveis; sono/doença prioritários; celular funcional.

## Fase 6 — Longevidade, balanceamento e polimento
- Aprovar parâmetros de duração, negligência e longevidade variável.
- Ajustar animações, sprites e mensagens, preservando o visual retrô.
**Aceite:** testes de ciclo completo, ausência prolongada, morte e reinício.

## Gates de revisão
Ao fim de cada fase, apresentar: alterações, justificativas, testes executados/resultados, riscos, screenshots quando UI mudar, e próximos passos. Não avançar automaticamente.

## Primeiro prompt ao Codex (somente análise)
> Você está trabalhando no projeto Pocki. Leia `PRODUCT.md`, `GAME-DESIGN.md`, `TECH-SPEC.md` e `IMPLEMENTATION-PLAN.md` (ou seus equivalentes em `docs/`). Execute **apenas a Fase 0**: audite o código e testes existentes, identifique incompatibilidades com as decisões DEC-011 a DEC-020, avalie o risco de migração do save v1 e proponha uma sequência mínima de implementação com critérios de aceitação. **Não altere arquivos, não implemente funcionalidades, não faça commits e não publique o site.** Distinga requisitos aprovados de parâmetros ainda pendentes de decisão. Informe qualquer conflito antes de sugerir solução.

## DEC-021 e DEC-022 — aprovadas em 24/10/2026
- **DEC-021 B:** saves v1 adultos com `adultForm: 'sun' | 'moon'` serão convertidos em espécies novas **somente na Fase 2**, após definição do catálogo e do mapeamento. A Fase 1 preserva integralmente a aparência e o campo `adultForm`, sem conversão visual.
- **DEC-022 B:** schema v2 mínimo e extensível. Adicionar apenas versão e identificação de origem/legado estritamente necessárias, preservando os campos v1. Não criar antecipadamente `speciesId`, `personality`, `bond`, `scene` ou históricos não definidos.
- A Fase 1 não muda jogabilidade, arte, evolução, minijogos, mortalidade nem publicação.

## Prompt autorizado — Fase 1 (migração e testes; não iniciar outras fases)

> Leia os quatro documentos em `docs/`, inclusive as decisões DEC-021 B e DEC-022 B. Execute **somente a Fase 1**: migração segura de `pocki-save` schema v1 para v2 mínimo, preservando todos os dados existentes e o comportamento do jogo. Identifique saves migrados com metadado mínimo e estável, para permitir mapeamento de adultos `sun`/`moon` **na Fase 2**, sem convertê-los agora. Não introduza campos de espécie, personalidade, vínculo, ambiente ou histórico futuro sem necessidade comprovada. Preserve `adultForm`, idade, timestamps, agendamentos, saúde, necessidades, disciplina, erros de cuidado e demais campos v1, inclusive nos estados ovo e morto. Valide o estado v2 de forma coerente com o que a simulação consome. Para saves v1 válidos, faça migração idempotente, com backup da representação v1 antes de sobrescrever e sem sobrescrever backup existente. Em caso de dados inválidos, versões futuras, falha de armazenamento ou falha de migração, não apague nem substitua o save; apresente recuperação explícita. Teste saves v1 de todos os estágios, migração repetida, save v2, dados corrompidos, versões futuras, falhas de gravação, fechamento/reabertura na mesma origem, passagem de tempo offline e regressões de regras existentes. Evite abstrações e dependências desnecessárias. Execute `npm test` e relate resultados, mudanças, riscos e instruções para teste manual. **Não implemente Fases 2–6; não altere jogabilidade, interface ou aparência; não faça commit, push ou deploy.** Se houver ambiguidade relevante, pare e solicite decisão antes de alterar.
