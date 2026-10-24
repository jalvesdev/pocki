# Pocki — Especificação de jogo

**Status:** desenho proposto para revisão, não regras numéricas aprovadas.

## Ciclo de vida
`ovo -> bebê -> criança -> adolescente -> adulto -> morte -> novo ovo`.
A espécie não deve ser fixada no ovo. A revelação pode ocorrer em uma transição posterior; escolher o momento exato antes da implementação. Não confundir `stage` (fase) com `speciesId` (espécie) e `personality` (traços).

### Evolução
- Manter registros pequenos e determinísticos de cuidado: atenção a necessidades, brincadeiras, disciplina justificada e tratamento de doença.
- Na transição escolhida, calcular uma espécie a partir desses registros, com desempate determinístico persistido. Evitar depender de sorte não reproduzível durante a renderização.
- A seleção não deve exigir perfeição nem tornar uma espécie inacessível.
- O catálogo deve ser dirigido por dados (IDs estáveis, nomes e assets), sem duplicar a lógica do jogo para cada espécie.

### Personalidade
- Três traços propostos: `sociability`, `energy`, `curiosity`.
- Tendências iniciais leves; variações progressivas por ações relevantes, com limites e retornos decrescentes.
- Traços influenciam frequência de animações, preferências de atividade e reações; não substituem fome, felicidade ou saúde.
- Evitar mudanças extremas com uma única ação e evitar recompensar cliques repetitivos infinitos.

### Vínculo
- Valor interno persistido, não necessariamente barra visível.
- Aumenta por cuidado e interações positivas distribuídas no tempo; ausência curta não reduz drasticamente o vínculo.
- Expressar níveis por feedback, aproximação espontânea, animações e mensagens breves.
- Não confundir vínculo com felicidade: felicidade é necessidade momentânea; vínculo é relação de longo prazo.

## Necessidades e alimentação
- Preservar refeição e guloseima, sem catálogo de alimentos.
- Preservar fome, felicidade, limpeza, saúde, sono e disciplina, com ajustes de balanceamento documentados.
- Recompensa de guloseima e consequências do excesso devem ser proporcionais e testáveis.

## Minijogos
**Proposta inicial:** adivinhação existente + números (maior/menor) + memória simples. Um quarto jogo é opcional após avaliação.
- A navega/alternar; B confirmar; C voltar.
- Nenhum minijogo exclusivo por espécie.
- Personalidade muda animações/reações, não regras ou chance oculta de vitória.
- Resultado ajusta felicidade e, moderadamente, vínculo/traços; limitar repetição explorável.

## Ambientes
- Três cenários propostos: quarto, jardim e área de brincadeiras.
- Ambientes são variações de cena no LCD, não páginas independentes ou mapa livre.
- Navegação não deve ocultar ações essenciais nem quebrar o esquema A/B/C.
- Comportamentos autônomos usam contexto do cenário, mas não bloqueiam cuidados.

## Autonomia
- Selecionar ações de uma lista pequena: caminhar, observar, brincar sozinho, procurar atenção, cochilar, espreguiçar.
- Prioridade: morte/doença/sono/necessidades urgentes > animações espontâneas.
- Decisões de comportamento podem ser visuais e efêmeras; não simular cada frame enquanto a aba estiver fechada.
- Se algum comportamento afetar o estado persistente, processá-lo por eventos determinísticos com timestamp.

## Mortalidade e ausência
- Preservar morte permanente por negligência e velhice.
- Longevidade deve considerar histórico de cuidados, com limites inferior/superior explícitos; números ainda não aprovados.
- Processamento offline deve ser equivalente ao tempo decorrido, sem punição adicional simplesmente por fechar a página.
- Tratar relógio do sistema retrocedendo sem corromper dados.

## UX e acessibilidade
- Dispositivo e LCD reconhecíveis, com sprites originais (não copiar personagens da Bandai).
- Três botões operacionais no teclado e em toque.
- Textos curtos e legíveis em telas pequenas; estados importantes não dependem apenas de som ou cor.
- Preferência de som preservada.
