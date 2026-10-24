# Pocki — especificação do projeto

**Nome do projeto:** Pocki (`pocki`).

## Objetivo
Criar um jogo Pocki para navegador, inspirado na experiência do Tamagotchi P1 (1996), usando HTML5, CSS3 e JavaScript puro. O resultado deve ser pequeno, funcional, responsivo e jogável sem instalação ou servidor.

## Decisões aprovadas
- DEC-001 B: visual retrô modernizado, com identidade e sprites originais.
- DEC-002 B: evolução por estágios, com aparência influenciada pelos cuidados.
- DEC-003 A: passagem do tempo real, inclusive durante o fechamento da página.
- DEC-004 B: fidelidade funcional maior ao P1, mantendo implementação enxuta.

## Escopo do MVP
Ovo e nascimento; estágios de vida; alimentação (refeição e doce); minijogo; luz e sono; limpeza; medicina; status; disciplina; chamadas de atenção; doença; morte e reinício. Interface de três botões A/B/C e menu de ícones. Sons opcionais com controle para silenciar. Salvamento local automático.

## Fora de escopo
Cadastro, servidor, nuvem, multiplayer, loja, moedas, missões, conquistas, customização de criatura, importação de assets protegidos, PWA, notificações push e framework de UI.

## Experiência esperada
Ao abrir pela primeira vez, o usuário vê um ovo. Após a eclosão, cuida de um personagem em uma tela LCD estilizada. O bichinho segue rotinas de sono e necessidade; cuidados consistentes afetam a evolução. A página pode ser fechada sem congelar o tempo do jogo.

## Princípios
1. Priorizar uma experiência completa em vez de adicionar recursos.
2. Manter regras determinísticas e fáceis de testar.
3. Evitar bibliotecas e infraestrutura sem necessidade comprovada.
4. Não copiar personagens, logotipos ou sprites da Bandai.
5. Separar o motor de jogo da renderização e do armazenamento.

## Execução esperada
Entregar `index.html` abrível em navegador moderno, sem build. Se o uso de módulos ES causar restrições ao abrir por `file://`, documentar um servidor estático local simples (por exemplo `python -m http.server`) e não introduzir ferramenta de build.

## Critério de conclusão
O projeto termina quando todas as ações principais, o ciclo de vida, a persistência e os testes manuais descritos em `TECH-SPEC.md` funcionarem. Não ampliar o escopo sem aprovação.
