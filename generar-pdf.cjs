#!/usr/bin/env node
/**
 * generar-pdf.js
 * Convierte memoria_proyecto_DAM.md → HTML autocontenido con Mermaid renderizado.
 * Ejecutar: node generar-pdf.js
 * Luego: Ctrl+P en el navegador → "Guardar como PDF" → A4, márgenes mínimos
 */

const fs = require('fs');
const path = require('path');

// ── Configuración ─────────────────────────────────────────────────────────────
const INPUT_MD  = path.join(__dirname, '../.gemini/antigravity/brain/5ce66d10-a72d-4476-85f0-02bcd7705c20/memoria_proyecto_DAM.md');
const OUTPUT_HTML = path.join(__dirname, 'memoria_proyecto_DAM.html');

// ── Leer markdown ─────────────────────────────────────────────────────────────
const md = fs.readFileSync(INPUT_MD, 'utf-8');

// ── Convertir Markdown → HTML básico (sin dependencias npm) ───────────────────
function mdToHtml(text) {
  let html = text
    // Encabezados
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Negrita e itálica
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Código inline
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Separadores
    .replace(/^---$/gm, '<hr>')
    // Listas no ordenadas
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Listas ordenadas
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Bloques de código Mermaid
    .replace(/```mermaid\n([\s\S]*?)```/g, (_, code) =>
      `<div class="mermaid">${code.trim()}</div>`)
    // Bloques de código normales
    .replace(/```[\w]*\n([\s\S]*?)```/g, (_, code) =>
      `<pre><code>${escapeHtml(code.trim())}</code></pre>`)
    // Tablas markdown
    .replace(/^\|(.+)\|$/gm, '<tr-raw>$1</tr-raw>');

  // Procesar tablas
  html = processMarkdownTables(html);

  // Wrap listas
  html = html
    .replace(/(<li>[\s\S]*?<\/li>(?:\s*<li>[\s\S]*?<\/li>)*)/g,
      (m) => m.includes('<li>') ? `<ul>${m}</ul>` : m);

  // Párrafos: líneas que no son etiquetas HTML
  const lines = html.split('\n');
  const result = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) { result.push(''); continue; }
    const isHtmlTag = /^<(h[1-6]|ul|ol|li|pre|table|tr|th|td|hr|div|blockquote|code)/.test(line)
      || /^<\/(ul|ol|table|tr|blockquote)>$/.test(line);
    result.push(isHtmlTag ? line : `<p>${line}</p>`);
  }
  return result.join('\n');
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function processMarkdownTables(html) {
  // Detectar y convertir filas marcadas como <tr-raw>
  const rows = html.split('\n');
  let inTable = false;
  let headerDone = false;
  const out = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row.startsWith('<tr-raw>')) {
      const cells = row.replace('<tr-raw>', '').replace('</tr-raw>', '')
        .split('|').map(c => c.trim()).filter(c => c !== '');

      if (!inTable) {
        inTable = true;
        headerDone = false;
        out.push('<table>');
        // Esta primera fila es el header
        out.push('<thead><tr>' + cells.map(c => `<th>${c}</th>`).join('') + '</tr></thead>');
        out.push('<tbody>');
        headerDone = true;
        // Saltar la fila de separadores (---)
        if (rows[i+1] && rows[i+1].includes('---')) i++;
      } else {
        out.push('<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>');
      }
    } else {
      if (inTable) {
        out.push('</tbody></table>');
        inTable = false;
        headerDone = false;
      }
      out.push(row);
    }
  }
  if (inTable) out.push('</tbody></table>');
  return out.join('\n');
}

// ── Convertir ─────────────────────────────────────────────────────────────────
const bodyHtml = mdToHtml(md);

// ── Plantilla HTML completa ───────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Memoria de Proyecto — Cafetería Escolar App</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    /* ── Base ───────────────────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      font-size: 13px;
      line-height: 1.7;
      color: #1a1a1a;
      background: #fff;
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 48px;
    }

    /* ── Encabezados ────────────────────────────────────── */
    h1 {
      font-size: 22px;
      color: #1e3a5f;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 8px;
      margin: 32px 0 16px;
    }
    h2 {
      font-size: 18px;
      color: #1e3a5f;
      border-left: 4px solid #2563eb;
      padding-left: 12px;
      margin: 28px 0 12px;
    }
    h3 {
      font-size: 14px;
      color: #374151;
      margin: 20px 0 8px;
      font-weight: bold;
    }
    h4 { font-size: 13px; color: #4b5563; margin: 16px 0 6px; }

    /* ── Párrafos y texto ───────────────────────────────── */
    p { margin: 8px 0; }
    strong { font-weight: 700; }
    em { font-style: italic; }
    code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 11.5px;
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 3px;
      padding: 1px 5px;
    }
    pre {
      background: #1e293b;
      color: #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      overflow-x: auto;
      font-size: 11.5px;
      font-family: 'Courier New', Courier, monospace;
      margin: 14px 0;
    }
    pre code {
      background: none;
      border: none;
      padding: 0;
      color: inherit;
      font-size: inherit;
    }

    /* ── Separadores ────────────────────────────────────── */
    hr {
      border: none;
      border-top: 1px solid #e5e7eb;
      margin: 28px 0;
    }

    /* ── Listas ─────────────────────────────────────────── */
    ul, ol {
      padding-left: 24px;
      margin: 8px 0;
    }
    li { margin: 4px 0; }

    /* ── Tablas ─────────────────────────────────────────── */
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 14px 0;
      font-size: 12px;
    }
    th {
      background: #1e3a5f;
      color: #fff;
      padding: 8px 12px;
      text-align: left;
      font-weight: 600;
    }
    td {
      padding: 7px 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    tr:nth-child(even) td { background: #f8fafc; }
    tr:hover td { background: #eff6ff; }

    /* ── Mermaid ─────────────────────────────────────────── */
    .mermaid {
      text-align: center;
      margin: 20px 0;
      padding: 16px;
      background: #fafafa;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      overflow-x: auto;
    }

    /* ── Impresión ──────────────────────────────────────── */
    @media print {
      body { padding: 20px 32px; font-size: 11.5px; }
      h1 { font-size: 18px; }
      h2 { font-size: 15px; }
      h3 { font-size: 12px; }
      .mermaid { page-break-inside: avoid; }
      table { page-break-inside: avoid; }
      h2, h3 { page-break-after: avoid; }
      pre { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
${bodyHtml}
<script>
  mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    themeVariables: {
      primaryColor: '#dbeafe',
      primaryTextColor: '#1e3a8a',
      primaryBorderColor: '#3b82f6',
      lineColor: '#64748b',
      fontSize: '12px'
    },
    flowchart: { htmlLabels: true, curve: 'basis' },
    er: { diagramPadding: 20 },
    sequence: { diagramMarginX: 30, actorMargin: 80 }
  });
</script>
</body>
</html>`;

// ── Escribir fichero ──────────────────────────────────────────────────────────
fs.writeFileSync(OUTPUT_HTML, html, 'utf-8');
console.log('✅ HTML generado:', OUTPUT_HTML);

// ── Abrir en el navegador ─────────────────────────────────────────────────────
const { exec } = require('child_process');
const open = process.platform === 'linux'
  ? `xdg-open "${OUTPUT_HTML}"`
  : process.platform === 'darwin'
    ? `open "${OUTPUT_HTML}"`
    : `start "${OUTPUT_HTML}"`;

exec(open, (err) => {
  if (err) {
    console.log('⚠️  No se pudo abrir automáticamente. Abre manualmente:', OUTPUT_HTML);
  } else {
    console.log('🌐 Abierto en el navegador. Usa Ctrl+P → "Guardar como PDF" → A4');
    console.log('   Recomendación de impresión:');
    console.log('   - Destino: Guardar como PDF');
    console.log('   - Papel: A4');
    console.log('   - Márgenes: Mínimo o Ninguno');
    console.log('   - Marcar: "Gráficos de fondo"');
  }
});
