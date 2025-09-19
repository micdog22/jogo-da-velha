# Jogo da Velha — Web (1 Jogador vs CPU ou 2 Jogadores)

Jogo da Velha responsivo e moderno, feito com HTML, CSS e JavaScript puro. Oferece dois modos de jogo (1 jogador vs CPU com IA e 2 jogadores locais), opção de escolher X ou O, placar persistente, três níveis de dificuldade para a CPU e alternância de tema claro/escuro.

## Demonstração local

1. Baixe este repositório e extraia os arquivos.
2. Abra o arquivo `index.html` diretamente no navegador.
   - Não há dependências externas além de fontes do Google Fonts.
   - Também funciona perfeitamente no GitHub Pages por ser um projeto estático.

## Recursos

- 2 modos de jogo: 1 jogador (vs CPU) e 2 jogadores locais (turnos alternados).
- Escolha do símbolo do Jogador 1 (X ou O).
- CPU com três níveis de dificuldade:
  - Fácil: movimentos aleatórios.
  - Normal: heurística simples (ganha, bloqueia, prioriza centro/cantos).
  - Imbatível: algoritmo Minimax, não perde.
- Placar persistente em `localStorage` (vitórias de X, O e empates).
- Visual elegante, animações sutis, layout responsivo.
- Tema claro/escuro com persistência em `localStorage`.
- Acessibilidade básica: uso de `role="grid"` e `aria-live` para o status.
- Sem frameworks: apenas HTML, CSS e JS.

## Estrutura

```
.
├── index.html
├── assets/
│   ├── styles.css
│   └── script.js
├── LICENSE
└── README.md
```

## Como jogar

1. Use o botão **Configurações** para escolher:
   - Modo de jogo: **1 Jogador (vs CPU)** ou **2 Jogadores**.
   - Símbolo do Jogador 1: **X** ou **O**.
   - Dificuldade da CPU: **Fácil**, **Normal** ou **Imbatível**.
2. Clique em uma célula vazia para jogar.
3. No modo CPU, quando for a vez da IA, aguarde a jogada automática.
4. Use **Nova Partida** para recomeçar sem zerar o placar.
5. Use **Zerar Placar** para reiniciar todas as contagens.

## Publicando no GitHub Pages

1. Faça o fork ou crie um repositório e envie estes arquivos.
2. No repositório, vá em **Settings > Pages**.
3. Em **Branch**, selecione `main` (ou `master`) e salve.
4. A página estará disponível em `https://seu-usuario.github.io/nome-do-repo/`.

## Desenvolvimento

- O projeto foi construído com JavaScript moderno e sem bundlers.  
- Caso queira evoluir:
  - Adicione testes de unidade para a lógica do jogo.
  - Acrescente animações extras ao destacar a linha vencedora.
  - Implemente suporte a teclado para navegação nas células.

## Compatibilidade

- Testado nos navegadores modernos baseados em Chromium, Firefox e Safari.
- O modo escuro segue a preferência do sistema, mas pode ser alternado manualmente.

## Licença

Este projeto está sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.
