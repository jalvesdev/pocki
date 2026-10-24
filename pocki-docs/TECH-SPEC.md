# Especificação técnica — Pocki

## Stack e restrições
HTML5, CSS3, JavaScript ES2022 sem dependências de produção, sem backend, sem bundler e sem banco remoto. `localStorage` para salvar uma única partida. Assets autorais em SVG/CSS ou sprites originais. Arquitetura enxuta; não criar classes ou padrões abstratos sem necessidade.

## Estrutura sugerida
```
index.html
styles.css
src/
  config.js       # parâmetros de jogo
  game.js         # transições e regras puras
  storage.js      # persistência e migração simples
  ui.js           # renderização e controles
  main.js         # inicialização e atualização
assets/           # sprites/ícones originais, se necessários
README.md
GAME-DESIGN.md
TECH-SPEC.md
```
Pode simplificar arquivos se preservar a separação lógica.

## Estado salvo
Um único objeto versionado (`schemaVersion: 1`) com `createdAt`, `hatchedAt`, `lastProcessedAt`, `stage`, `health`, `hunger`, `happiness`, `weight`, `discipline`, `poopCount`, `lightsOn`, `sick`, `medicineDoses`, `lastMedicineAt`, `criticalSince`, `careMistakes`, `unjustifiedCallAt`, `unjustifiedCallHandled`, `deathReason`, `soundEnabled`, e timestamps dos próximos eventos relevantes. Evitar salvar valores puramente derivados, ou recalculá-los e validar na leitura.

## Motor do jogo
Expor funções testáveis `createGame(now)`, `advanceGame(state, now)`, `applyAction(state, action, now)` e `getViewModel(state, now)`. Preferir funções puras (retornam novo estado). Toda ação deve avançar o relógio antes de modificar o estado. `advanceGame` deve ser idempotente no mesmo instante e produzir resultado equivalente para avanço contínuo e salto offline. Centralizar constantes em `config.js`. Eventos de vida e degradação precisam de ordenação explícita, especialmente quando o salto atravessar evolução, sono, doença e morte.

## Persistência
Salvar após ações e atualizações relevantes, com debounce leve se necessário; salvar no `visibilitychange`/`pagehide`. Ler, validar e reconciliar ao iniciar. Para JSON inválido, não sobrescrever silenciosamente: mostrar erro e opção de reiniciar após confirmação. `localStorage` é local ao navegador/origem e pode ser apagado pelo usuário; documentar essa limitação. Não exigir conexão de rede.

## Interface
Layout responsivo com chaveiro centralizado, LCD legível e três botões. Teclas A/B/C e cliques/toques. Navegação circular de ícones, feedback para ação indisponível, tela de ovo, personagem, sono, doença e morte. Não usar marca, personagens ou arte copiada. Visual moderno com estética de LCD e pixel art original.

## Atualização
Usar timer de interface com frequência baixa (por exemplo, 1 segundo) enquanto a página está visível; nunca depender dele para calcular o estado. Ao voltar à aba, reconciliar imediatamente. Pausar renderizações desnecessárias quando a página não estiver visível. Respeitar a preferência por movimento reduzido.

## Testes de aceitação obrigatórios
1. Primeira abertura cria ovo; após 5 minutos reais, eclode.
2. Botões A/B/C e teclado navegam, confirmam e cancelam corretamente.
3. Refeição, doce, minijogo, limpeza, luz, medicina e disciplina alteram somente o que suas regras permitem.
4. Fome/felicidade não ultrapassam 0–4; peso e disciplina respeitam limites.
5. O sono obedece ao horário local e a luz tem consequências quando deixada acesa.
6. A criatura evolui por idade; a aparência adulta depende de histórico de cuidado.
7. Doença e morte por negligência respeitam os intervalos configurados.
8. Uma chamada injustificada pode ser disciplinada; punição sem motivo conta como erro.
9. Fechar a página por várias horas e reabrir produz o mesmo estado que simular avanço equivalente.
10. Atualizar a página não apaga a partida; reiniciar requer confirmação.
11. JSON corrompido gera aviso e não é substituído sem consentimento.
12. Relógio do sistema atrasado não reverte idade, eventos ou morte.
13. Layout funciona em celular e desktop, sem rolagem horizontal.
14. Sons não tocam antes de interação/autorização; opção de silenciar funciona.
15. Não há chamadas de rede, instalação ou dependências de produção.

## Testes automatizados
Criar testes de lógica com `node:test` (biblioteca nativa do Node, somente para desenvolvimento), injetando timestamps fixos; cobrir limites, transições, idempotência, salto offline, doença, morte, evolução e regressão de relógio. Não exigir Node para jogar.

## Entrega
O Codex deve implementar em etapas curtas: motor + testes; interface; persistência + integração; revisão final. Executar testes e relatar resultados. Não criar novas funcionalidades sem solicitar aprovação. Não iniciar implementação enquanto estiver apenas revisando a documentação.
