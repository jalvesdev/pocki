# Pocki

Pocki é um bichinho virtual para navegador, feito com HTML, CSS e JavaScript sem dependências de produção. O estado do jogo fica no `localStorage` deste navegador e avança usando timestamps mesmo quando a página está fechada.

## Executar

Abra `index.html` em um navegador moderno. Como os módulos JavaScript ES podem ser bloqueados em URLs `file://`, a forma mais confiável é iniciar um servidor estático na pasta do projeto:

```sh
python3 -m http.server 8000
```

Então acesse `http://localhost:8000`. Não há instalação nem conexão com a internet necessária.

## Jogar

- **A**: percorrer ações; durante o jogo, trocar a escolha esquerda/direita.
- **B**: confirmar ação; no minijogo, confirmar palpite.
- **C**: voltar ou cancelar.
- Clique nos botões na tela para jogar por toque ou mouse.
- Os sons começam desligados. Ative-os pelo botão musical depois de uma interação.

## Testes de lógica

Node.js é necessário somente para executar os testes de desenvolvimento:

```sh
npm test
```

## Limitações

O save é local à origem/navegador. Limpar dados do site, trocar de navegador ou editar o relógio deliberadamente pode afetar a partida. A morte por velhice ocorre deterministicamente aos 21 dias de idade, após o início da avaliação aos 14 dias. A arte é CSS original e simplificada; chamadas legítimas automáticas por recusa de cuidado não fazem parte do MVP.
