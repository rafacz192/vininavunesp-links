# Vini na Vunesp · Links

Página de links da bio do Instagram: https://rafacz192.github.io/vininavunesp-links/

## Trocar um link

1. Abra o `links.json` num editor de texto (o Bloco de Notas serve).
2. Cada link é uma linha assim:
   ```json
   { "titulo": "Apostilas", "url": "https://vininavunesp.3dprintlabs.com.br/apostilas", "destaque": false },
   ```
   - `titulo`: o texto do botão.
   - `url`: o endereço completo, começando com `https://`.
   - `destaque`: `true` deixa o botão amarelo; `false`, branco.
   - A ordem das linhas é a ordem dos botões. Toda linha termina com vírgula, menos a última.
   - Links do Instagram, TikTok, YouTube, WhatsApp, Facebook e X viram ícones no rodapé, em vez de botões.
   - `apresentacao` (no começo do arquivo) é a frase embaixo do logo.
   - Enquanto um texto tiver `[colchetes]`, como `[INSTAGRAM DO VINI]`, ele não aparece na página.
3. Salve e gere a página, no terminal, dentro desta pasta:
   ```
   node gerar.js
   ```
   Ele mostra quantos botões entraram e avisa o que ficou de fora.

## Publicar de novo

Ainda no terminal, nesta pasta:

```
git add -A
git commit -m "Atualiza links"
git push
```

Em um ou dois minutos o GitHub Pages mostra a página nova.

## O que tem aqui

- `links.json`: os links (é o único arquivo que precisa mudar).
- `gerar.js`: gera o `index.html` a partir do `links.json` (Node, sem instalar nada).
- `index.html` e `estilo.css`: a página.
- `logo.webp`, `favicon-32.png`, `apple-touch-icon.png`, `compartilhar.jpg`: imagens (logo e prévia para quando o link é compartilhado).
- `fontes/`: Poppins Bold e Source Sans 3, servidas daqui (nada é carregado de terceiros).
