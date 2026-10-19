'use strict';
// Gera o index.html a partir do links.json. Sem dependências: rode com
//   node gerar.js
// Link (ou apresentação) com marcador entre colchetes, como [INSTAGRAM DO VINI],
// não entra na página. Links de redes sociais (Instagram, TikTok, YouTube,
// WhatsApp, Facebook, X) viram ícones no rodapé; os outros, botões.

const fs = require('fs');
const path = require('path');

const ENDERECO = 'https://rafacz192.github.io/vininavunesp-links/';
const TITULO = 'Vini na Vunesp · Links';
const DESCRICAO = 'Materiais Vunesp gratuitos, apostilas discursivas e professores parceiros do Vini na Vunesp.';

const dados = JSON.parse(fs.readFileSync(path.join(__dirname, 'links.json'), 'utf8'));

const escapar = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const temMarcador = (s) => /\[[^\]]*\]/.test(String(s || ''));
const urlValida = (s) => {
  try { const u = new URL(s); return u.protocol === 'https:' || u.protocol === 'mailto:'; } catch { return false; }
};

// Ícones (SVG inline, cor do texto).
const ICONES = {
  instagram: { nome: 'Instagram', svg: '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.3" fill="currentColor"/>' },
  tiktok: { nome: 'TikTok', svg: '<path fill="currentColor" d="M16.6 3c.3 2.2 1.6 3.6 3.9 3.8v3.1c-1.4.1-2.7-.3-3.9-1.1v6.3c0 3.9-3.1 6.4-6.6 5.8-2.6-.5-4.5-2.8-4.5-5.5 0-3.4 3.1-6 6.6-5.4v3.3c-1.6-.5-3.3.6-3.3 2.2 0 1.3 1 2.3 2.3 2.3 1.4 0 2.3-1 2.3-2.6V3h3.2z"/>' },
  youtube: { nome: 'YouTube', svg: '<rect x="2" y="5" width="20" height="14" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path fill="currentColor" d="M10 9l5 3-5 3z"/>' },
  whatsapp: { nome: 'WhatsApp', svg: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M4 20l1.2-3.8A8.5 8.5 0 1 1 8 19z"/><path fill="currentColor" d="M9.2 8.2c.2-.4.5-.4.8-.4h.4c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .5-.1.6l-.5.6c.6 1.2 1.6 2.1 2.7 2.7l.6-.5c.2-.2.4-.2.6-.1l1.5.7c.2.1.4.3.4.5v.4c0 .3-.1.6-.4.8-.6.5-1.5.7-2.3.4a9 9 0 0 1-4.9-4.9c-.3-.8-.1-1.8.3-2.3z"/>' },
  facebook: { nome: 'Facebook', svg: '<path fill="currentColor" d="M13.5 21v-7.5H16l.4-3h-2.9V8.7c0-.9.3-1.5 1.5-1.5h1.5V4.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.3H8.1v3h2.5V21z"/>' },
  x: { nome: 'X', svg: '<path fill="currentColor" d="M17.8 3h3.1l-6.8 7.7 8 10.3h-6.3l-4.9-6.4L5.3 21H2.2l7.3-8.3L1.9 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"/>' },
};
function redeDe(url) {
  let host;
  try { host = new URL(url).hostname.replace(/^www\./, ''); } catch { return null; }
  if (host === 'instagram.com') return 'instagram';
  if (host === 'tiktok.com') return 'tiktok';
  if (host === 'youtube.com' || host === 'youtu.be') return 'youtube';
  if (host === 'wa.me' || host === 'whatsapp.com' || host.endsWith('.whatsapp.com')) return 'whatsapp';
  if (host === 'facebook.com') return 'facebook';
  if (host === 'x.com' || host === 'twitter.com') return 'x';
  return null;
}

// Confere o arquivo e separa botões e redes.
const avisos = [];
const botoes = [];
const redes = [];
for (const [i, l] of (dados.links || []).entries()) {
  const titulo = String(l.titulo || '').trim();
  const url = String(l.url || '').trim();
  if (temMarcador(titulo) || temMarcador(url)) { avisos.push(`"${titulo}" ainda tem marcador; ficou fora da página.`); continue; }
  if (!titulo) { avisos.push(`O link ${i + 1} está sem título; ficou fora.`); continue; }
  if (!urlValida(url)) { avisos.push(`"${titulo}": o endereço precisa começar com https:// (está "${url}"); ficou fora.`); continue; }
  const rede = redeDe(url);
  if (rede) redes.push({ titulo, url, rede });
  else botoes.push({ titulo, url, destaque: l.destaque === true });
}
const apresentacao = String(dados.apresentacao || '').trim();
if (temMarcador(apresentacao)) avisos.push('A apresentação ainda tem marcador; ficou fora da página.');

const link = (url) => `href="${escapar(url)}" rel="noopener"`;
const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapar(TITULO)}</title>
<meta name="description" content="${escapar(DESCRICAO)}">
<meta name="theme-color" content="#192863">
<meta name="referrer" content="strict-origin-when-cross-origin">
<link rel="canonical" href="${ENDERECO}">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="Vini na Vunesp">
<meta property="og:title" content="${escapar(TITULO)}">
<meta property="og:description" content="${escapar(DESCRICAO)}">
<meta property="og:url" content="${ENDERECO}">
<meta property="og:image" content="${ENDERECO}compartilhar.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Logo do Vini na Vunesp">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="preload" href="fontes/poppins-700.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="estilo.css">
</head>
<body>
<div class="faixa" aria-hidden="true"></div>
<main class="pagina">
  <h1 class="topo">
    <img class="logo" src="logo.webp" width="600" height="480" alt="Vini na Vunesp">
  </h1>
${apresentacao && !temMarcador(apresentacao) ? `  <p class="apresentacao">${escapar(apresentacao)}</p>\n` : ''}  <ul class="links">
${botoes.map((b) => `    <li><a class="botao${b.destaque ? ' botao--destaque' : ''}" ${link(b.url)}>${escapar(b.titulo)}</a></li>`).join('\n')}
  </ul>
</main>
<footer class="rodape">
${redes.length ? `  <ul class="redes">
${redes.map((r) => `    <li><a class="rede" ${link(r.url)} aria-label="${escapar(r.titulo || ICONES[r.rede].nome)}"><svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" focusable="false">${ICONES[r.rede].svg}</svg></a></li>`).join('\n')}
  </ul>
` : ''}  <p class="assinatura">Vini na Vunesp</p>
  <div class="faixa" aria-hidden="true"></div>
</footer>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log(`index.html gerado: ${botoes.length} ${botoes.length === 1 ? 'botão' : 'botões'}, ${redes.length} ${redes.length === 1 ? 'ícone de rede' : 'ícones de rede'}.`);
for (const a of avisos) console.log(`Aviso: ${a}`);
