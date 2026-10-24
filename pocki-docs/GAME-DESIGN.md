# Game Design — Pocki

## Referência e fidelidade
Inspirar-se no conjunto de ações e no ritmo do Tamagotchi P1, sem afirmar emulação exata de sua ROM ou replicação dos parâmetros proprietários. Onde o comportamento histórico não estiver suficientemente definido, usar os parâmetros simples abaixo, centralizados em configuração, sem criar subsistemas novos.

## Interface e controles
Tela central com aparência LCD e ícones de ação. Três botões virtuais e teclas `A`, `B`, `C`: A percorre os ícones/opções; B confirma; C volta/cancela. Indicar o ícone selecionado. O mouse/toque pode clicar nos três botões; evitar exigir interação direta em elementos minúsculos. Mostrar feedback visual e sons curtos (se habilitados).

## Ações
1. Alimentar: refeição aumenta saciedade até o limite; doce aumenta felicidade, mas consumo excessivo eleva risco de doença e peso.
2. Luz: apagar ao dormir; acender quando acordado. Sono começa e termina automaticamente conforme a faixa etária; luz acesa durante o sono prejudica cuidado.
3. Brincar: minijogo curto de adivinhação esquerda/direita, com escolha por A e confirmação B; vitória aumenta felicidade; partida não exige habilidade motora ou animações complexas.
4. Medicina: só tem efeito relevante quando doente; permite tratar em poucas aplicações com resultado determinístico.
5. Limpar: remove sujeiras acumuladas e reduz risco de doença.
6. Status: consultar idade, peso, fome, felicidade, disciplina e estado de saúde; indicadores visuais em corações/ícones.
7. Disciplina: aplicar apenas quando houver chamada injustificada ou recusa injustificada de comida/brincadeira; disciplinar fora dessas condições é penalizado.
8. Atenção: ícone de alerta e som quando houver necessidade legítima ou chamada injustificada; o usuário deve conseguir distinguir os casos consultando status e comportamento.
9. Morte/recomeço: tela final com idade e botão para começar um novo ovo; nunca apagar o estado anterior sem confirmação explícita do reinício.

## Estados
`egg`, `baby`, `child`, `teen`, `adult`, `dead`. Estado adicional de atividade: `awake` ou `asleep`; condição: `healthy` ou `sick`. Não modelar cada combinação como classe própria.

## Regras de tempo e evolução
- Relógio real: usar `Date.now()` e timestamps salvos. Um minuto real corresponde a um minuto no jogo.
- Eclosão: 5 minutos após criação do ovo.
- Bebê: 1 hora após eclosão; criança: até 24 horas de idade; adolescente: até 72 horas; adulto: a partir de 72 horas. Idade é calculada desde a eclosão, não desde a criação do ovo.
- Adultos têm pelo menos duas aparências originais, escolhidas deterministicamente pela qualidade do cuidado acumulado (não apenas pelo status no momento da evolução).
- Sono: bebê dorme das 20h às 8h; criança das 21h às 8h; adolescente das 22h às 8h; adulto das 22h às 9h, no horário local. Estes horários são aproximações de projeto, não dados oficiais do P1.
- Vida adulta: a criatura pode morrer por negligência ou velhice; morte por velhice começa a ser avaliada após 14 dias de idade, sem duração fixa garantida. Implementar de modo determinístico e documentado.

## Indicadores e degradação
- Fome e felicidade em 0–4 corações, inicializados em 3.
- Reduzir fome em 1 coração a cada 3 horas e felicidade em 1 a cada 4 horas enquanto viva, exceto ovo. Durante o sono, continuar a degradação para evitar exploração do relógio, mas não gerar alertas sonoros.
- Refeição recupera 1 coração; doce recupera 1 de felicidade. Minijogo vencido recupera 1 de felicidade.
- Peso começa em valor abstrato 5, sobe 1 com alimentação e cai 1 por brincadeira, limitado a 5–30. É indicador lúdico, não quilogramas reais.
- Sujeira: gerar uma ocorrência a cada 4 horas de vida após a eclosão, com máximo de 3 visíveis.
- Se fome ou felicidade ficar em zero por períodos prolongados, ou houver sujeira acumulada, registrar falhas de cuidado. Não matar instantaneamente ao chegar a zero.
- Doença: após 6 horas contínuas em condição crítica (fome zero ou 3 sujeiras), marcar `sick`; medicina remove doença após duas aplicações separadas por pelo menos 1 minuto, desde que o ambiente tenha sido limpo quando necessário.
- Morte por negligência: após 24 horas contínuas de condição crítica sem resolução, marcar `dead`.
- Disciplina: 0–4 pontos. Uma chamada injustificada pode surgir uma vez a cada 8 horas acordado se as necessidades estiverem atendidas. Disciplina correta soma 1; incorreta registra erro de cuidado. Evitar aleatoriedade não persistida.
- Qualidade do cuidado: contar períodos críticos, chamadas ignoradas, disciplina inadequada e luz acesa durante o sono. Evolução adulta melhor se houver no máximo 2 erros totais; caso contrário, outra aparência. Não introduzir árvore extensa de personagens.

## Reconciliação do tempo offline
O jogo deve avançar de forma consistente após horas ou dias fechado, sem executar loops minuto a minuto. Processar intervalos e eventos por timestamps. Não reproduzir dezenas de sons/avisos retroativos. Não permitir voltar o relógio do sistema para rejuvenescer o personagem: caso `Date.now()` seja menor que o último instante processado, não retroceder o estado e aguardar o relógio alcançá-lo. Aceitar que LocalStorage não impede manipulação deliberada do save.

## Áudio e acessibilidade
Áudio começa silenciado até interação do usuário, respeitando restrições do navegador; opção de ligar/desligar. Controles acessíveis por teclado, foco visível, textos alternativos/ARIA para ícones e status, e opção de reduzir animações via `prefers-reduced-motion`.
