# Pocki — Visão de produto e decisões (nova fase)

**Status:** planejamento aprovado; implementação não autorizada por este documento.
**Referência:** repositório `jalvesdev/pocki`, versão consultada em 24/10/2026.

## Visão
Pocki é um bichinho virtual de navegador com universo original de criaturas, cujo desenvolvimento, comportamento e vínculo refletem os cuidados recebidos. Preserva a identidade de dispositivo retrô com LCD e três botões. Deve continuar simples, acessível em desktop e celular e funcionar sem backend obrigatório.

## Decisões vinculantes
| ID | Escolha | Requisito |
|---|---|---|
| DEC-011 | B | Universo de espécies originais, distintas visualmente e com possibilidades evolutivas próprias. |
| DEC-012 | B | Espécie revelada durante a evolução; cuidados influenciam a espécie, sem espécie fixa no ovo. |
| DEC-013 | C | Personalidade moldada pelas experiências; tendências iniciais leves; dimensões propostas: sociabilidade, energia, curiosidade. |
| DEC-014 | B | Vínculo/confiança progressivos, percebidos em reações; evitar penalizar excessivamente ausências. |
| DEC-015 | A | Ciclo clássico: nascimento, crescimento, velhice e morte; negligência pode antecipar a morte; bons cuidados podem favorecer longevidade; novo ovo após morte. |
| DEC-016 | A | Refeição e guloseima apenas; refeição reduz fome, guloseima favorece felicidade com consequências possíveis do excesso. |
| DEC-017 | B | Três ou quatro minijogos curtos, acessíveis a todas as espécies, compatíveis com três botões. |
| DEC-018 | B | Comportamentos espontâneos modulados por personalidade; necessidades, doenças e sono têm prioridade. |
| DEC-019 | B | Ambientes alternáveis dentro do LCD; início proposto: quarto, jardim e área de brincadeiras. |
| DEC-020 | B | Retrô modernizado; preservar carcaça, LCD, três botões; refinar sprites, expressões e transições gradualmente. |

## Princípios de experiência
- O jogador influencia o desenvolvimento, mas não controla totalmente os resultados.
- Cada vida tem fim; não implementar imortalidade, ressurreição ou substituição automática por coleção de criaturas vivas.
- Simplicidade primeiro: sem moeda, loja, inventário, conta, login, sincronização em nuvem, mundo aberto ou IA generativa nesta fase.
- Um único Pocki ativo por partida; dados locais e simulação temporal offline.
- A personalidade deve alterar reações e comportamento, não impor tarefas incessantes.
- A morte deve ser compreensível; não tornar a sobrevivência dependente de manter a aba aberta.

## Critérios de aceitação do produto
1. Pelo menos três espécies originais distinguíveis ao alcançar a fase de revelação (quantidade exata sujeita à validação).
2. Caminhos de evolução reproduzíveis em testes a partir de padrões distintos de cuidado.
3. Duas criaturas da mesma espécie podem apresentar reações diferentes por personalidade/vínculo.
4. Minijogos operam com A/B/C por teclado, mouse e toque.
5. Quarto, jardim e brincadeiras são navegáveis sem perder ações essenciais.
6. O jogo continua a avançar ao reabrir a página, com relógio real.
7. Partidas antigas válidas não são apagadas silenciosamente.
8. Morte por negligência e velhice preservadas, com longevidade influenciada por cuidado.

## Questões abertas (não presumir aprovação)
- Número, nomes e artes finais das espécies.
- Momento exato da revelação da espécie e matriz evolutiva.
- Quantidade final e regras dos minijogos.
- Pesos/limiares da personalidade, do vínculo e da longevidade.
- Duração de cada fase e equilíbrio da mortalidade.
- Se haverá registro de vidas passadas; DEC-015 A não exige álbum.

## DEC-021 e DEC-022 — aprovadas em 24/10/2026
- **DEC-021 B:** saves v1 adultos com `adultForm: 'sun' | 'moon'` serão convertidos em espécies novas **somente na Fase 2**, após definição do catálogo e do mapeamento. A Fase 1 preserva integralmente a aparência e o campo `adultForm`, sem conversão visual.
- **DEC-022 B:** schema v2 mínimo e extensível. Adicionar apenas versão e identificação de origem/legado estritamente necessárias, preservando os campos v1. Não criar antecipadamente `speciesId`, `personality`, `bond`, `scene` ou históricos não definidos.
- A Fase 1 não muda jogabilidade, arte, evolução, minijogos, mortalidade nem publicação.
