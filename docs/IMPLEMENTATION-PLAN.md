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
